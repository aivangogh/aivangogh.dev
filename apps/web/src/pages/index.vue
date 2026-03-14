<script setup lang="ts">
// Home page — aivangogh hub
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <!-- Hero -->
      <div class="space-y-3">
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest">aivangogh</p>
        <h1 class="text-4xl font-semibold tracking-tight">
          Tools & Packages
        </h1>
        <p class="text-muted-foreground leading-relaxed max-w-lg">
          A collection of open-source tools, Vue components, and npm packages built for fun.
        </p>
      </div>

      <!-- Tools -->
      <div class="space-y-4">
        <h2 class="text-sm font-medium text-muted-foreground uppercase tracking-widest">Tools</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RouterLink
            to="/tools/ph-address"
            class="group block rounded-lg border border-border bg-card p-5 hover:border-foreground transition-colors"
          >
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <p class="font-medium text-sm">PH Address — PSGC Lookup</p>
                <span class="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Interactive lookup for Philippine geographic codes based on PSGC.
              </p>
              <code class="text-[11px] font-mono text-muted-foreground">@aivangogh/ph-address</code>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Packages -->
      <div class="space-y-4">
        <h2 class="text-sm font-medium text-muted-foreground uppercase tracking-widest">npm Packages</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://www.npmjs.com/package/@aivangogh/ph-address"
            target="_blank"
            class="group block rounded-lg border border-border bg-card p-5 hover:border-foreground transition-colors"
          >
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <p class="font-medium text-sm">@aivangogh/ph-address</p>
                <span class="text-muted-foreground group-hover:text-foreground transition-colors">↗</span>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Philippine geographic data based on PSGC — regions, provinces, municipalities, barangays.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
