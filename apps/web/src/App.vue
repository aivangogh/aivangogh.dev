<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col font-mono terminal-scanlines">

    <!-- Terminal header -->
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
        <RouterLink
          to="/"
          class="text-sm flex items-center gap-0 hover:opacity-80 transition-opacity"
        >
          <span class="text-muted-foreground select-none">~/</span><span class="glow-pulse text-foreground font-semibold">aivangogh</span>
        </RouterLink>
        <nav class="flex items-center gap-3">
          <RouterLink
            to="/terminal"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
            active-class="text-foreground"
          >
            [terminal]
          </RouterLink>
          <a
            href="https://www.npmjs.com/~aivangogh"
            target="_blank"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            [npm]
          </a>
          <a
            href="https://github.com/aivangogh"
            target="_blank"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            [github]
          </a>
        </nav>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer — terminal status bar -->
    <footer class="border-t border-border bg-muted/40">
      <div class="max-w-5xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span class="flex items-center gap-1">
            <span class="text-primary font-semibold">NORMAL</span>
          </span>
          <span class="opacity-40">|</span>
          <span>~/aivangogh</span>
          <span class="opacity-40">|</span>
          <span class="text-foreground/60">main</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>vue3 + shadcn-vue</span>
          <span class="opacity-40">|</span>
          <span>© 2026 aivangogh</span>
        </div>
      </div>
    </footer>

  </div>
</template>
