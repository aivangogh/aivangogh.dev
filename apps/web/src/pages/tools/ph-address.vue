<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllRegions, getAllProvinces } from '@aivangogh/ph-address'
import AddressSelector from '@/components/tools/ph-address/AddressSelector.vue'
import BarangaySearch from '@/components/tools/ph-address/BarangaySearch.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aivangogh/ui/components/ui/tabs'
import { MapPinIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const activeTab = ref((route.query.tab as string) || 'selector')

watch(activeTab, (tab) => {
  const q: Record<string, string | undefined> = { ...route.query as Record<string, string> }
  if (tab === 'selector') delete q.tab; else q.tab = tab
  router.replace({ query: q })
})

const stats = [
  { label: 'Regions', value: getAllRegions().length },
  { label: 'Provinces', value: getAllProvinces().length },
  { label: 'Municipalities', value: '1,634+' },
  { label: 'Barangays', value: '42,000+' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-10 font-mono">

    <!-- Back — cd .. style -->
    <RouterLink
      to="/"
      class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <span class="text-primary">$</span> cd ..
    </RouterLink>

    <!-- Header -->
    <div class="space-y-6">
      <div class="space-y-3">
        <p class="text-xs text-muted-foreground">
          <span class="text-foreground">aivangogh@tools</span><span class="text-muted-foreground">:</span><span class="text-primary">~/tools</span><span class="text-muted-foreground">$</span>
          <span class="ml-2 text-foreground">cat</span>
          <span class="ml-1 text-primary">ph-address.info</span>
        </p>
        <div class="flex items-center gap-2">
          <div class="flex size-7 items-center justify-center border border-primary bg-muted">
            <MapPinIcon class="size-3.5 text-primary" />
          </div>
          <code class="text-xs border border-border bg-muted px-2 py-0.5 text-muted-foreground">
            @aivangogh/ph-address
          </code>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground glow">PH Address — PSGC Lookup</h1>
        <p class="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Interactive lookup for Philippine geographic codes based on the
          <a
            href="https://psa.gov.ph/classification/psgc"
            target="_blank"
            class="text-primary underline underline-offset-2 hover:glow transition-all"
          >Philippine Standard Geographic Code (PSGC)</a>,
          published by the Philippine Statistics Authority.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border border-border bg-card px-4 py-3 space-y-0.5"
        >
          <p class="text-xl font-bold text-primary glow tracking-tight">{{ stat.value }}</p>
          <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Tool -->
    <Tabs v-model="activeTab">
      <TabsList>
        <TabsTrigger value="selector">selector</TabsTrigger>
        <TabsTrigger value="search">search</TabsTrigger>
      </TabsList>
      <TabsContent value="selector">
        <AddressSelector />
      </TabsContent>
      <TabsContent value="search">
        <BarangaySearch />
      </TabsContent>
    </Tabs>

  </div>
</template>
