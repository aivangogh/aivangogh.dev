<template>
  <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
      <RouterLink
        to="/"
        class="text-sm flex items-center gap-0 hover:opacity-80 transition-opacity"
      >
        <span class="text-muted-foreground select-none">~/</span><span class="glow-pulse text-foreground font-semibold">aivangogh.dev</span>
      </RouterLink>
      <nav class="flex items-center gap-3">
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
</template>
