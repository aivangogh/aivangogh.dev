<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import { Check, ClipboardCheck, Copy, Hash, MapPin, RotateCcw } from 'lucide-vue-next'
import AddressCombobox from './AddressCombobox.vue'

// — State —
const regionCode = ref('')
const provinceCode = ref('')
const municipalityCode = ref('')
const barangayCode = ref('')

// — Cascade resets —
watch(regionCode, () => {
  provinceCode.value = ''
  municipalityCode.value = ''
  barangayCode.value = ''
})
watch(provinceCode, () => {
  municipalityCode.value = ''
  barangayCode.value = ''
})
watch(municipalityCode, () => {
  barangayCode.value = ''
})

// — Dropdown items —
const regionItems = computed(() =>
  getAllRegions().map((r) => ({ label: r.name, value: r.psgcCode, meta: r.psgcCode })),
)
const provinceItems = computed(() =>
  regionCode.value
    ? getProvincesByRegion(regionCode.value).map((p) => ({
        label: p.name,
        value: p.psgcCode,
        meta: p.psgcCode,
      }))
    : [],
)
const municipalityItems = computed(() =>
  provinceCode.value
    ? getMunicipalitiesByProvince(provinceCode.value).map((m) => ({
        label: m.name,
        value: m.psgcCode,
        meta: m.psgcCode,
      }))
    : [],
)
const barangayItems = computed(() =>
  municipalityCode.value
    ? getBarangaysByMunicipality(municipalityCode.value).map((b) => ({
        label: b.name,
        value: b.psgcCode,
        meta: b.psgcCode,
      }))
    : [],
)

// — Progress —
const completedSteps = computed(
  () =>
    [regionCode.value, provinceCode.value, municipalityCode.value, barangayCode.value].filter(
      Boolean,
    ).length,
)

function reset() {
  regionCode.value = ''
  provinceCode.value = ''
  municipalityCode.value = ''
  barangayCode.value = ''
}

// — PSGC breakdown rows —
const selectedRegion = computed(() => getAllRegions().find((r) => r.psgcCode === regionCode.value))
const selectedProvince = computed(() => provinceItems.value.find((p) => p.value === provinceCode.value))
const selectedMunicipality = computed(() => municipalityItems.value.find((m) => m.value === municipalityCode.value))
const selectedBarangay = computed(() => barangayItems.value.find((b) => b.value === barangayCode.value))

const psgcRows = computed(() => {
  const rows: { level: string; name: string; code: string; sub: string }[] = []
  if (selectedRegion.value)
    rows.push({
      level: 'Region',
      name: selectedRegion.value.name,
      code: selectedRegion.value.psgcCode,
      sub: selectedRegion.value.designation ?? '',
    })
  if (selectedProvince.value)
    rows.push({ level: 'Province', name: selectedProvince.value.label, code: selectedProvince.value.value, sub: '' })
  if (selectedMunicipality.value)
    rows.push({ level: 'Mun. / City', name: selectedMunicipality.value.label, code: selectedMunicipality.value.value, sub: '' })
  if (selectedBarangay.value)
    rows.push({ level: 'Barangay', name: selectedBarangay.value.label, code: selectedBarangay.value.value, sub: '' })
  return rows
})

const fullAddress = computed(() =>
  psgcRows.value
    .map((r) => r.name)
    .reverse()
    .join(', '),
)

// — Copy helpers —
const copiedCode = ref('')
async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copiedCode.value = code
  setTimeout(() => (copiedCode.value = ''), 1500)
}

const copiedAddress = ref(false)
async function copyFullAddress() {
  await navigator.clipboard.writeText(fullAddress.value)
  copiedAddress.value = true
  setTimeout(() => (copiedAddress.value = false), 1500)
}
</script>

<template>
  <div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">

    <!-- Left: Address Selector -->
    <Card class="h-full">
      <CardHeader>
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <MapPin class="size-4" />
              <CardTitle class="text-base">Address Selector</CardTitle>
            </div>
            <CardDescription>
              Select each level to retrieve the
              <span class="font-medium text-foreground">PSGC code</span>.
            </CardDescription>
          </div>
          <Button
            v-if="completedSteps > 0"
            variant="ghost"
            size="sm"
            class="-mt-0.5 h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            @click="reset"
          >
            <RotateCcw class="size-3.5" />
            Reset
          </Button>
        </div>

        <!-- Progress bar -->
        <div class="space-y-1.5">
          <div class="flex gap-1">
            <div
              v-for="i in 4"
              :key="i"
              class="h-1 flex-1 rounded-full transition-colors duration-300"
              :class="i <= completedSteps ? 'bg-foreground' : 'bg-muted'"
            />
          </div>
          <p class="text-[11px] text-muted-foreground">{{ completedSteps }} of 4 levels selected</p>
        </div>
      </CardHeader>

      <CardContent class="space-y-5">
        <AddressCombobox
          v-model="regionCode"
          :items="regionItems"
          label="Region"
          placeholder="Select a region"
          search-placeholder="Search region..."
          :step="1"
        />
        <AddressCombobox
          v-model="provinceCode"
          :items="provinceItems"
          label="Province"
          placeholder="Select a province"
          search-placeholder="Search province..."
          :disabled="!regionCode"
          :step="2"
        />
        <AddressCombobox
          v-model="municipalityCode"
          :items="municipalityItems"
          label="Municipality / City"
          placeholder="Select a municipality or city"
          search-placeholder="Search..."
          :disabled="!provinceCode"
          :step="3"
        />
        <AddressCombobox
          v-model="barangayCode"
          :items="barangayItems"
          label="Barangay"
          placeholder="Select a barangay"
          search-placeholder="Search barangay..."
          :disabled="!municipalityCode"
          :step="4"
        />
      </CardContent>
    </Card>

    <!-- Right: PSGC Code Breakdown -->
    <Card class="h-full">
      <!-- border-b triggers [.border-b]:pb-6 in CardHeader — acts as divider -->
      <CardHeader class="border-b">
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Hash class="size-4" />
              <CardTitle class="text-base">PSGC Code Breakdown</CardTitle>
            </div>
            <CardDescription>PSA geographic code per level.</CardDescription>
          </div>
          <Badge
            v-if="psgcRows.length === 4"
            variant="secondary"
            class="mt-0.5 shrink-0 gap-1"
          >
            <Check class="size-3" />
            Complete
          </Badge>
        </div>
      </CardHeader>

      <!-- Empty state -->
      <div
        v-if="!psgcRows.length"
        class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-muted">
          <Hash class="size-5 text-muted-foreground" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium">No selection yet</p>
          <p class="text-xs text-muted-foreground">Start by selecting a region on the left.</p>
        </div>
      </div>

      <!-- Populated -->
      <CardContent v-else class="space-y-4">
        <!-- Full address banner -->
        <div class="flex items-start gap-2 rounded-md bg-muted px-3 py-2.5">
          <p class="flex-1 text-sm font-medium leading-relaxed">{{ fullAddress }}</p>
          <Button
            variant="ghost"
            size="icon"
            class="-mt-0.5 size-7 shrink-0 text-muted-foreground hover:text-foreground"
            @click="copyFullAddress"
          >
            <ClipboardCheck v-if="copiedAddress" class="size-3.5 text-green-500" />
            <Copy v-else class="size-3.5" />
          </Button>
        </div>

        <!-- Breakdown table -->
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-24 text-xs">Level</TableHead>
              <TableHead class="text-xs">Name</TableHead>
              <TableHead class="pr-2 text-right text-xs">PSGC Code</TableHead>
              <TableHead class="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in psgcRows"
              :key="row.code"
              class="group hover:bg-muted/40"
            >
              <TableCell>
                <Badge variant="outline" class="whitespace-nowrap text-xs font-normal">
                  {{ row.level }}
                </Badge>
              </TableCell>
              <TableCell>
                <p class="text-sm font-medium leading-none">{{ row.name }}</p>
                <p v-if="row.sub" class="mt-0.5 text-xs text-muted-foreground">{{ row.sub }}</p>
              </TableCell>
              <TableCell class="pr-2 text-right">
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

  </div>
</template>
