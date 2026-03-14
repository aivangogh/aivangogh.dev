# Frontend Architecture

This document describes the frontend architectural patterns and tech stack used across all Vue apps in the Prime HRM monorepo.

> **Reference implementation:** [`apps/example/`](../apps/example/) is a fully working app that demonstrates all patterns described here — feature modules, pages, forms, queries, mutations, and UI library usage.

---

## Stack

### Core

| Package | Version | Purpose |
|---|---|---|
| `vue` | `^3.5.29` | UI framework — Composition API + `<script setup>` |
| `typescript` | `~5.9.3` | Static typing across all apps and packages |
| `vite` | `beta (v8)` | Dev server and build tool |

### Routing

| Package | Version | Purpose |
|---|---|---|
| `vue-router` | `^5.0.3` | Client-side routing |
| `unplugin-vue-router` | `^0.19.2` | File-based route generation from `src/pages/` |

`unplugin-vue-router` generates typed routes from the filesystem — no manual route config needed. Must be registered **before** `@vitejs/plugin-vue` in `vite.config.ts`.

### State Management

| Package | Version | Purpose |
|---|---|---|
| `pinia` | `^3.0.4` | Client-side state (UI state only — not server/API state) |

### Data Fetching

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/vue-query` | `^5.92.9` | Async state, caching, background refetching |
| `axios` | `^1.13.6` | HTTP client — single configured instance in `src/lib/api.ts` |

### Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `zod` | `3.25.76` | Schema definition and runtime validation |
| `vee-validate` | `^4.15.1` | Form state, field binding, submission handling |
| `@vee-validate/zod` | `^4.15.1` | Zod adapter for vee-validate (`toTypedSchema`) |

### UI Components

| Package | Version | Purpose |
|---|---|---|
| `@prime-hrm/ui` | `workspace:*` | Internal shared component library (60+ components) |
| `reka-ui` | `^2.9.0` | Headless accessible primitives (powers `@prime-hrm/ui`) |
| `lucide-vue-next` | `^0.577.0` | Icon library |
| `class-variance-authority` | `^0.7.1` | Type-safe component variant definitions |
| `clsx` | `^2.1.1` | Conditional class merging |
| `tailwind-merge` | `^3.5.0` | Merges Tailwind classes without conflicts |

### Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4.2.1` | Utility-first CSS framework |
| `@tailwindcss/vite` | `^4.2.1` | Tailwind v4 Vite plugin |
| `tw-animate-css` | `^1.4.0` | Animation utilities for enter/exit transitions |

### Other

| Package | Version | Purpose |
|---|---|---|
| `@unhead/vue` | `^2.1.10` | Reactive `<head>` management (`useHead`) |
| `@tanstack/vue-table` | `^8.21.3` | Headless table logic (sorting, filtering, pagination) |
| `@vueuse/core` | `^14.2.1` | Vue composition utilities (used internally by `@prime-hrm/ui`) |

### Tooling

| Package | Version | Purpose |
|---|---|---|
| `turbo` | `^2.8.13` | Monorepo task runner with caching |
| `@biomejs/biome` | `^1.9.0` | Linting and formatting (replaces ESLint + Prettier) |
| `vitest` | `^4.0.18` | Unit test runner (Vite-native) |
| `@vue/test-utils` | `^2.4.6` | Vue component testing utilities |
| `vue-tsc` | `^3.2.5` | TypeScript type-checking for `.vue` files |

---

## Directory Structure

```
apps/<module>/
  src/
    features/        # Domain-driven feature modules
    pages/           # File-based route pages (thin wrappers only)
    stores/          # Global Pinia stores (cross-feature state only)
    lib/
      api.ts         # Axios instance
      utils.ts       # Re-exports cn() from @prime-hrm/ui
    styles/
      globals.css    # Tailwind entry point
    router/
      index.ts       # Vue Router setup (auto-routes)
    main.ts          # App bootstrap
```

---

## Feature Module Structure

Every domain concern lives entirely within its own feature folder:

```
src/features/<feature>/
  types/
    index.ts              # Zod schemas + inferred TypeScript types
  api/
    uri.ts                # URL path constants
    queries.ts            # TanStack Query composables (useQuery)
    mutations.ts          # TanStack Query composables (useMutation)
  data/
    mock.ts               # Fallback / seed data
  stores/
    use<Feature>Store.ts  # Pinia store (feature-scoped state)
  components/
    <Feature>List.vue
    <Feature>Card.vue
    <Feature>Detail.vue
    Create<Feature>Dialog.vue
    # ... any other feature-specific components
```

### Types — Zod as the Source of Truth

TypeScript types are **derived from Zod schemas**, never written separately. This ensures runtime validation and static types always agree.

```ts
// src/features/users/types/index.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
})

export type CreateUserPayload = z.infer<typeof createUserSchema>
```

### API — Queries and Mutations

Data fetching uses **TanStack Query**. Queries and mutations are composables defined inside the feature's `api/` folder — never called directly from pages.

Naming convention:
- **Queries** — noun-based: `useUsers()`, `useUser(id)` (declarative, describes *what data you want*)
- **Mutations** — verb-based: `useCreateUser()`, `useUpdateUser()`, `useDeleteUser()` (imperative, describes *an action*)

```ts
// api/queries.ts
export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => api.get<User[]>(USER_URI.list).then(r => r.data),
  })
}

// api/mutations.ts
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      api.post<User>(USER_URI.list, payload).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
```

### Components — All Logic Lives Here

Feature components own all UI logic: data fetching, state, forms, dialogs. They are the building blocks that pages compose.

```
features/users/components/
  UserList.vue          # Fetches + filters + renders users
  UserCard.vue          # Single user display
  UserDetail.vue        # Full user detail view
  CreateUserDialog.vue  # Dialog + form + mutation
```

---

## Pages — Thin Wrappers Only

Pages under `src/pages/` are **route entry points only**. They must not contain business logic, direct API calls, or inline UI primitives.

**A page should only:**
- Set the page `<head>` via `useHead()`
- Compose feature components
- Provide layout structure (headings, spacing)

```vue
<!-- src/pages/users/index.vue -->
<script setup lang="ts">
import CreateUserDialog from '@/features/users/components/CreateUserDialog.vue'
import UserList from '@/features/users/components/UserList.vue'
import { useHead } from '@unhead/vue'

useHead({ title: 'Users | Prime HRM' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Users</h1>
        <p class="mt-1 text-muted-foreground">Manage your team members</p>
      </div>
      <CreateUserDialog />
    </div>
    <UserList />
  </div>
</template>
```

Pages follow file-based routing via `unplugin-vue-router`:

```
src/pages/
  index.vue          →  /
  users/
    index.vue        →  /users
    [id].vue         →  /users/:id
```

---

## Forms — vee-validate + Zod

All forms use **vee-validate** with `toTypedSchema()` wrapping a Zod schema. The schema is defined in the feature's `types/index.ts` and reused for both runtime validation and TypeScript types.

```vue
<script setup lang="ts">
import { createUserSchema } from '../types'
import { toTypedSchema } from '@vee-validate/zod'

const formSchema = toTypedSchema(createUserSchema)

function onSubmit(values: typeof createUserSchema._type) {
  // values is fully typed and already validated
}
</script>

<template>
  <Form :validation-schema="formSchema" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </Form>
</template>
```

Form components (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) are all provided by `@prime-hrm/ui/components/ui/form`.

---

## Shared UI Library

All UI components come from `@prime-hrm/ui` — never install component libraries directly in an app.

```ts
import { Button } from '@prime-hrm/ui/components/ui/button'
import { Card, CardHeader, CardContent } from '@prime-hrm/ui/components/ui/card'
import { Spinner } from '@prime-hrm/ui/components/ui/spinner'
```

Icons are imported from `lucide-vue-next`:

```ts
import { PlusIcon, UserIcon } from 'lucide-vue-next'
```

### CSS Setup

Each app's CSS entry point is a single import — the UI package's stylesheet provides Tailwind v4, all CSS design tokens, and `@source` scanning for the component library:

```css
/* src/styles/globals.css */
@import "@prime-hrm/ui/styles/globals.css";
```

### Vite Alias Requirement

Every app's `vite.config.ts` must declare two aliases. `@/components` must come first so it takes precedence over `@`, since the UI package uses `@/components/ui/...` for internal cross-component imports:

```ts
resolve: {
  alias: [
    {
      find: '@/components',
      replacement: fileURLToPath(new URL('../../packages/ui/src/components', import.meta.url)),
    },
    {
      find: '@',
      replacement: fileURLToPath(new URL('./src', import.meta.url)),
    },
  ],
},
```

### utils.ts Shim

Every app must provide `src/lib/utils.ts` because UI components import `@/lib/utils` internally:

```ts
// src/lib/utils.ts
export { cn } from '@prime-hrm/ui/lib/utils'
```

---

## State Management

**Pinia** is used for client-side UI state only. Server/API state is always managed by TanStack Query — never stored in Pinia.

- Feature-scoped state → `src/features/<feature>/stores/use<Feature>Store.ts`
- Cross-feature / global state → `src/stores/`

```ts
// src/features/users/stores/useUserStore.ts
export const useUserStore = defineStore('users', () => {
  const searchQuery = ref('')
  return { searchQuery }
})
```

---

## App Bootstrap (`main.ts`)

Every app initializes the same set of plugins in the same order:

```ts
import '@/styles/globals.css'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createHead())
app.use(VueQueryPlugin, { queryClient: new QueryClient() })

app.mount('#app')
```

---

## New App Checklist

When scaffolding a new app under `apps/`:

- [ ] `package.json` — all deps use `catalog:`, `@prime-hrm/ui` and `@prime-hrm/tsconfig` as `workspace:*` devDeps
- [ ] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.vitest.json`
- [ ] `vite.config.ts` — `@/components` + `@` aliases, VueRouter plugin before `vue()`
- [ ] `env.d.ts` — `/// <reference types="unplugin-vue-router/client" />`
- [ ] `src/router/index.ts` — using `vue-router/auto-routes`
- [ ] `src/main.ts` — Pinia, router, Unhead, VueQueryPlugin
- [ ] `src/lib/utils.ts` — shim re-exporting `cn`
- [ ] `src/styles/globals.css` — `@import "@prime-hrm/ui/styles/globals.css"`
