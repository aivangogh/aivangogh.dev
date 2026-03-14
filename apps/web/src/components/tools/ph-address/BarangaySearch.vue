<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { getAllRegions, getProvincesByRegion, getMunicipalitiesByProvince } from '@aivangogh/ph-address'
import { getBarangayIndex } from '@/lib/ph-address-index'
import type { BarangayEntry } from '@/lib/ph-address-index'
import { useLockState } from '@/composables/useLockState'
import { useClipboard } from '@/composables/useClipboard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@aivangogh/ui/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aivangogh/ui/components/ui/table'
import { Badge } from '@aivangogh/ui/components/ui/badge'
import { Button } from '@aivangogh/ui/components/ui/button'
import { Input } from '@aivangogh/ui/components/ui/input'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardCheckIcon, CopyIcon, RotateCcwIcon, SearchIcon } from 'lucide-vue-next'
import FilterDropdown from './FilterDropdown.vue'

const PAGE_SIZE = 50

const route = useRoute()
const router = useRouter()

// — Hydrate from URL —
const flockParam = ((route.query.flock as string) || '').split(',')

const filterRegion = ref((route.query.fr as string) || '')
const filterProvince = ref((route.query.fp as string) || '')
const filterMunicipality = ref((route.query.fm as string) || '')

const lockedRegion = ref(flockParam.includes('r'))
const lockedProvince = ref(flockParam.includes('p'))
const lockedMunicipality = ref(flockParam.includes('m'))

// — Filter dropdown items —
const regionItems = computed(() =>
  getAllRegions().map((r) => ({ label: r.name, value: r.psgcCode })),
)
const provinceItems = computed(() =>
  filterRegion.value
    ? getProvincesByRegion(filterRegion.value).map((p) => ({ label: p.name, value: p.psgcCode }))
    : [],
)
const municipalityItems = computed(() =>
  filterProvince.value
    ? getMunicipalitiesByProvince(filterProvince.value).map((m) => ({ label: m.name, value: m.psgcCode }))
    : [],
)

// — Filter cascade resets —
watch(filterRegion, () => {
  filterProvince.value = ''
  filterMunicipality.value = ''
  lockedProvince.value = false
  lockedMunicipality.value = false
})
watch(filterProvince, () => {
  filterMunicipality.value = ''
  lockedMunicipality.value = false
})

const { toggleLock } = useLockState(lockedRegion, lockedProvince, lockedMunicipality)

function clearFilters() {
  filterRegion.value = ''
  filterProvince.value = ''
  filterMunicipality.value = ''
  lockedRegion.value = false
  lockedProvince.value = false
  lockedMunicipality.value = false
}

const hasFilter = computed(() => !!(filterRegion.value || filterProvince.value || filterMunicipality.value))
const hasLocks = computed(() => lockedRegion.value || lockedProvince.value || lockedMunicipality.value)

// — Sync filter state → URL —
watch(
  [filterRegion, filterProvince, filterMunicipality, lockedRegion, lockedProvince, lockedMunicipality],
  () => {
    const q: Record<string, string | undefined> = { ...route.query as Record<string, string> }
    if (filterRegion.value) q.fr = filterRegion.value; else delete q.fr
    if (filterProvince.value) q.fp = filterProvince.value; else delete q.fp
    if (filterMunicipality.value) q.fm = filterMunicipality.value; else delete q.fm
    const locks = [
      lockedRegion.value ? 'r' : null,
      lockedProvince.value ? 'p' : null,
      lockedMunicipality.value ? 'm' : null,
    ].filter(Boolean).join(',')
    if (locks) q.flock = locks; else delete q.flock
    router.replace({ query: q })
  },
)

// — Search query —
const rawQuery = ref((route.query.q as string) || '')
const query = ref(rawQuery.value)

const applyQuery = useDebounceFn((val: string) => {
  query.value = val
  const q: Record<string, string | undefined> = { ...route.query as Record<string, string> }
  if (val.trim()) q.q = val.trim(); else delete q.q
  router.replace({ query: q })
}, 300)

watch(rawQuery, applyQuery)

function matches(entry: BarangayEntry, q: string): boolean {
  const haystack = `${entry.name} ${entry.municipality} ${entry.province} ${entry.region}`.toLowerCase()
  return q.split(/\s+/).every((token) => haystack.includes(token))
}

// — Pagination —
const currentPage = ref(1)

watch([query, filterRegion, filterProvince, filterMunicipality], () => {
  currentPage.value = 1
})

const allResults = computed((): BarangayEntry[] => {
  const q = query.value.trim().toLowerCase()
  const hasQuery = q.length >= 2
  if (!hasQuery && !hasFilter.value) return []
  const out: BarangayEntry[] = []
  for (const entry of getBarangayIndex()) {
    if (filterRegion.value && entry.regionCode !== filterRegion.value) continue
    if (filterProvince.value && entry.provinceCode !== filterProvince.value) continue
    if (filterMunicipality.value && entry.municipalityCode !== filterMunicipality.value) continue
    if (hasQuery && !matches(entry, q)) continue
    out.push(entry)
  }
  return out
})

const totalPages = computed(() => Math.max(1, Math.ceil(allResults.value.length / PAGE_SIZE)))
const results = computed(() =>
  allResults.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
)

// — Copy —
const { copiedKey: copiedCode, copy: copyCode } = useClipboard()
const { copiedKey: copiedMeta, copy: copyMeta } = useClipboard()

async function copyShareUrl() {
  await copyMeta(window.location.href, 'url')
}
</script>

<template>
  <Card>
    <CardHeader class="border-b space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <SearchIcon class="size-4" />
            <CardTitle class="text-sm">PSGC Search</CardTitle>
          </div>
          <CardDescription>
            Search by barangay, municipality/city, province, or region. Use scope filters to narrow results.
          </CardDescription>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <Button
            v-if="hasLocks"
            variant="ghost"
            size="sm"
            class="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            @click="copyShareUrl"
          >
            <ClipboardCheckIcon v-if="copiedMeta === 'url'" class="size-3.5 text-green-500" />
            <CopyIcon v-else class="size-3.5" />
            <span class="hidden sm:inline">{{ copiedMeta === 'url' ? 'Copied!' : 'Share URL' }}</span>
          </Button>
          <Button
            v-if="hasFilter"
            variant="ghost"
            size="sm"
            class="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            @click="clearFilters"
          >
            <RotateCcwIcon class="size-3.5" />
            <span class="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      <!-- Scope filter row -->
      <div class="flex flex-wrap items-center gap-1.5">
        <FilterDropdown
          v-model="filterRegion"
          :items="regionItems"
          placeholder="Region"
          search-placeholder="Search region..."
          :locked="lockedRegion"
          @toggle-lock="toggleLock('r')"
          @clear="filterRegion = ''"
        />
        <template v-if="filterRegion">
          <ChevronRightIcon class="size-3 text-muted-foreground shrink-0 sm:size-3.5" />
          <FilterDropdown
            v-model="filterProvince"
            :items="provinceItems"
            placeholder="Province"
            search-placeholder="Search province..."
            :locked="lockedProvince"
            @toggle-lock="toggleLock('p')"
            @clear="filterProvince = ''"
          />
        </template>
        <template v-if="filterProvince">
          <ChevronRightIcon class="size-3 text-muted-foreground shrink-0 sm:size-3.5" />
          <FilterDropdown
            v-model="filterMunicipality"
            :items="municipalityItems"
            placeholder="Mun. / City"
            search-placeholder="Search..."
            :locked="lockedMunicipality"
            @toggle-lock="toggleLock('m')"
            @clear="filterMunicipality = ''"
          />
        </template>
      </div>

      <!-- Search input -->
      <div class="relative">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none sm:size-4" />
        <Input
          v-model="rawQuery"
          placeholder="Search barangay, city, province..."
          class="pl-9 text-sm"
        />
      </div>
    </CardHeader>

    <!-- Empty / hint state -->
    <div
      v-if="!hasFilter && (!query.trim() || query.trim().length < 2)"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-muted">
        <SearchIcon class="size-5 text-muted-foreground" />
      </div>
      <div class="space-y-1">
        <p class="text-xs font-medium">Search across 42,000+ barangays</p>
        <p class="text-xs text-muted-foreground">Enter at least 2 characters, or pick a scope filter above.</p>
      </div>
    </div>

    <!-- No results -->
    <div
      v-else-if="results.length === 0"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <p class="text-xs font-medium">
        No barangays found<span v-if="query"> for "<span class="text-foreground">{{ query }}</span>"</span>
      </p>
      <p class="text-xs text-muted-foreground">Try a different spelling or adjust the scope filter.</p>
    </div>

    <!-- Results -->
    <CardContent v-else class="p-0">
      <div class="flex items-center justify-between px-4 py-2 border-b bg-muted/30 sm:px-6">
        <p class="text-xs text-muted-foreground">
          <span class="font-medium text-foreground">{{ allResults.length.toLocaleString() }}</span> matches
        </p>
        <p class="text-xs text-muted-foreground">
          <span class="font-medium text-foreground">{{ currentPage }}</span>/<span class="font-medium text-foreground">{{ totalPages }}</span>
        </p>
      </div>

      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="text-xs">Barangay</TableHead>
              <TableHead class="text-xs">Mun. / City</TableHead>
              <TableHead class="hidden text-xs sm:table-cell">Province</TableHead>
              <TableHead class="pr-2 text-right text-xs">PSGC Code</TableHead>
              <TableHead class="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in results"
              :key="row.code"
              class="group hover:bg-muted/40"
            >
              <TableCell class="text-xs font-medium">{{ row.name }}</TableCell>
              <TableCell class="text-xs text-muted-foreground">{{ row.municipality }}</TableCell>
              <TableCell class="hidden text-xs text-muted-foreground sm:table-cell">{{ row.province }}</TableCell>
              <TableCell class="pr-2 text-right">
                <code class="font-mono text-xs font-semibold tabular-nums tracking-widest">
                  {{ row.code }}
                </code>
              </TableCell>
              <TableCell class="pl-0">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  @click="copyCode(row.code)"
                >
                  <CheckIcon v-if="copiedCode === row.code" class="size-3.5 text-green-500" />
                  <CopyIcon v-else class="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t sm:px-6">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1 px-2.5 text-xs"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeftIcon class="size-3.5" />
          Prev
        </Button>
        <p class="text-xs text-muted-foreground">
          {{ ((currentPage - 1) * PAGE_SIZE + 1).toLocaleString() }}–{{ Math.min(currentPage * PAGE_SIZE, allResults.length).toLocaleString() }}
          of {{ allResults.length.toLocaleString() }}
        </p>
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1 px-2.5 text-xs"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
          <ChevronRightIcon class="size-3.5" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
