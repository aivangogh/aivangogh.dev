import type { CommandRegistry } from '../types'

const BANNER = [
  '┌────────────────────────────────────────────────────────────┐',
  '│                                                            │',
  '│   Welcome to aivangogh\'s interactive terminal             │',
  '│   Type \'help\' to see available commands.                  │',
  '│                                                            │',
  '└────────────────────────────────────────────────────────────┘',
  '',
  '  Interactive terminal v1.0.0 — built with Vue 3',
  '',
]

export const commands: CommandRegistry = {
  help: {
    description: 'List all available commands',
    execute: () => [
      'Available commands:',
      '',
      '  about       — Who is aivangogh?',
      '  banner      — Show welcome banner',
      '  clear       — Clear terminal',
      '  contact     — Contact and links',
      '  date        — Show current date and time',
      '  echo        — Print arguments',
      '  help        — Show this help message',
      '  history     — Show command history',
      '  projects    — List open-source projects',
      '  skills      — Tech stack and skills',
      '  whoami      — Who are you?',
      '',
      '  Tip: Use Tab to autocomplete, ↑↓ to navigate history.',
    ],
  },

  whoami: {
    description: 'Who are you?',
    execute: () => 'guest',
  },

  about: {
    description: 'About aivangogh',
    execute: () => [
      'aivangogh',
      '',
      '  Full-stack developer from the Philippines.',
      '  Building open-source tools, Vue components,',
      '  and npm packages for the developer community.',
      '',
      '  Currently focused on:',
      '    → Philippine geographic data tooling',
      '    → Vue 3 component libraries',
      '    → Developer productivity tools',
    ],
  },

  skills: {
    description: 'Tech stack and skills',
    execute: () => [
      'Tech Stack:',
      '',
      '  Languages    TypeScript, JavaScript',
      '  Frontend     Vue 3, React, TailwindCSS',
      '  Backend      Node.js, Bun, Hono',
      '  Database     PostgreSQL, SQLite',
      '  Tools        Vite, Turborepo, Git',
      '  Platforms    Vercel, Cloudflare',
    ],
  },

  projects: {
    description: 'List open-source projects',
    execute: () => [
      'Open-source projects:',
      '',
      '  @aivangogh/ph-address',
      '    Philippine geographic data based on PSGC.',
      '    Regions, provinces, municipalities, barangays.',
      '    Zero dependencies.',
      '    → https://www.npmjs.com/package/@aivangogh/ph-address',
      '',
      '  aivangogh/tools',
      '    Web tools and utilities built for developers.',
      '    → https://aivangogh.tools',
    ],
  },

  contact: {
    description: 'Contact and links',
    execute: () => [
      'Contact:',
      '',
      '  GitHub    https://github.com/aivangogh',
      '  npm       https://www.npmjs.com/~aivangogh',
    ],
  },

  banner: {
    description: 'Show welcome banner',
    execute: () => BANNER,
  },

  date: {
    description: 'Show current date and time',
    execute: () => new Date().toString(),
  },

  echo: {
    description: 'Print arguments',
    execute: (args) => args.join(' '),
  },

  clear: {
    description: 'Clear the terminal',
    execute: () => '__clear__',
  },

  history: {
    description: 'Show command history',
    execute: (_args, ctx) => {
      if (!ctx.inputHistory.length) return 'No history.'
      return ctx.inputHistory
        .slice()
        .reverse()
        .map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${cmd}`)
    },
  },
}

export const allCommandNames = Object.keys(commands)
