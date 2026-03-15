<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { marked, Renderer } from 'marked'
import { BookOpenIcon } from 'lucide-vue-next'
import readme from '../../../../../packages/ph-address/README.md?raw'

// — Strip HTML badge block before first `#` heading —
const cleanedReadme = readme.replace(/^[\s\S]*?(?=^# )/m, '')

// — Heading extraction + anchor injection —
interface Heading {
  level: number
  text: string
  id: string
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

const headings: Heading[] = []

const renderer = new Renderer()
renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
  const id = slugify(text)
  headings.push({ level: depth, text, id })
  return `<h${depth} id="${id}">${text}</h${depth}>\n`
}

const html = marked.parse(cleanedReadme, { renderer }) as string

// — Active heading tracking via IntersectionObserver —
const activeId = ref('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    { rootMargin: '-8% 0% -80% 0%' },
  )
  document.querySelectorAll('.ph-docs-content [id]').forEach((el) => observer?.observe(el))
})

onUnmounted(() => observer?.disconnect())

// — Mobile TOC toggle —
const tocOpen = ref(false)
</script>

<template>
  <div class="min-h-screen font-sans">

    <!-- Page subheader -->
    <div class="sticky top-11 z-10 border-b bg-background/95 backdrop-blur-sm">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2">
        <RouterLink
          to="/tools/ph-address"
          class="shrink-0 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground group inline-flex items-center gap-0"
        >
          <span class="text-yellow-600 dark:text-yellow-400">aivangogh</span>
          <span class="text-muted-foreground/70">@</span>
          <span class="text-green-700 dark:text-green-400">tools</span>
          <span class="text-muted-foreground/70">:</span>
          <span class="text-blue-600 dark:text-blue-400">~/tools/ph-address-docs</span>
          <span class="text-foreground/60">$</span>
          <span class="ml-2 group-hover:text-foreground transition-colors">cd ..</span>
        </RouterLink>
        <div class="flex min-w-0 items-center gap-1.5">
          <BookOpenIcon class="size-3.5 shrink-0 text-muted-foreground" />
          <span class="truncate font-mono text-xs">@aivangogh/ph-address</span>
          <span class="hidden text-xs text-muted-foreground sm:inline">— docs</span>
        </div>
      </div>
    </div>

    <!-- Mobile TOC (full-width, outside the flex layout) -->
    <div class="sticky top-20 z-10 border-b bg-background lg:hidden">
      <div class="px-4 py-2">
        <button
          type="button"
          class="flex w-full items-center justify-between text-xs text-muted-foreground"
          @click="tocOpen = !tocOpen"
        >
          <span class="font-medium">On this page</span>
          <span class="text-[10px]">{{ tocOpen ? '▲' : '▼' }}</span>
        </button>
        <nav v-if="tocOpen" class="mt-2 max-h-52 space-y-0.5 overflow-y-auto pb-2">
          <template v-for="h in headings" :key="h.id">
            <a
              v-if="h.level === 2"
              :href="`#${h.id}`"
              class="block truncate py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              @click="tocOpen = false"
            >
              {{ h.text }}
            </a>
            <a
              v-else-if="h.level === 3"
              :href="`#${h.id}`"
              class="block truncate py-0.5 pl-3 text-xs text-muted-foreground/70 hover:text-muted-foreground"
              @click="tocOpen = false"
            >
              {{ h.text }}
            </a>
          </template>
        </nav>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="mx-auto flex max-w-5xl gap-0">

      <!-- Sidebar (desktop only) -->
      <aside class="hidden w-52 shrink-0 lg:block">
        <div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto border-r py-8 pr-4">
          <!-- Sidebar header -->
          <div class="mb-4 space-y-1 pl-2">
            <div class="flex items-center gap-1.5">
              <BookOpenIcon class="size-3 text-muted-foreground" />
              <span class="font-mono text-xs font-semibold">ph-address</span>
            </div>
            <div class="flex items-center gap-2">
              <a
                href="https://github.com/aivangogh/ph-address"
                target="_blank"
                rel="noopener"
                class="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >[github]</a>
              <a
                href="https://www.npmjs.com/package/@aivangogh/ph-address"
                target="_blank"
                rel="noopener"
                class="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >[npm]</a>
            </div>
          </div>
          <nav class="space-y-0.5">
            <template v-for="h in headings" :key="h.id">
              <template v-if="h.level === 1" />
              <a
                v-else-if="h.level === 2"
                :href="`#${h.id}`"
                class="block truncate rounded px-2 py-1 text-xs font-medium transition-colors"
                :class="activeId === h.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
              >
                {{ h.text }}
              </a>
              <a
                v-else-if="h.level === 3"
                :href="`#${h.id}`"
                class="block truncate rounded py-0.5 pl-5 pr-2 text-xs transition-colors"
                :class="activeId === h.id ? 'text-foreground' : 'text-muted-foreground/70 hover:text-muted-foreground'"
              >
                {{ h.text }}
              </a>
            </template>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <main class="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="ph-docs-content" v-html="html" />
      </main>

    </div>
  </div>
</template>

<style scoped>
.ph-docs-content {
  width: 100%;
  max-width: 68ch;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.75;
}

.ph-docs-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.ph-docs-content :deep(h2) {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 5rem;
}

.ph-docs-content :deep(h3) {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
  scroll-margin-top: 5rem;
}

.ph-docs-content :deep(p) {
  margin-bottom: 1rem;
}

.ph-docs-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s;
}

.ph-docs-content :deep(a:hover) {
  opacity: 0.75;
}

.ph-docs-content :deep(ul),
.ph-docs-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.ph-docs-content :deep(li) {
  margin-bottom: 0.375rem;
}

.ph-docs-content :deep(ul > li) {
  list-style-type: disc;
}

.ph-docs-content :deep(ol > li) {
  list-style-type: decimal;
}

.ph-docs-content :deep(strong) {
  font-weight: 600;
  color: var(--foreground);
}

.ph-docs-content :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  background-color: var(--muted);
  color: var(--foreground);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ph-docs-content :deep(pre) {
  background-color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.25rem;
}

.ph-docs-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  color: var(--foreground);
}

.ph-docs-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.ph-docs-content :deep(blockquote) {
  border-left: 3px solid var(--border);
  padding-left: 1rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.ph-docs-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin-bottom: 1.25rem;
}

.ph-docs-content :deep(th) {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
}

.ph-docs-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
}
</style>
