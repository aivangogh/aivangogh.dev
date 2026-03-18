<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col font-mono terminal-scanlines">
    <AppHeader />

    <main class="flex-1">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
