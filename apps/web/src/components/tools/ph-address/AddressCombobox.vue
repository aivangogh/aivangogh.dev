<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckIcon, ChevronsUpDownIcon, LockIcon, LockOpenIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@aivangogh/ui/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@aivangogh/ui/components/ui/command'
import { Button } from '@aivangogh/ui/components/ui/button'
import { Badge } from '@aivangogh/ui/components/ui/badge'

const props = defineProps<{
  modelValue: string
  items: { label: string; value: string; meta?: string }[]
  placeholder: string
  searchPlaceholder: string
  disabled?: boolean
  label: string
  step: number
  lockable?: boolean
  locked?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'toggle-lock': []
}>()

const open = ref(false)
const isCompleted = computed(() => !!props.modelValue)
const selected = computed(() => props.items.find((i) => i.value === props.modelValue))

function handleSelect(value: string) {
  emit('update:modelValue', value === props.modelValue ? '' : value)
  open.value = false
}
</script>

<template>
  <div class="space-y-2">
    <!-- Label row -->
    <div class="flex items-center gap-2">
      <span
        class="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors"
        :class="
          isCompleted
            ? 'bg-foreground text-background'
            : disabled
              ? 'bg-muted text-muted-foreground'
              : 'bg-foreground/10 text-foreground'
        "
      >
        <CheckIconv-if="isCompleted" class="size-3" />
        <span v-else>{{ step }}</span>
      </span>

      <label
        class="text-sm font-medium transition-colors"
        :class="disabled ? 'text-muted-foreground' : 'text-foreground'"
      >
        {{ label }}
      </label>

      <div class="ml-auto flex items-center gap-1.5">
        <Badge
          v-if="!disabled && items.length && !isCompleted"
          variant="secondary"
          class="px-1.5 py-0 text-[11px] font-normal"
        >
          {{ items.length.toLocaleString() }}
        </Badge>
        <code
          v-if="isCompleted"
          class="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {{ selected?.meta }}
        </code>
        <Button
          v-if="lockable && isCompleted"
          variant="ghost"
          size="icon"
          class="size-5 text-muted-foreground hover:text-foreground"
          :class="locked ? 'text-foreground' : ''"
          :title="locked ? 'Unlock this level' : 'Lock this level'"
          @click.stop="$emit('toggle-lock')"
        >
          <LockIconv-if="locked" class="size-3" />
          <LockOpenIconv-else class="size-3" />
        </Button>
      </div>
    </div>

    <!-- Trigger + Dropdown -->
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :disabled="disabled || locked"
          class="h-10 w-full justify-between px-3 font-normal transition-colors"
          :class="[
            !selected ? 'text-muted-foreground' : 'text-foreground',
            isCompleted ? 'border-foreground/20 bg-muted/30' : '',
          ]"
        >
          <span class="truncate">{{ selected ? selected.label : placeholder }}</span>
          <ChevronsUpDownIconclass="ml-2 size-4 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0" align="start" :style="{ width: 'var(--reka-popper-anchor-width)' }">
        <Command>
          <CommandInput :placeholder="searchPlaceholder" class="h-9" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="item in items"
                :key="item.value"
                :value="item.label"
                @select="handleSelect(item.value)"
              >
                <Check
                  class="mr-2 size-4 shrink-0 transition-opacity"
                  :class="modelValue === item.value ? 'opacity-100' : 'opacity-0'"
                />
                <span class="flex-1 truncate text-sm">{{ item.label }}</span>
                <code
                  v-if="item.meta"
                  class="ml-3 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground"
                >
                  {{ item.meta }}
                </code>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
