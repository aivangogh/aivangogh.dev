<script setup lang="ts">
import { Tabs } from '@aivangogh/ui/components/ui/tabs'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
const model = defineModel<string>()
</script>

<template>
  <Tabs
    v-model="model"
    :class="cn('group w-full gap-0 overflow-hidden rounded-md border', props.class)"
  >
    <slot />
  </Tabs>
</template>
