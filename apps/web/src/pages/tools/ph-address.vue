<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllRegions, getAllProvinces } from '@aivangogh/ph-address'
import AddressSelector from '@/components/tools/ph-address/AddressSelector.vue'
import BarangaySearch from '@/components/tools/ph-address/BarangaySearch.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aivangogh/ui/components/ui/tabs'
import { BookOpenIcon, MapPinIcon } from 'lucide-vue-next'
import TerminalPrompt from '@/components/terminal/TerminalPrompt.vue'
import { Snippet, SnippetHeader, SnippetCopyButton, SnippetTabsList, SnippetTabsTrigger, SnippetTabsContent } from '@/components/ui/snippet'
import { CodeBlock } from '@/components/ui/code-block'

const route = useRoute()
const router = useRouter()

const activeTab = ref((route.query.tab as string) || 'selector')

watch(activeTab, (tab) => {
  const q: Record<string, string | undefined> = { ...(route.query as Record<string, string>) }
  if (tab === 'selector') delete q.tab
  else q.tab = tab
  router.replace({ query: q })
})

const activeInstall = ref('npm')
const installCommands: Record<string, string> = {
  npm: 'npm install @aivangogh/ph-address',
  bun: 'bun add @aivangogh/ph-address',
  pnpm: 'pnpm add @aivangogh/ph-address',
}

const stats = [
  { label: 'Regions', value: getAllRegions().length },
  { label: 'Provinces', value: getAllProvinces().length },
  { label: 'Municipalities', value: '1,634+' },
  { label: 'Barangays', value: '42,000+' },
]

const snippets = [
  {
    label: 'get all regions',
    code: `import { getAllRegions } from '@aivangogh/ph-address'\n\nconst regions = getAllRegions()\n// [ { psgcCode: '010000000', name: 'Region I', ... }, ... ]`,
  },
  {
    label: 'provinces by region',
    code: `import { getProvincesByRegion } from '@aivangogh/ph-address'\n\nconst provinces = getProvincesByRegion('010000000')\n// [ { psgcCode: '012800000', name: 'Ilocos Norte', ... }, ... ]`,
  },
  {
    label: 'municipalities by province',
    code: `import { getMunicipalitiesByProvince } from '@aivangogh/ph-address'\n\nconst cities = getMunicipalitiesByProvince('012800000')\n// [ { psgcCode: '012801000', name: 'Adams', ... }, ... ]`,
  },
  {
    label: 'barangays by municipality',
    code: `import { getBarangaysByMunicipality } from '@aivangogh/ph-address'\n\nconst brgy = getBarangaysByMunicipality('012801000')\n// [ { psgcCode: '012801001', name: 'Barangay 1', ... }, ... ]`,
  },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-10 font-mono">

    <!-- Nav + Header -->
    <div class="space-y-3">
    <div class="flex items-center justify-between">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>$</span><span>cd ..</span>
      </RouterLink>
      <RouterLink
        to="/tools/ph-address-docs"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <BookOpenIcon class="size-3.5" />
        docs
      </RouterLink>
    </div>

    <!-- Header -->
    <div class="space-y-2">
        <TerminalPrompt command="cat" args="ph-address.info" path="~/tools" />
        <div class="flex items-center gap-2">
          <div class="flex size-7 items-center justify-center border border-primary bg-muted">
            <MapPinIcon class="size-3.5 text-primary" />
          </div>
          <code class="text-xs border border-border bg-muted px-2 py-0.5 text-muted-foreground">
            @aivangogh/ph-address
          </code>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground font-sans">PH Address — PSGC Lookup</h1>
        <p class="text-sm text-muted-foreground leading-relaxed max-w-xl font-sans">
          Interactive lookup for Philippine geographic codes based on the
          <a
            href="https://psa.gov.ph/classification/psgc"
            target="_blank"
            class="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity"
          >Philippine Standard Geographic Code (PSGC)</a>,
          published by the Philippine Statistics Authority.
        </p>

    </div>
    </div>

    <!-- Tool -->
    <Tabs v-model="activeTab" class="font-sans">
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

    <!-- Quick Start -->
    <div class="space-y-4 font-sans">
      <TerminalPrompt command="cat" args="quick-start.md" path="~/tools/ph-address" />

      <!-- Install -->
      <Snippet v-model="activeInstall">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
            <SnippetTabsTrigger value="bun">bun</SnippetTabsTrigger>
            <SnippetTabsTrigger value="pnpm">pnpm</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton :value="installCommands[activeInstall]" />
        </SnippetHeader>
        <SnippetTabsContent value="npm">
          <code class="block px-4 py-3 text-sm font-mono">npm install @aivangogh/ph-address</code>
        </SnippetTabsContent>
        <SnippetTabsContent value="bun">
          <code class="block px-4 py-3 text-sm font-mono">bun add @aivangogh/ph-address</code>
        </SnippetTabsContent>
        <SnippetTabsContent value="pnpm">
          <code class="block px-4 py-3 text-sm font-mono">pnpm add @aivangogh/ph-address</code>
        </SnippetTabsContent>
      </Snippet>

      <!-- Usage snippets -->
      <div class="grid sm:grid-cols-2 gap-2">
        <CodeBlock
          v-for="snippet in snippets"
          :key="snippet.label"
          :code="snippet.code"
          :filename="snippet.label"
          lang="typescript"
        />
      </div>

      <!-- Links -->
      <div class="flex items-center gap-4 pt-1">
        <a
          href="https://www.npmjs.com/package/@aivangogh/ph-address"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span class="text-primary">$</span> npm view @aivangogh/ph-address
        </a>
        <RouterLink
          to="/tools/ph-address-docs"
          class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span class="text-primary">$</span> cat README.md
        </RouterLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border border-border bg-card px-4 py-3 space-y-0.5"
      >
        <p class="text-xl font-bold text-primary tracking-tight">{{ stat.value }}</p>
        <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
      </div>
    </div>

  </div>
</template>
