<script setup lang="ts">
import { marked } from 'marked'
import readme from '../../../../../../packages/ph-address/README.md?raw'
import { Card, CardContent } from '@aivangogh/ui/components/ui/card'

// Strip the HTML badge block at the top (everything before the first `#` heading)
const cleanedReadme = readme.replace(/^[\s\S]*?(?=^# )/m, '')

const html = marked.parse(cleanedReadme) as string
</script>

<template>
  <Card>
    <CardContent class="ph-docs p-6 sm:p-8">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose" v-html="html" />
    </CardContent>
  </Card>
</template>

<style scoped>
.ph-docs :deep(.prose) {
  --prose-body: var(--foreground);
  --prose-headings: var(--foreground);
  --prose-code: var(--primary);
  --prose-pre-bg: var(--muted);
  --prose-border: var(--border);

  max-width: none;
  color: var(--prose-body);
  font-size: 0.875rem;
  line-height: 1.7;
}

.ph-docs :deep(h1) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--prose-headings);
}

.ph-docs :deep(h2) {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--prose-border);
  color: var(--prose-headings);
}

.ph-docs :deep(h3) {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--prose-headings);
}

.ph-docs :deep(p) {
  margin-bottom: 0.75rem;
  color: var(--muted-foreground);
}

.ph-docs :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.15s;
}

.ph-docs :deep(a:hover) {
  opacity: 0.75;
}

.ph-docs :deep(ul),
.ph-docs :deep(ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.25rem;
  color: var(--muted-foreground);
}

.ph-docs :deep(li) {
  margin-bottom: 0.25rem;
}

.ph-docs :deep(ul > li) {
  list-style-type: disc;
}

.ph-docs :deep(ol > li) {
  list-style-type: decimal;
}

.ph-docs :deep(strong) {
  font-weight: 600;
  color: var(--prose-headings);
}

.ph-docs :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  background-color: var(--muted);
  color: var(--prose-code);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ph-docs :deep(pre) {
  background-color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.ph-docs :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  color: var(--foreground);
}

.ph-docs :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5rem 0;
}

.ph-docs :deep(blockquote) {
  border-left: 3px solid var(--border);
  padding-left: 1rem;
  color: var(--muted-foreground);
  margin-bottom: 0.75rem;
}

.ph-docs :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin-bottom: 1rem;
}

.ph-docs :deep(th) {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  color: var(--prose-headings);
}

.ph-docs :deep(td) {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--muted-foreground);
}
</style>
