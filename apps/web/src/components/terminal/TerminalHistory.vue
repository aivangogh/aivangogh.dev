<script setup lang="ts">
import type { HistoryEntry } from '@/features/terminal/types'

defineProps<{ entries: HistoryEntry[] }>()
</script>

<template>
  <div class="space-y-1">
    <div v-for="(entry, i) in entries" :key="i" class="space-y-0.5">
      <!-- Command prompt line -->
      <div v-if="entry.command" class="flex items-center text-xs flex-wrap gap-0">
        <span class="text-yellow-500">guest</span>
        <span class="text-muted-foreground">@</span>
        <span class="text-green-500">aivangogh</span>
        <span class="text-muted-foreground">:</span>
        <span class="text-primary">~</span>
        <span class="text-muted-foreground">$</span>
        <span class="ml-2 text-foreground">{{ entry.command }}</span>
      </div>
      <!-- Output -->
      <pre
        v-for="(line, j) in entry.outputs"
        :key="j"
        class="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono pl-0"
      >{{ line }}</pre>
    </div>
  </div>
</template>
