<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TerminalWindow from '@/components/terminal/TerminalWindow.vue'

const COMMAND = 'open terminal'
const typed = ref('')
const showCursor = ref(true)
const showSubtitle = ref(false)

onMounted(() => {
  let i = 0
  const interval = setInterval(() => {
    typed.value += COMMAND[i]
    i++
    if (i >= COMMAND.length) {
      clearInterval(interval)
      // blink a couple times then show subtitle
      setTimeout(() => {
        showCursor.value = false
        showSubtitle.value = true
      }, 800)
    }
  }, 80)
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-4 font-mono">

    <!-- Header — typewriter -->
    <div class="space-y-1">
      <p class="text-xs text-muted-foreground">
        <span class="text-foreground">aivangogh@tools</span><span class="text-muted-foreground">:</span><span class="text-primary">~</span><span class="text-muted-foreground">$</span>
        <span class="ml-2 text-foreground">{{ typed }}</span><span
          v-if="showCursor"
          class="inline-block w-[7px] h-[13px] bg-foreground align-middle ml-px animate-[blink_1s_step-end_infinite]"
        />
      </p>
      <p
        class="text-xs text-muted-foreground pl-4 transition-opacity duration-500"
        :class="showSubtitle ? 'opacity-100' : 'opacity-0'"
      >
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
