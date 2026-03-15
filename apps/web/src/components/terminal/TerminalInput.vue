<script setup lang="ts">
import { ref } from 'vue'
import { allCommandNames } from '@/features/terminal/commands'
import { useTerminalStore } from '@/features/terminal/stores/useTerminalStore'

const emit = defineEmits<{
  submit: [command: string]
}>()

const store = useTerminalStore()
const input = ref('')
const historyIndex = ref(-1)
const inputEl = ref<HTMLInputElement>()

defineExpose({
  focus: () => inputEl.value?.focus(),
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const cmd = input.value.trim()
    emit('submit', cmd)
    input.value = ''
    historyIndex.value = -1
  }

  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value < store.inputHistory.length - 1) {
      historyIndex.value++
      input.value = store.inputHistory[historyIndex.value]
    }
  }

  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      input.value = store.inputHistory[historyIndex.value]
    } else {
      historyIndex.value = -1
      input.value = ''
    }
  }

  else if (e.key === 'Tab') {
    e.preventDefault()
    if (!input.value) return
    const match = allCommandNames.find(name => name.startsWith(input.value))
    if (match) input.value = match
  }

  else if (e.ctrlKey && e.key === 'l') {
    e.preventDefault()
    store.clearSession()
  }

  else if (e.ctrlKey && e.key === 'c') {
    e.preventDefault()
    emit('submit', '^C')
    input.value = ''
    historyIndex.value = -1
  }
}
</script>

<template>
  <div class="flex items-center text-xs gap-0">
    <span class="text-yellow-500 shrink-0">guest</span>
    <span class="text-muted-foreground shrink-0">@</span>
    <span class="text-green-500 shrink-0">aivangogh</span>
    <span class="text-muted-foreground shrink-0">:</span>
    <span class="text-primary shrink-0">~</span>
    <span class="text-muted-foreground shrink-0">$</span>
    <input
      ref="inputEl"
      v-model="input"
      type="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      class="ml-2 flex-1 bg-transparent text-foreground outline-none caret-primary text-xs font-mono min-w-0"
      @keydown="handleKeydown"
    />
  </div>
</template>
