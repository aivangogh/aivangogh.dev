import { statSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, type Plugin } from 'vite'

const webSrc = path.resolve(__dirname, './src')
const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

/**
 * Resolves `@/` imports relative to the package the importing file belongs to.
 * - Files inside packages/ui/src → @/ resolves to packages/ui/src
 * - All other files            → @/ resolves to apps/web/src
 */
function workspaceAliasPlugin(): Plugin {
  return {
    name: 'workspace-alias',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!id.startsWith('@/') || !importer) return
      const base = importer.includes(uiSrc) ? uiSrc : webSrc
      const resolved = path.resolve(base, id.slice(2))
      const candidates = [
        ...(path.extname(resolved) ? [resolved] : []),
        `${resolved}.ts`,
        `${resolved}.vue`,
        `${resolved}/index.ts`,
        `${resolved}/index.vue`,
      ]
      for (const candidate of candidates) {
        try {
          if (statSync(candidate).isFile()) return candidate
        } catch { /* not found */ }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    // VueRouter must come before vue()
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    workspaceAliasPlugin(),
  ],
})
