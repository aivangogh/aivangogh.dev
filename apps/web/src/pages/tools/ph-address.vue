<script setup lang="ts">
// PH Address PSGC Lookup tool — migrated from ph-address-psgc
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <!-- Back -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </RouterLink>

      <!-- Header -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest">npm</p>
          <code class="text-xs bg-muted px-2 py-0.5 rounded font-mono">@aivangogh/ph-address</code>
        </div>
        <h1 class="text-2xl font-semibold tracking-tight">PH Address — PSGC Lookup</h1>
        <p class="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Interactive lookup for Philippine geographic codes based on the
          <a
            href="https://psa.gov.ph/classification/psgc"
            target="_blank"
            class="underline underline-offset-2 hover:text-foreground transition-colors"
          >Philippine Standard Geographic Code (PSGC)</a>
          published by the Philippine Statistics Authority.
        </p>
      </div>

      <!-- Tool content will go here -->
      <p class="text-sm text-muted-foreground">Tool coming soon — migrating from ph-address-psgc.</p>

      <p class="text-center text-xs text-muted-foreground">
        Powered by
        <a
          href="https://www.npmjs.com/package/@aivangogh/ph-address"
          target="_blank"
          class="underline underline-offset-2 hover:text-foreground transition-colors"
        >@aivangogh/ph-address</a>
        · Built with Vue 3 + shadcn-vue
      </p>
    </div>
  </div>
</template>
