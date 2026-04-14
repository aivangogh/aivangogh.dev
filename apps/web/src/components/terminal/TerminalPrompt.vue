<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    user?: string
    host?: string
    path?: string
    command: string
    args?: string
    delay?: number
    speed?: number
  }>(),
  {
    user: 'aivangogh.dev',
    host: 'tools',
    path: '~',
    delay: 0,
    speed: 70,
  },
)

const emit = defineEmits<{ done: [] }>()

const typedCommand = ref('')
const typedArgs = ref('')
const showCursor = ref(false)

onMounted(() => {
  setTimeout(() => {
    showCursor.value = true
    let i = 0
    const full = props.command
    const interval = setInterval(() => {
      typedCommand.value += full[i]
      i++
      if (i >= full.length) {
        clearInterval(interval)
        if (props.args) {
          setTimeout(() => {
            let j = 0
            const argsInterval = setInterval(() => {
              typedArgs.value += props.args![j]
              j++
              if (j >= props.args!.length) {
                clearInterval(argsInterval)
                showCursor.value = false
                emit('done')
              }
            }, props.speed)
          }, 120)
        } else {
          showCursor.value = false
          emit('done')
        }
      }
    }, props.speed)
  }, props.delay)
})
</script>

<template>
  <p class="text-xs leading-5 font-mono">
    <span class="text-foreground">{{ user }}</span>
    <span class="text-muted-foreground">@</span>
    <span class="text-foreground">{{ host }}</span>
    <span class="text-muted-foreground">:</span>
    <span class="text-foreground">{{ path }}</span>
    <span class="text-muted-foreground">$</span>
    <span class="ml-2 text-foreground">{{ typedCommand }}</span>
    <span v-if="typedArgs" class="ml-1 text-primary">{{ typedArgs }}</span>
    <span
      v-if="showCursor"
      class="inline-block w-[6px] h-[12px] bg-foreground align-middle ml-px animate-[blink_1s_step-end_infinite]"
    />
  </p>
</template>
