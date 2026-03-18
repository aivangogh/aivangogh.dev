import { ref, onMounted } from 'vue'

const COUNTER_URL = 'https://api.counterapi.dev/v1/aivangogh/site/up'

// Module-level shared state — increments once per page load
const count = ref<number | null>(null)
const fetched = ref(false)

async function fetch_count(): Promise<void> {
  if (fetched.value) return
  fetched.value = true
  try {
    const res = await fetch(COUNTER_URL)
    if (!res.ok) return
    const data = await res.json() as { value: number }
    count.value = data.value
  } catch {
    // silently fail — counter is non-critical
  }
}

export function usePageViews() {
  onMounted(fetch_count)
  return { count }
}

/** Used by terminal `pageviews` command — returns cached value without re-incrementing */
export function getPageViewCount(): number | null {
  return count.value
}
