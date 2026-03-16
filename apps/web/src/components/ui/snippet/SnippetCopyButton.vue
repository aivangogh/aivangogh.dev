<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@aivangogh/ui/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<{
  value: string
  timeout?: number
  class?: string
}>()

const emit = defineEmits<{
  copy: []
  error: [error: Error]
}>()

const isCopied = ref(false)

function copy() {
  if (!props.value) return
  navigator.clipboard.writeText(props.value).then(
    () => {
      isCopied.value = true
      emit('copy')
      setTimeout(() => {
        isCopied.value = false
      }, props.timeout ?? 2000)
    },
    (err) => emit('error', err),
  )
}
</script>

<template>
  <Button
    :class="cn('opacity-0 transition-opacity group-hover:opacity-100', props.class)"
    size="icon"
    variant="ghost"
    @click="copy"
  >
    <slot>
      <CheckIcon v-if="isCopied" class="size-3.5" />
      <CopyIcon v-else class="size-3.5" />
    </slot>
  </Button>
</template>
