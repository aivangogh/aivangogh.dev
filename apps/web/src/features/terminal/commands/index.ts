import { animated } from '../types'
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

const FORTUNES = [
  'There are only two hard things in CS: cache invalidation and naming things.',
  'Always code as if the person maintaining your code is a violent psychopath who knows where you live.',
  'It works on my machine. — Every developer, ever.',
  'The best code is no code at all.',
  'First, solve the problem. Then, write the code.',
  'Neovim is not just an editor. It\'s a lifestyle.',
  'Talk is cheap. Show me the code. — Linus Torvalds',
  'npm install happiness → error: package not found',
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A commit a day keeps the merge conflicts away.',
  'sudo make me a sandwich.',
  'To understand recursion, you must first understand recursion.',
  '99 little bugs in the code, 99 little bugs... patch one down, compile again, 127 little bugs in the code.',
  'Dear Stack Overflow, I love you. Sincerely, Every Developer.',
  'Neovim users: I use btw. — me, constantly',
]

function cowsay(message: string): string[] {
  const msg = message.trim() || 'Moo!'
  const len = msg.length
  const border = '_'.repeat(len + 2)
  return [
    ` ${border}`,
    `< ${msg} >`,
    ` ${'-'.repeat(len + 2)}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ]
}

function neofetch(): string[] {
  const now = new Date()
  const pad = (s: string) => s.padEnd(24)
  return [
    '                                   ivan@aivangogh',
    '     /\\          /\\               ─────────────────────────────',
    `    /  \\        /  \\              ${pad('OS:')} aivangogh-tools 1.0.0`,
    `   / /\\ \\      / /\\ \\             ${pad('Host:')} aivangogh.tools`,
    `  / /  \\ \\    / /  \\ \\            ${pad('Shell:')} zsh`,
    `  \\ \\  / /    \\ \\  / /            ${pad('Terminal:')} aivangogh-terminal v1.0.0`,
    `   \\ \\/ /      \\ \\/ /             ${pad('Editor:')} Neovim (btw)`,
    `    \\  /        \\  /              ${pad('Theme:')} dark`,
    `     \\/          \\/               ${pad('Date:')} ${now.toDateString()}`,
    '                                   ─────────────────────────────',
    '                                   ■ ■ ■ ■ ■ ■ ■ ■',
  ]
}

export const commands: CommandRegistry = {
  help: {
    description: 'List all available commands',
    execute: () => [
      'Available commands:',
      '',
      '  — Info ────────────────────────────────────',
      '  about       — Who is aivangogh?',
      '  banner      — Show welcome banner',
      '  contact     — Contact and links',
      '  date        — Show current date and time',
      '  history     — Show command history',
      '  neofetch    — System info with ASCII art',
      '  projects    — List open-source projects',
      '  skills      — Tech stack and skills',
      '  whoami      — Who are you?',
      '',
      '  — Fun ─────────────────────────────────────',
      '  cowsay      — Make the cow say something',
      '  fortune     — Random quote',
      '  hack        — l33t hax0r mode',
      '  matrix      — Wake up, Neo...',
      '  sudo        — Do I look like I have sudo?',
      '  vim         — Enter the void',
      '',
      '  — Utility ──────────────────────────────────',
      '  clear       — Clear terminal',
      '  echo        — Print arguments',
      '  help        — Show this message',
      '',
      '  Tip: Tab to autocomplete · ↑↓ to navigate history',
      '  Tip: Vim users: :q :wq :w :q! :help also work',
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
      '  Tools        Vite, Turborepo, Neovim, Git',
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
    execute: (args) => args.join(' ') || '',
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

  // ── Fun commands ──────────────────────────────────────────────

  neofetch: {
    description: 'System info with ASCII art',
    execute: () => animated(
      neofetch().map((text, i) => ({ text, delay: i === 0 ? 0 : 60 }))
    ),
  },

  cowsay: {
    description: 'Make the cow say something',
    execute: (args) => cowsay(args.join(' ')),
  },

  fortune: {
    description: 'Print a random quote',
    execute: () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)],
  },

  matrix: {
    description: 'Wake up, Neo...',
    execute: () => animated([
      { text: 'Wake up, Neo...',                                    delay: 0 },
      { text: '',                                                   delay: 800 },
      { text: 'The Matrix has you...',                             delay: 1000 },
      { text: '',                                                   delay: 700 },
      { text: 'Follow the white rabbit.',                          delay: 900 },
      { text: '',                                                   delay: 600 },
      { text: '  01001000 01100101 01101100 01101100 01101111',    delay: 500 },
      { text: '  01010111 01101111 01110010 01101100 01100100',    delay: 200 },
      { text: '',                                                   delay: 600 },
      { text: 'Knock knock, Neo.',                                  delay: 800 },
    ]),
  },

  hack: {
    description: 'l33t hax0r mode',
    execute: () => animated([
      { text: 'Initializing hack sequence...',         delay: 0 },
      { text: '',                                       delay: 400 },
      { text: '  [░░░░░░░░░░░░░░░░░░░░]  0%',         delay: 200 },
      { type: 'update', text: '  [████░░░░░░░░░░░░░░░░] 20%', delay: 250 },
      { type: 'update', text: '  [████████░░░░░░░░░░░░] 40%', delay: 250 },
      { type: 'update', text: '  [████████████░░░░░░░░] 60%', delay: 250 },
      { type: 'update', text: '  [████████████████░░░░] 80%', delay: 250 },
      { type: 'update', text: '  [████████████████████] 100%', delay: 300 },
      { text: '',                                       delay: 400 },
      { text: '  ✓ Bypassing firewall',                delay: 200 },
      { text: '  ✓ Accessing mainframe',               delay: 350 },
      { text: '  ✓ Downloading the internet',          delay: 400 },
      { text: '  ✓ Uploading virus to the cloud',      delay: 300 },
      { text: '  ✓ Mining crypto on your GPU',         delay: 350 },
      { text: '  ✓ Hacking the Gibson',                delay: 500 },
      { text: '',                                       delay: 500 },
      { text: 'H4CK C0MPL3T3. You are now 1337.',     delay: 0 },
      { text: '',                                       delay: 300 },
      { text: '(Just kidding. Please don\'t hack things.)', delay: 0 },
    ]),
  },

  sudo: {
    description: 'Attempt to sudo',
    execute: (args) => {
      if (!args.length) return 'usage: sudo <command>'
      return [
        `[sudo] password for guest:`,
        '',
        'guest is not in the sudoers file.',
        'This incident will be reported.',
      ]
    },
  },

  vim: {
    description: 'Enter the void',
    execute: () => [
      '  Opening vim...',
      '',
      '  ~',
      '  ~',
      '  ~',
      '  ~',
      '  ~',
      '  -- NORMAL --',
      '',
      '  You are now trapped.',
      '  Type :q to quit (it won\'t work).',
      '  Type :q! to force quit (also won\'t work).',
      '  Type :wq to save and quit (lol).',
      '  Good luck.',
    ],
  },

  // ── Vim colon commands ─────────────────────────────────────────

  ':q': {
    description: 'Quit (vim)',
    execute: () => 'No write since last change (add ! to override)',
  },

  ':q!': {
    description: 'Force quit (vim)',
    execute: () => 'Nice try. You can never truly leave.',
  },

  ':wq': {
    description: 'Save and quit (vim)',
    execute: () => 'Saved to /dev/null. Still not quitting.',
  },

  ':w': {
    description: 'Save (vim)',
    execute: () => '"terminal" 0L, 0C written',
  },

  ':help': {
    description: 'Vim help',
    execute: () => [
      'VIM - Vi IMproved  (this is not vim)',
      '',
      '  :q       — quit (you can\'t)',
      '  :q!      — force quit (still no)',
      '  :wq      — save and quit (lol)',
      '  :w       — save (to /dev/null)',
      '  :help    — you are here',
      '',
      'Type \'help\' for actual terminal commands.',
    ],
  },

  ':set': {
    description: 'Set vim option',
    execute: (args) => {
      const opt = args[0]
      if (opt === 'number' || opt === 'nu') return 'Line numbers enabled (trust me, they\'re there).'
      if (opt === 'relativenumber' || opt === 'rnu') return 'Relative line numbers enabled. Very cool.'
      if (opt === 'nohlsearch' || opt === 'nohl') return 'Search highlighting cleared.'
      return `Unknown option: ${opt ?? '(none)'}`
    },
  },

  ':colorscheme': {
    description: 'Set vim colorscheme',
    execute: (args) => {
      const scheme = args[0] ?? 'default'
      return `Colorscheme '${scheme}' applied. Looking good.`
    },
  },

  ':PlugInstall': {
    description: 'Install vim plugins',
    execute: () => [
      'Updated. Elapsed time: 0.000001 sec.',
      '',
      '  ✓ No plugins installed (you have none).',
      '',
      'Consider using lazy.nvim instead.',
    ],
  },
}

export const allCommandNames = Object.keys(commands)
