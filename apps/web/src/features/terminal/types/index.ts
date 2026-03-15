export interface HistoryEntry {
  command: string
  outputs: string[]
}

export type CommandResult = string | string[]

export interface CommandDef {
  description: string
  execute: (args: string[], ctx: TerminalContext) => CommandResult | Promise<CommandResult>
}

export interface TerminalContext {
  inputHistory: string[]
  clearSession: () => void
}

export type CommandRegistry = Record<string, CommandDef>
