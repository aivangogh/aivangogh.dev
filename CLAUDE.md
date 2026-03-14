# Prime HRM — Developer Guidelines

## Package Manager

Always use **Bun**. Never use npm, yarn, or pnpm.

```sh
bun install           # install deps
bun add <pkg>         # add a package
bunx <pkg> <cmd>      # run a binary
bun run <script>      # run a script
```

## Adding Dependencies

**All shared packages must go through the catalog.**

1. Add the version to the `"catalog"` in root `package.json`
2. Reference it with `catalog:` in the workspace `package.json`

```jsonc
// root package.json — add version here
"catalog": {
  "my-package": "^1.0.0"
}

// apps/my-app/package.json — reference it here
"dependencies": {
  "my-package": "catalog:"
}
```

Then run `bun install`.

If a package is genuinely only used in one place and will never be shared, you may hardcode the version. When in doubt, use the catalog.

## Monorepo Tasks (Turborepo)

```sh
turbo dev                        # dev all apps
turbo dev --filter=employee      # dev a specific app
turbo build                      # build everything
turbo check-types                # type-check all packages
turbo lint                       # lint all packages
```

## TypeScript Config Pattern

Every Vue app must have these four tsconfig files:

| File | Purpose |
|---|---|
| `tsconfig.json` | Project references entry — no `compilerOptions` |
| `tsconfig.app.json` | Vue source files — extends `@prime-hrm/tsconfig/app.json` |
| `tsconfig.node.json` | Vite/Vitest config files — extends `@prime-hrm/tsconfig/node.json` |
| `tsconfig.vitest.json` | Test files — extends local `./tsconfig.app.json` |

`tsconfig.app.json` and `tsconfig.node.json` require `"composite": true`.

`tsconfig.vitest.json` always extends `./tsconfig.app.json` locally — never the package version.

## Shared UI Library

Import components using the `components/` export path:

```ts
import { Button } from '@prime-hrm/ui/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@prime-hrm/ui/components/ui/card'
import { Badge } from '@prime-hrm/ui/components/ui/badge'
```

Import the global CSS in `main.ts`:

```ts
import '@prime-hrm/ui/styles/globals.css'
```

**Required shim:** Every app that uses `@prime-hrm/ui` components must create `src/lib/utils.ts` because the UI components import `@/lib/utils` internally (where `@` resolves to the consuming app's `src/`):

```ts
// src/lib/utils.ts
export { cn } from '@prime-hrm/ui/lib/utils'
```

The UI library is in `packages/ui/`. Add it as a devDependency via `"@prime-hrm/ui": "workspace:*"`.

## Code Style

Linting and formatting is handled by **Biome** (`tooling/biome/`). Do not add ESLint or Prettier.

## Feature-Based Domain Pattern

Each feature lives under `src/features/<feature>/`:

```
src/features/users/
  types/          index.ts              — TypeScript interfaces
  api/
    uri.ts        — URL constants
    queries.ts    — useQuery composables (TanStack Query)
    mutations.ts  — useMutation composables
  data/
    mock.ts       — Fallback/seed data
  stores/
    useUserStore.ts  — Pinia store
  components/
    UserList.vue
    UserCard.vue
    UserDetail.vue
```

Pages live in `src/pages/` (UVR file-based routing):

```
src/pages/
  index.vue          →  /
  users/
    index.vue        →  /users
    [id].vue         →  /users/:id
```

## New App Checklist

When scaffolding a new Vue app under `apps/`:

- [ ] `package.json` with all deps using `catalog:` (no hardcoded versions)
- [ ] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.vitest.json`
- [ ] `vite.config.ts` with `VueRouter` (UVR) plugin before `vue()` plugin
- [ ] `env.d.ts` with `/// <reference types="unplugin-vue-router/client" />`
- [ ] `src/router/index.ts` using `vue-router/auto-routes`
- [ ] `src/main.ts` with Pinia, Unhead (`createHead`), VueQueryPlugin, router
- [ ] `src/lib/utils.ts` shim for UI package internal imports
- [ ] `"@prime-hrm/tsconfig": "workspace:*"` and `"@prime-hrm/ui": "workspace:*"` in devDependencies
