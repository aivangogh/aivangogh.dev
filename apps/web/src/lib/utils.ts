// Re-export cn from the UI package so that @aivangogh/ui components can
// resolve their internal "@/lib/utils" import via this app's @ alias.
export { cn } from '@aivangogh/ui/lib/utils'
