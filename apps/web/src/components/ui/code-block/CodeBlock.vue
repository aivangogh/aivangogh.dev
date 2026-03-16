<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { codeToHtml, type BundledLanguage } from 'shiki'
import { CheckIcon, CopyIcon } from 'lucide-vue-next'
import { ScrollArea } from '@aivangogh/ui/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const props = defineProps<{
  code: string
  lang?: BundledLanguage
  filename?: string
  class?: string
}>()

const html = ref('')
const isCopied = ref(false)

async function highlight() {
  html.value = await codeToHtml(props.code, {
    lang: props.lang ?? 'typescript',
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
    defaultColor: false,
  })
}

onMounted(highlight)
watch(() => [props.code, props.lang], highlight)

function copy() {
  navigator.clipboard.writeText(props.code).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  })
}
</script>

<template>
  <div :class="cn('group overflow-hidden rounded-md border', props.class)">
    <div class="flex items-center justify-between border-b bg-secondary px-3 py-1.5">
      <span class="text-xs text-muted-foreground font-mono">{{ filename ?? lang ?? 'code' }}</span>
      <button
        type="button"
        class="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        @click="copy"
      >
        <CheckIcon v-if="isCopied" class="size-3.5" />
        <CopyIcon v-else class="size-3.5" />
      </button>
    </div>
    <ScrollArea v-if="html" orientation="horizontal">
      <div
        class="code-block-body text-xs [&_pre]:!bg-transparent [&_pre]:p-4 [&_code]:font-mono"
        v-html="html"
      />
    </ScrollArea>
    <ScrollArea v-else orientation="horizontal">
      <pre class="p-4 text-xs font-mono text-muted-foreground bg-muted">{{ code }}</pre>
    </ScrollArea>
  </div>
</template>

<style>
.code-block-body .shiki span {
  color: var(--shiki-light);
}
.dark .code-block-body .shiki span {
  color: var(--shiki-dark);
}
</style>
