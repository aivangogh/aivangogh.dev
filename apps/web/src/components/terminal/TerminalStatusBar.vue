<script setup lang="ts">
defineProps<{
  mode: 'NORMAL' | 'INSERT'
  lines: number
}>()
</script>

<template>
  <div class="shrink-0 flex items-center justify-between border-t border-border bg-muted/30 h-6 text-[11px] select-none font-mono overflow-hidden">
    <!-- Left: mode + path -->
    <div class="flex items-center h-full">
      <span
        class="px-3 h-full flex items-center font-bold tracking-wider transition-colors duration-100"
        :class="mode === 'INSERT'
          ? 'bg-green-500 text-black'
          : 'bg-primary text-primary-foreground'"
      >
        {{ mode }}
      </span>
      <span class="px-3 text-muted-foreground">~/aivangogh</span>
      <span class="text-border">│</span>
      <span class="px-3 text-muted-foreground/60">terminal v1.0.0</span>
    </div>

    <!-- Right: meta -->
    <div class="flex items-center h-full divide-x divide-border">
      <span class="px-3 text-muted-foreground/60">utf-8</span>
      <span class="px-3 text-muted-foreground/60">unix</span>
      <span class="px-3 text-muted-foreground">{{ lines }}L</span>
    </div>
  </div>
</template>
