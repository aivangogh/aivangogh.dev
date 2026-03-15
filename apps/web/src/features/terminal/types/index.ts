export interface HistoryEntry {
  command: string
  outputs: string[]
}

export type CommandResult = string | string[] | AnimatedOutput

export interface CommandDef {
  description: string
  execute: (args: string[], ctx: TerminalContext) => CommandResult | Promise<CommandResult>
}

export interface TerminalContext {
  inputHistory: string[]
  clearSession: () => void
}

export type CommandRegistry = Record<string, CommandDef>

// ── Animated output ──────────────────────────────────────────

export type AnimatedFrame =
  | { type?: 'append'; text: string; delay: number }  // add a new line
  | { type: 'update'; text: string; delay: number }   // replace the last line

export interface AnimatedOutput {
  __animated: true
  frames: AnimatedFrame[]
}

/** Helper to build animated command output */
export function animated(frames: AnimatedFrame[]): AnimatedOutput {
  return { __animated: true, frames }
}

export function isAnimated(result: CommandResult): result is AnimatedOutput {
  return typeof result === 'object' && !Array.isArray(result) && '__animated' in result
}
