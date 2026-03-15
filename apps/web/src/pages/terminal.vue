<script setup lang="ts">
import { ref } from 'vue'
import TerminalWindow from '@/components/terminal/TerminalWindow.vue'
import TerminalPrompt from '@/components/terminal/TerminalPrompt.vue'

const showSubtitle = ref(false)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-3 md:space-y-4 font-mono">

    <!-- Header -->
    <div class="space-y-1">
      <TerminalPrompt command="open" args="terminal" @done="showSubtitle = true" />
      <p
        class="text-xs text-muted-foreground pl-4 transition-opacity duration-500"
        :class="showSubtitle ? 'opacity-100' : 'opacity-0'"
      >
        Interactive terminal — type <code class="text-foreground">help</code> to get started.
      </p>
    </div>

    <!-- Terminal: tall on mobile, 16:9 on desktop -->
    <div class="h-[68dvh] md:h-auto md:aspect-video">
      <TerminalWindow />
    </div>

    <!-- Keyboard hints — hidden on mobile (no physical keyboard) -->
    <div class="hidden md:flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[11px] text-muted-foreground">
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

    <!-- Mobile hint -->
    <p class="md:hidden text-[11px] text-muted-foreground/50">
      Tap the terminal and type a command. Try <code class="text-muted-foreground">help</code>.
    </p>

  </div>
</template>
