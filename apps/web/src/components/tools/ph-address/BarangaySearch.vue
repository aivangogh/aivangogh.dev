<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import {
  getAllRegions,
  getProvincesByRegion,
  getMunicipalitiesByProvince,
  getBarangaysByMunicipality,
} from '@aivangogh/ph-address'
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
import { Popover, PopoverContent, PopoverTrigger } from '@aivangogh/ui/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@aivangogh/ui/components/ui/command'
import { Badge } from '@aivangogh/ui/components/ui/badge'
import { Button } from '@aivangogh/ui/components/ui/button'
import { Input } from '@aivangogh/ui/components/ui/input'
import { Check, ChevronLeft, ChevronRight, ClipboardCheck, Copy, Lock, LockOpen, RotateCcw, Search, X } from 'lucide-vue-next'

// — Flat index, built once and cached at module level —
type BarangayEntry = {
  name: string
  code: string
  municipality: string
  municipalityCode: string
  province: string
  provinceCode: string
  region: string
  regionCode: string
}

let _index: BarangayEntry[] | null = null

function getIndex(): BarangayEntry[] {
  if (_index) return _index
  const result: BarangayEntry[] = []
  for (const region of getAllRegions()) {
    for (const province of getProvincesByRegion(region.psgcCode)) {
      for (const mun of getMunicipalitiesByProvince(province.psgcCode)) {
        for (const brgy of getBarangaysByMunicipality(mun.psgcCode)) {
          result.push({
            name: brgy.name,
            code: brgy.psgcCode,
            municipality: mun.name,
            municipalityCode: mun.psgcCode,
            province: province.name,
            provinceCode: province.psgcCode,
            region: region.name,
            regionCode: region.psgcCode,
          })
        }
      }
    }
  }
  _index = result
  return result
}

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

const selectedRegion = computed(() => regionItems.value.find((r) => r.value === filterRegion.value))
const selectedProvince = computed(() => provinceItems.value.find((p) => p.value === filterProvince.value))
const selectedMunicipality = computed(() => municipalityItems.value.find((m) => m.value === filterMunicipality.value))

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

// — Lock toggles —
function toggleLock(level: 'r' | 'p' | 'm') {
  if (level === 'r') {
    if (lockedRegion.value) {
      lockedRegion.value = false
      lockedProvince.value = false
      lockedMunicipality.value = false
    } else {
      lockedRegion.value = true
    }
  } else if (level === 'p') {
    if (lockedProvince.value) {
      lockedProvince.value = false
      lockedMunicipality.value = false
    } else {
      lockedProvince.value = true
      lockedRegion.value = true
    }
  } else {
    if (lockedMunicipality.value) {
      lockedMunicipality.value = false
    } else {
      lockedMunicipality.value = true
      lockedProvince.value = true
      lockedRegion.value = true
    }
  }
}

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

const currentPage = ref(1)

// Reset page when query or filters change
watch(
  [query, filterRegion, filterProvince, filterMunicipality],
  () => { currentPage.value = 1 },
)

const allResults = computed((): BarangayEntry[] => {
  const q = query.value.trim().toLowerCase()
  const hasQuery = q.length >= 2
  if (!hasQuery && !hasFilter.value) return []
  const out: BarangayEntry[] = []
  for (const entry of getIndex()) {
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
const copiedCode = ref('')
async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copiedCode.value = code
  setTimeout(() => (copiedCode.value = ''), 1500)
}

const copiedUrl = ref(false)
async function copyShareUrl() {
  await navigator.clipboard.writeText(window.location.href)
  copiedUrl.value = true
  setTimeout(() => (copiedUrl.value = false), 1500)
}

// — Filter dropdown open state —
const openRegion = ref(false)
const openProvince = ref(false)
const openMunicipality = ref(false)
</script>

<template>
  <Card>
    <CardHeader class="border-b space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Search class="size-4" />
            <CardTitle class="text-base">PSGC Search</CardTitle>
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
            <ClipboardCheck v-if="copiedUrl" class="size-3.5 text-green-500" />
            <Copy v-else class="size-3.5" />
            {{ copiedUrl ? 'Copied!' : 'Share URL' }}
          </Button>
          <Button
            v-if="hasFilter"
            variant="ghost"
            size="sm"
            class="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            @click="clearFilters"
          >
            <RotateCcw class="size-3.5" />
            Clear
          </Button>
        </div>
      </div>

      <!-- Scope filter row -->
      <div class="flex flex-wrap items-center gap-1.5">
        <!-- Region filter -->
        <div class="flex items-center gap-1">
          <Popover v-model:open="openRegion">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="sm"
                :disabled="lockedRegion"
                class="h-7 gap-1.5 px-2.5 text-xs font-normal"
                :class="filterRegion ? 'border-foreground/30 bg-muted/40' : 'text-muted-foreground'"
              >
                {{ selectedRegion?.label ?? 'Region' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search region..." class="h-8" />
                <CommandEmpty>No results.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="item in regionItems"
                      :key="item.value"
                      :value="item.label"
                      @select="filterRegion = item.value; openRegion = false"
                    >
                      <Check class="mr-2 size-3.5 shrink-0" :class="filterRegion === item.value ? 'opacity-100' : 'opacity-0'" />
                      <span class="text-xs">{{ item.label }}</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            v-if="filterRegion"
            variant="ghost"
            size="icon"
            class="size-5 text-muted-foreground hover:text-foreground"
            :class="lockedRegion ? 'text-foreground' : ''"
            :title="lockedRegion ? 'Unlock region filter' : 'Lock region filter'"
            @click="toggleLock('r')"
          >
            <Lock v-if="lockedRegion" class="size-3" />
            <LockOpen v-else class="size-3" />
          </Button>
          <button
            v-if="filterRegion && !lockedRegion"
            class="text-muted-foreground hover:text-foreground"
            @click="filterRegion = ''"
          >
            <X class="size-3" />
          </button>
        </div>

        <!-- Province filter -->
        <template v-if="filterRegion">
          <ChevronRight class="size-3.5 text-muted-foreground shrink-0" />
          <div class="flex items-center gap-1">
            <Popover v-model:open="openProvince">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="lockedProvince"
                  class="h-7 gap-1.5 px-2.5 text-xs font-normal"
                  :class="filterProvince ? 'border-foreground/30 bg-muted/40' : 'text-muted-foreground'"
                >
                  {{ selectedProvince?.label ?? 'Province' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-64 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search province..." class="h-8" />
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="item in provinceItems"
                        :key="item.value"
                        :value="item.label"
                        @select="filterProvince = item.value; openProvince = false"
                      >
                        <Check class="mr-2 size-3.5 shrink-0" :class="filterProvince === item.value ? 'opacity-100' : 'opacity-0'" />
                        <span class="text-xs">{{ item.label }}</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              v-if="filterProvince"
              variant="ghost"
              size="icon"
              class="size-5 text-muted-foreground hover:text-foreground"
              :class="lockedProvince ? 'text-foreground' : ''"
              :title="lockedProvince ? 'Unlock province filter' : 'Lock province filter'"
              @click="toggleLock('p')"
            >
              <Lock v-if="lockedProvince" class="size-3" />
              <LockOpen v-else class="size-3" />
            </Button>
            <button
              v-if="filterProvince && !lockedProvince"
              class="text-muted-foreground hover:text-foreground"
              @click="filterProvince = ''"
            >
              <X class="size-3" />
            </button>
          </div>
        </template>

        <!-- Municipality filter -->
        <template v-if="filterProvince">
          <ChevronRight class="size-3.5 text-muted-foreground shrink-0" />
          <div class="flex items-center gap-1">
            <Popover v-model:open="openMunicipality">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="lockedMunicipality"
                  class="h-7 gap-1.5 px-2.5 text-xs font-normal"
                  :class="filterMunicipality ? 'border-foreground/30 bg-muted/40' : 'text-muted-foreground'"
                >
                  {{ selectedMunicipality?.label ?? 'Municipality / City' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-64 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." class="h-8" />
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="item in municipalityItems"
                        :key="item.value"
                        :value="item.label"
                        @select="filterMunicipality = item.value; openMunicipality = false"
                      >
                        <Check class="mr-2 size-3.5 shrink-0" :class="filterMunicipality === item.value ? 'opacity-100' : 'opacity-0'" />
                        <span class="text-xs">{{ item.label }}</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              v-if="filterMunicipality"
              variant="ghost"
              size="icon"
              class="size-5 text-muted-foreground hover:text-foreground"
              :class="lockedMunicipality ? 'text-foreground' : ''"
              :title="lockedMunicipality ? 'Unlock municipality filter' : 'Lock municipality filter'"
              @click="toggleLock('m')"
            >
              <Lock v-if="lockedMunicipality" class="size-3" />
              <LockOpen v-else class="size-3" />
            </Button>
            <button
              v-if="filterMunicipality && !lockedMunicipality"
              class="text-muted-foreground hover:text-foreground"
              @click="filterMunicipality = ''"
            >
              <X class="size-3" />
            </button>
          </div>
        </template>
      </div>

      <!-- Search input -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          v-model="rawQuery"
          placeholder="e.g. Poblacion, Makati, Cebu, NCR..."
          class="pl-9"
        />
      </div>
    </CardHeader>

    <!-- Empty / hint state -->
    <div
      v-if="!hasFilter && (!query.trim() || query.trim().length < 2)"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-muted">
        <Search class="size-5 text-muted-foreground" />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-medium">Search across 42,000+ barangays</p>
        <p class="text-xs text-muted-foreground">Enter at least 2 characters, or pick a scope filter above.</p>
      </div>
    </div>

    <!-- No results -->
    <div
      v-else-if="results.length === 0"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <p class="text-sm font-medium">No barangays found<span v-if="query"> for "<span class="text-foreground">{{ query }}</span>"</span></p>
      <p class="text-xs text-muted-foreground">Try a different spelling or adjust the scope filter.</p>
    </div>

    <!-- Results -->
    <CardContent v-else class="p-0">
      <div class="flex items-center justify-between px-6 py-2 border-b bg-muted/30">
        <p class="text-xs text-muted-foreground">
          <span class="font-medium text-foreground">{{ allResults.length.toLocaleString() }}</span> matches
        </p>
        <p class="text-xs text-muted-foreground">
          Page <span class="font-medium text-foreground">{{ currentPage }}</span> of
          <span class="font-medium text-foreground">{{ totalPages }}</span>
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="text-xs">Barangay</TableHead>
            <TableHead class="text-xs">Municipality / City</TableHead>
            <TableHead class="text-xs">Province</TableHead>
            <TableHead class="text-xs text-right pr-2">PSGC Code</TableHead>
            <TableHead class="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="row in results"
            :key="row.code"
            class="group hover:bg-muted/40"
          >
            <TableCell class="font-medium text-sm">{{ row.name }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ row.municipality }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ row.province }}</TableCell>
            <TableCell class="text-right pr-2">
              <code class="font-mono text-sm font-semibold tabular-nums tracking-widest">
                {{ row.code }}
              </code>
            </TableCell>
            <TableCell class="pl-0">
              <Button
                variant="ghost"
                size="icon"
                class="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                @click="copyCode(row.code)"
              >
                <Check v-if="copiedCode === row.code" class="size-3.5 text-green-500" />
                <Copy v-else class="size-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-3 border-t">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1 px-2.5 text-xs"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft class="size-3.5" />
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
          <ChevronRight class="size-3.5" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
