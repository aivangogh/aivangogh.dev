<script setup lang="ts">
import { MapPinIcon, PackageIcon } from 'lucide-vue-next'

const tools = [
  {
    to: '/tools/ph-address',
    icon: MapPinIcon,
    name: 'PH Address — PSGC Lookup',
    description:
      'Interactive lookup for Philippine geographic codes. Search and browse 42,000+ barangays with shareable, pre-filtered URLs.',
    pkg: '@aivangogh/ph-address',
    external: false,
  },
]

const packages = [
  {
    href: 'https://www.npmjs.com/package/@aivangogh/ph-address',
    name: '@aivangogh/ph-address',
    description:
      'Philippine geographic data based on PSGC — regions, provinces, municipalities, and barangays. Zero dependencies.',
  },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-16 space-y-16">

    <!-- Hero -->
    <div class="space-y-4 max-w-xl">
      <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest">aivangogh</p>
      <h1 class="text-4xl font-semibold tracking-tight">Tools & Packages</h1>
      <p class="text-muted-foreground leading-relaxed">
        A collection of open-source tools, Vue components, and npm packages — built for the Philippine developer community and beyond.
      </p>
    </div>

    <!-- Tools -->
    <div class="space-y-4">
      <h2 class="text-xs font-mono text-muted-foreground uppercase tracking-widest">Tools</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RouterLink
          v-for="tool in tools"
          :key="tool.name"
          :to="tool.to"
          class="group block border border-border bg-card p-5 hover:border-foreground transition-colors"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex size-8 items-center justify-center border border-border bg-muted group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                <component :is="tool.icon" class="size-4" />
              </div>
              <span class="text-muted-foreground group-hover:text-foreground transition-colors text-sm mt-1">→</span>
            </div>
            <div class="space-y-1">
              <p class="font-medium text-sm">{{ tool.name }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ tool.description }}</p>
            </div>
            <code class="text-[11px] font-mono text-muted-foreground">{{ tool.pkg }}</code>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- npm Packages -->
    <div class="space-y-4">
      <h2 class="text-xs font-mono text-muted-foreground uppercase tracking-widest">npm Packages</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          v-for="pkg in packages"
          :key="pkg.name"
          :href="pkg.href"
          target="_blank"
          class="group block border border-border bg-card p-5 hover:border-foreground transition-colors"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex size-8 items-center justify-center border border-border bg-muted group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                <PackageIcon class="size-4" />
              </div>
              <span class="text-muted-foreground group-hover:text-foreground transition-colors text-sm mt-1">↗</span>
            </div>
            <div class="space-y-1">
              <p class="font-medium text-sm font-mono">{{ pkg.name }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ pkg.description }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>

  </div>
</template>
