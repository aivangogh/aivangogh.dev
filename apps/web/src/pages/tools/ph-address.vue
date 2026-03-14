<script setup lang="ts">
import { getAllRegions, getAllProvinces } from '@aivangogh/ph-address'
import AddressSelector from '@/components/tools/ph-address/AddressSelector.vue'
import BarangaySearch from '@/components/tools/ph-address/BarangaySearch.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aivangogh/ui/components/ui/tabs'
import { MapPin } from 'lucide-vue-next'

const stats = [
  { label: 'Regions', value: getAllRegions().length },
  { label: 'Provinces', value: getAllProvinces().length },
  { label: 'Municipalities', value: '1,634+' },
  { label: 'Barangays', value: '42,000+' },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-5xl mx-auto px-4 py-12 space-y-10">

      <!-- Back -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </RouterLink>

      <!-- Header -->
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <MapPin class="size-4" />
            </div>
            <code class="text-xs bg-muted px-2 py-1 rounded-md font-mono text-muted-foreground">
              @aivangogh/ph-address
            </code>
          </div>
          <h1 class="text-3xl font-semibold tracking-tight">PH Address — PSGC Lookup</h1>
          <p class="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Interactive lookup for Philippine geographic codes based on the
            <a
              href="https://psa.gov.ph/classification/psgc"
              target="_blank"
              class="underline underline-offset-2 hover:text-foreground transition-colors"
            >Philippine Standard Geographic Code (PSGC)</a>,
            published by the Philippine Statistics Authority.
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-lg border border-border bg-card px-4 py-3 space-y-0.5"
          >
            <p class="text-xl font-semibold tracking-tight">{{ stat.value }}</p>
            <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Tool -->
      <Tabs default-value="selector">
        <TabsList>
          <TabsTrigger value="selector">Address Selector</TabsTrigger>
          <TabsTrigger value="search">PSGC Search</TabsTrigger>
        </TabsList>
        <TabsContent value="selector">
          <AddressSelector />
        </TabsContent>
        <TabsContent value="search">
          <BarangaySearch />
        </TabsContent>
      </Tabs>

      <!-- Footer -->
      <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-4 border-t border-border">
        <span>Powered by</span>
        <a
          href="https://www.npmjs.com/package/@aivangogh/ph-address"
          target="_blank"
          class="font-mono underline underline-offset-2 hover:text-foreground transition-colors"
        >@aivangogh/ph-address</a>
        <span>·</span>
        <span>Built with Vue 3 + shadcn-vue</span>
      </div>

    </div>
  </div>
</template>
