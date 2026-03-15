<script setup lang="ts">
import { MapPinIcon, PackageIcon } from 'lucide-vue-next'
import TerminalPrompt from '@/components/terminal/TerminalPrompt.vue'

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
  <div class="max-w-5xl mx-auto px-4 py-16 space-y-16 font-mono">

    <!-- Hero — terminal session output -->
    <div class="space-y-4 max-w-2xl">
      <p class="text-[11px] text-muted-foreground/60 select-none">Last login: Sun Mar 15 00:00:00 2026 on ttys001</p>
      <div class="space-y-1">
        <TerminalPrompt command="whoami" :delay="0" />
        <div class="pl-4 pt-1 space-y-2 border-l border-border">
          <h1 class="text-3xl font-bold text-foreground cursor-blink tracking-tight">aivangogh</h1>
          <p class="text-sm text-muted-foreground leading-relaxed">
            open-source tools, Vue components, and npm packages<br>
            built for the Philippine developer community and beyond.
          </p>
        </div>
        <p class="text-[11px] text-muted-foreground/40 select-none pt-1">[exit 0]</p>
      </div>
    </div>

    <!-- Tools -->
    <div class="space-y-4">
      <TerminalPrompt command="ls" args="--tools" :delay="900" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <RouterLink
          v-for="tool in tools"
          :key="tool.name"
          :to="tool.to"
          class="group block border border-border bg-card p-4 hover:border-primary hover:bg-accent transition-all duration-150"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex size-7 items-center justify-center border border-border bg-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-150">
                <component :is="tool.icon" class="size-3.5" />
              </div>
              <span class="text-muted-foreground group-hover:text-primary transition-colors text-xs mt-0.5">→</span>
            </div>
            <div class="space-y-1.5">
              <p class="text-sm text-foreground group-hover:text-primary transition-colors">{{ tool.name }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ tool.description }}</p>
            </div>
            <code class="text-[10px] text-muted-foreground">{{ tool.pkg }}</code>
          </div>
        </RouterLink>
      </div>
      <p class="text-[11px] text-muted-foreground/40 select-none">[exit 0]</p>
    </div>

    <!-- npm Packages -->
    <div class="space-y-4">
      <TerminalPrompt command="ls" args="--packages" :delay="1800" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          v-for="pkg in packages"
          :key="pkg.name"
          :href="pkg.href"
          target="_blank"
          class="group block border border-border bg-card p-4 hover:border-primary hover:bg-accent transition-all duration-150"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex size-7 items-center justify-center border border-border bg-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-150">
                <PackageIcon class="size-3.5" />
              </div>
              <span class="text-muted-foreground group-hover:text-primary transition-colors text-xs mt-0.5">↗</span>
            </div>
            <div class="space-y-1.5">
              <p class="text-sm text-foreground group-hover:text-primary transition-colors">{{ pkg.name }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ pkg.description }}</p>
            </div>
          </div>
        </a>
      </div>
      <p class="text-[11px] text-muted-foreground/40 select-none">[exit 0]</p>
    </div>

  </div>
</template>
