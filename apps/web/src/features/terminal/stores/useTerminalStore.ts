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

  return { session, inputHistory, addEntry, addInputHistory, clearSession }
})
