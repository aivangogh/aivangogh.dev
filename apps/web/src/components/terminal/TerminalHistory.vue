<script setup lang="ts">
import type { HistoryEntry } from '@/features/terminal/types'

defineProps<{ entries: HistoryEntry[] }>()
</script>

<template>
  <div>
    <div v-for="(entry, i) in entries" :key="i">
      <!-- Command prompt line -->
      <div v-if="entry.command" class="flex items-baseline text-[13px] leading-5 flex-wrap">
        <span class="text-yellow-500">guest</span>
        <span class="text-muted-foreground/60">@</span>
        <span class="text-green-500">aivangogh</span>
        <span class="text-muted-foreground/60">:</span>
        <span class="text-blue-400">~</span>
        <span class="text-muted-foreground">$</span>
        <span class="ml-2 text-foreground">{{ entry.command }}</span>
      </div>
      <!-- Output lines -->
      <pre
        v-for="(line, j) in entry.outputs"
        :key="j"
        class="text-[13px] leading-5 text-muted-foreground whitespace-pre-wrap font-mono"
      >{{ line }}</pre>
    </div>
  </div>
</template>
