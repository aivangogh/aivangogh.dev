# aivangogh

A monorepo of developer tools and utilities, built with Vue 3 and a shared component library.

## Tools

### PH Address — PSGC Lookup

Interactive lookup for Philippine geographic codes based on the [Philippine Standard Geographic Code (PSGC)](https://psa.gov.ph/classification/psgc), published by the Philippine Statistics Authority.

- **Address Selector** — drill down from region → province → municipality → barangay to retrieve each level's PSGC code
- **PSGC Search** — full-text search across 42,000+ barangays with multi-word support (e.g. `magsaysay malaybalay`)

Powered by [`@aivangogh/ph-address`](https://www.npmjs.com/package/@aivangogh/ph-address).

## Tech Stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (v8)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/) (Reka UI primitives) via `@aivangogh/ui`
- [Pinia](https://pinia.vuejs.org/) · [Vue Router v5](https://router.vuejs.org/) · [TanStack Query](https://tanstack.com/query)
- [VueUse](https://vueuse.org/) · [Lucide](https://lucide.dev/) icons
- [Bun](https://bun.sh/) — package manager & runtime
- [Turborepo](https://turborepo.dev/) — monorepo task runner
- [Biome](https://biomejs.dev/) — linting & formatting

## Monorepo Structure

```
apps/
  web/         # Main tools web app

packages/
  ui/          # @aivangogh/ui — shared shadcn-vue component library

tooling/
  biome/       # Biome base config
  tsconfig/    # Shared TypeScript configs
```

## Getting Started

Install dependencies:

```sh
bun install
```

Run the web app in development mode:

```sh
turbo dev
```

Build everything:

```sh
turbo build
```

## Dependency Management

All shared package versions are defined once in the root `package.json` under `"catalog"` and referenced with `catalog:` in workspace `package.json` files.

```jsonc
// root package.json
"catalog": {
  "vue": "^3.5.29"
}

// apps/web/package.json
"dependencies": {
  "vue": "catalog:"
}
```
