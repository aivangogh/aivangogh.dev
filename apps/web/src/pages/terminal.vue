<script setup lang="ts">
import TerminalWindow from '@/components/terminal/TerminalWindow.vue'
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-4 font-mono">

    <!-- Header -->
    <div class="space-y-1">
      <p class="text-xs text-muted-foreground">
        <span class="text-foreground">aivangogh@tools</span><span class="text-muted-foreground">:</span><span class="text-primary">~</span><span class="text-muted-foreground">$</span>
        <span class="ml-2 text-foreground">open</span>
        <span class="ml-1 text-primary">terminal</span>
      </p>
      <p class="text-xs text-muted-foreground pl-4">
        Interactive terminal — type <code class="text-foreground">help</code> to get started.
      </p>
    </div>

    <!-- Terminal -->
    <div style="aspect-ratio: 16 / 9; min-height: 360px;">
      <TerminalWindow />
    </div>

    <!-- Keyboard hints -->
    <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[11px] text-muted-foreground">
      <span>
        <kbd class="px-1.5 py-0.5 border border-border text-foreground">Tab</kbd>
        autocomplete
      </span>
      <span>
        <kbd class="px-1.5 py-0.5 border border-border text-foreground">↑ ↓</kbd>
        history
      </span>
      <span>
        <kbd class="px-1.5 py-0.5 border border-border text-foreground">Ctrl+L</kbd>
        clear
      </span>
      <span>
        <kbd class="px-1.5 py-0.5 border border-border text-foreground">Ctrl+C</kbd>
        cancel
      </span>
      <span class="text-muted-foreground/50">· vim users: <code class="text-muted-foreground">:q :wq :help</code> also work</span>
    </div>

  </div>
</template>
