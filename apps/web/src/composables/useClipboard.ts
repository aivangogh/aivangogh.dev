import { ref } from 'vue'

export function useClipboard(timeout = 1500) {
  const copiedKey = ref('')

  async function copy(text: string, key = text) {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => (copiedKey.value = ''), timeout)
  }

  return { copiedKey, copy }
}
