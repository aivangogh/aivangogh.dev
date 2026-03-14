<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-border bg-background">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <RouterLink
          to="/"
          class="font-mono text-sm font-semibold tracking-tight hover:text-muted-foreground transition-colors"
        >
          aivangogh
        </RouterLink>
        <nav class="flex items-center gap-5">
          <a
            href="https://www.npmjs.com/~aivangogh"
            target="_blank"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            npm ↗
          </a>
          <a
            href="https://github.com/aivangogh"
            target="_blank"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <p class="text-xs text-muted-foreground">© 2026 aivangogh</p>
        <p class="text-xs text-muted-foreground">Built with Vue 3 + shadcn-vue</p>
      </div>
    </footer>

  </div>
</template>
