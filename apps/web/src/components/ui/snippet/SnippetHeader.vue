<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    :class="cn('flex flex-row items-center justify-between border-b bg-secondary p-1', props.class)"
  >
    <slot />
  </div>
</template>
