<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageViews } from '@/composables/usePageViews'

const { count } = usePageViews()
</script>

<template>
  <footer class="border-t border-border bg-muted/40">
    <div class="max-w-5xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-[11px] text-muted-foreground min-w-0">
        <span class="text-primary font-semibold shrink-0">NORMAL</span>
        <span class="opacity-40 shrink-0">|</span>
        <span class="truncate">~/aivangogh</span>
        <span class="opacity-40 shrink-0 hidden sm:inline">|</span>
        <span class="text-foreground/60 hidden sm:inline">main</span>
      </div>
      <div class="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
        <span v-if="count !== null" class="hidden sm:inline text-muted-foreground/60">
          {{ count.toLocaleString() }} views
        </span>
        <span v-if="count !== null" class="opacity-40 hidden sm:inline">|</span>
        <span class="hidden sm:inline">vue3 + shadcn-vue</span>
        <span class="opacity-40 hidden sm:inline">|</span>
        <RouterLink
          to="/terminal"
          class="hover:text-foreground transition-colors"
          active-class="text-foreground"
        >[terminal]</RouterLink>
        <span class="opacity-40">|</span>
        <span>© 2026 aivangogh</span>
      </div>
    </div>
  </footer>
</template>
