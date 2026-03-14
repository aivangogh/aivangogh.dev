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
import { Badge } from '@aivangogh/ui/components/ui/badge'
import { Button } from '@aivangogh/ui/components/ui/button'
import { Input } from '@aivangogh/ui/components/ui/input'
import { Check, Copy, Search } from 'lucide-vue-next'

// — Flat index, built once and cached at module level —
type BarangayEntry = {
  name: string
  code: string
  municipality: string
  province: string
  region: string
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
            province: province.name,
            region: region.name,
          })
        }
      }
    }
  }
  _index = result
  return result
}

const MAX_RESULTS = 50

const route = useRoute()
const router = useRouter()

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

const results = computed((): BarangayEntry[] => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return []
  const out: BarangayEntry[] = []
  for (const entry of getIndex()) {
    if (matches(entry, q)) {
      out.push(entry)
      if (out.length >= MAX_RESULTS) break
    }
  }
  return out
})

const totalMatches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return 0
  return getIndex().filter((e) => matches(e, q)).length
})

// — Copy —
const copiedCode = ref('')
async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copiedCode.value = code
  setTimeout(() => (copiedCode.value = ''), 1500)
}
</script>

<template>
  <Card>
    <CardHeader class="border-b">
      <div class="flex items-center gap-2">
        <Search class="size-4" />
        <CardTitle class="text-base">PSGC Search</CardTitle>
      </div>
      <CardDescription>
        Search by barangay, municipality/city, province, or region.
      </CardDescription>
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
      v-if="!query.trim() || query.trim().length < 2"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-muted">
        <Search class="size-5 text-muted-foreground" />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-medium">Search across 42,000+ barangays</p>
        <p class="text-xs text-muted-foreground">Enter at least 2 characters to start searching.</p>
      </div>
    </div>

    <!-- No results -->
    <div
      v-else-if="results.length === 0"
      class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <p class="text-sm font-medium">No barangays found for "<span class="text-foreground">{{ query }}</span>"</p>
      <p class="text-xs text-muted-foreground">Try a different spelling or partial name.</p>
    </div>

    <!-- Results -->
    <CardContent v-else class="p-0">
      <div class="flex items-center justify-between px-6 py-2 border-b bg-muted/30">
        <p class="text-xs text-muted-foreground">
          Showing <span class="font-medium text-foreground">{{ results.length }}</span>
          of <span class="font-medium text-foreground">{{ totalMatches.toLocaleString() }}</span> matches
        </p>
        <Badge v-if="totalMatches > MAX_RESULTS" variant="secondary" class="text-[11px] font-normal">
          Refine your search to see more
        </Badge>
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
    </CardContent>
  </Card>
</template>
