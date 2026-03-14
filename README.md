# Prime HRM

A modular Human Resource Management system built as a monorepo. Each HRM module is a standalone app backed by its own .NET microservice.

## Tech Stack

**Frontend**
- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (v8)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/vue](https://www.shadcn-vue.com/) (Reka UI primitives)
- [Pinia](https://pinia.vuejs.org/) · [Vue Router v5](https://router.vuejs.org/) · [vee-validate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)
- [TanStack Table](https://tanstack.com/table) · [Lucide](https://lucide.dev/) icons
- [Tauri](https://tauri.app/) (desktop app — planned)

**Backend**
- [.NET](https://dotnet.microsoft.com/) microservices (Clean Architecture)

**Tooling**
- [Bun](https://bun.sh/) — package manager & runtime
- [Turborepo](https://turborepo.dev/) — monorepo task runner
- [Biome](https://biomejs.dev/) — linting & formatting

## Monorepo Structure

```
apps/
  desktop/    # Tauri desktop app
  employee/   # Employee Profile (PDS)
  rsp/        # Ranking, Selection & Placement  [1st Pillar]
  payroll/    # Payroll System
  rnr/        # Rewards & Recognition           [4th Pillar]
  dtr/        # Daily Time Record
  admin/      # Administration
  reports/    # Reports

packages/
  ui/          # @prime-hrm/ui — shared shadcn/vue component library
  composables/ # Shared Vue composables
  config/      # Shared configuration
  types/       # Shared TypeScript types
  utils/       # Shared utilities

services/
  employee-service/ # Employee Profile (PDS) .NET service
  rsp-service/      # Ranking, Selection & Placement .NET service
  payroll-service/  # Payroll System .NET service
  rnr-service/      # Rewards & Recognition .NET service
  dtr-service/      # Daily Time Record .NET service
  admin-service/    # Administration .NET service
  reports-service/  # Reports .NET service
  shared/           # Shared .NET libraries (Auth, Auditing, Notifications, Permissions, etc.)

tooling/
  biome/    # Biome base config
  tsconfig/ # Shared TypeScript configs
  vite/     # Shared Vite config
```

## Dependency Management

This monorepo uses **Bun's catalog** feature to keep dependency versions consistent across all apps, packages, and tooling.

All shared package versions are defined once in the root `package.json` under the `"catalog"` key:

```json
// package.json (root)
{
  "catalog": {
    "vue": "^3.5.29",
    "typescript": "~5.9.3",
    "vite": "beta"
  }
}
```

Workspace packages reference catalog entries using the `catalog:` protocol instead of specifying version numbers:

```json
// apps/my-app/package.json
{
  "dependencies": {
    "vue": "catalog:",
    "pinia": "catalog:"
  }
}
```

**Rules:**
- Every new shared dependency must be added to the `"catalog"` in root `package.json` first
- Workspace `package.json` files always reference `catalog:` — never hardcode version strings for shared packages
- To upgrade a package across the whole monorepo, update its version in the catalog and run `bun install`
- `peerDependencies` are constraints, not installed versions — they stay as semver ranges (e.g. `"typescript": "^5"`)
- `workspace:*` references (for internal packages like `@prime-hrm/ui`) are not catalog entries

> **Note:** Bun does not support a separate `bun-workspace.yaml` equivalent for catalogs. The `"catalog"` key lives in root `package.json` only.

## TypeScript Config

Shared TypeScript configurations live in `tooling/tsconfig/` and are published as `@prime-hrm/tsconfig`.

Each app creates three local tsconfig files that extend the shared base, then the root `tsconfig.json` references them as project references:

```
apps/my-app/
  tsconfig.json          # project references only — no compilerOptions
  tsconfig.app.json      # extends @prime-hrm/tsconfig/app.json  (Vue source)
  tsconfig.node.json     # extends @prime-hrm/tsconfig/node.json  (vite/vitest configs)
  tsconfig.vitest.json   # extends ./tsconfig.app.json            (test files)
```

`tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.vitest.json" }
  ]
}
```

`tsconfig.app.json` and `tsconfig.node.json` must include `"composite": true` to satisfy TypeScript project references.

`tsconfig.vitest.json` **cannot** re-extend `@prime-hrm/tsconfig/vitest.json` because that file itself uses a relative `./tsconfig.app.json` reference that resolves to the tooling directory. It always extends the local `./tsconfig.app.json` directly.

## Getting Started

Install dependencies:

```sh
bun install
```

Run all apps in development mode:

```sh
turbo dev
```

Run a specific app:

```sh
turbo dev --filter=employee
```

Build all apps and packages:

```sh
turbo build
```

## Shared UI Library

The `@prime-hrm/ui` package provides 60+ shared components built on shadcn/vue. Import components directly into any app:

```ts
import { Button, Card, DataTable } from "@prime-hrm/ui"
```

## Documentation

- [Frontend Architecture](docs/frontend-architecture.md) — stack, feature-based structure, pages pattern, forms, state management, UI library setup
- [Modular Deployment Architecture](docs/modular-deployment-architecture.md) — how to sell the full suite or individual modules without breaking either deployment
- [Employee Service](docs/employee-service.md) — PDS domain model, ERD, Clean Architecture layers, API endpoints, domain events

## Design Resources

| Resource | Description | Link |
|---|---|---|
| Employee Service ERD | Entity Relationship Diagram for the PDS domain (draw.io) | [Google Drive](https://drive.google.com/file/d/1V8lP-Jf5Y2d8mxVqiILS7kFT-8qTGzrJ/view?usp=sharing) |

## Architecture

Each HRM module follows the same pattern:

- **Frontend app** (`apps/<module>/`) — Vue 3 SPA consuming the shared UI library
- **Backend service** (`services/<module>-service/`) — .NET Clean Architecture microservice (API / Application / Domain / Infrastructure layers)
- **Desktop shell** (`apps/desktop/`) — Tauri app that hosts the frontend modules
