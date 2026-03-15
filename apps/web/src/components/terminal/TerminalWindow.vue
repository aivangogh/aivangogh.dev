<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useTerminalStore } from '@/features/terminal/stores/useTerminalStore'
import { commands } from '@/features/terminal/commands'
import TerminalTitleBar from './TerminalTitleBar.vue'
import TerminalHistory from './TerminalHistory.vue'
import TerminalInput from './TerminalInput.vue'
import type { HistoryEntry } from '@/features/terminal/types'

const store = useTerminalStore()
const inputRef = ref<InstanceType<typeof TerminalInput>>()
const scrollRef = ref<HTMLDivElement>()

async function scrollToBottom() {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

async function handleSubmit(raw: string) {
  if (!raw) return

  if (raw === '^C') {
    store.addEntry({ command: '^C', outputs: [] })
    await scrollToBottom()
    return
  }

  const [name, ...args] = raw.trim().split(/\s+/)
  const entry: HistoryEntry = { command: raw, outputs: [] }
  store.addInputHistory(raw)

  const cmd = commands[name]
  if (!cmd) {
    entry.outputs = [`${name}: command not found. Type 'help' for available commands.`]
  } else {
    const result = await Promise.resolve(
      cmd.execute(args, {
        inputHistory: store.inputHistory,
        clearSession: store.clearSession,
      }),
    )
    if (result === '__clear__') {
      store.clearSession()
      return
    }
    entry.outputs = Array.isArray(result) ? result : [result]
  }

  store.addEntry(entry)
  await scrollToBottom()
}

function focusInput() {
  inputRef.value?.focus()
}

onMounted(async () => {
  const banner = commands.banner.execute([], { inputHistory: [], clearSession: () => {} })
  const outputs = Array.isArray(banner) ? banner : [banner as string]
  store.addEntry({ command: '', outputs })
  await nextTick()
  focusInput()
})
</script>

<template>
  <div
    class="flex flex-col border border-border bg-background overflow-hidden"
    style="height: calc(100dvh - 8rem)"
    @click="focusInput"
  >
    <TerminalTitleBar />
    <div
      ref="scrollRef"
      class="flex-1 overflow-y-auto p-4 space-y-2 cursor-text"
    >
      <TerminalHistory :entries="store.session" />
      <TerminalInput ref="inputRef" @submit="handleSubmit" />
    </div>
  </div>
</template>
