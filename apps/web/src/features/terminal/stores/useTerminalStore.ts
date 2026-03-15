import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HistoryEntry } from '../types'

export const useTerminalStore = defineStore('terminal', () => {
  const session = ref<HistoryEntry[]>([])
  const inputHistory = ref<string[]>([])

  function addEntry(entry: HistoryEntry) {
    session.value.push(entry)
  }

  function addInputHistory(cmd: string) {
    if (cmd && inputHistory.value[0] !== cmd) {
      inputHistory.value.unshift(cmd)
    }
  }

  function clearSession() {
    session.value = []
  }

  /** Append a new output line to the last entry */
  function appendToLast(text: string) {
    const last = session.value[session.value.length - 1]
    if (last) last.outputs.push(text)
  }

  /** Replace the last output line of the last entry */
  function updateLast(text: string) {
    const last = session.value[session.value.length - 1]
    if (last && last.outputs.length > 0) {
      last.outputs[last.outputs.length - 1] = text
    } else if (last) {
      last.outputs.push(text)
    }
  }

  return { session, inputHistory, addEntry, addInputHistory, clearSession, appendToLast, updateLast }
})
