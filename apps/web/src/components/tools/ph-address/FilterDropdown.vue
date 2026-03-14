<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckIcon, LockIcon, LockOpenIcon, XIcon } from 'lucide-vue-next'
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

const props = defineProps<{
  modelValue: string
  items: { label: string; value: string }[]
  placeholder: string
  searchPlaceholder: string
  locked?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'toggle-lock': []
  clear: []
}>()

const open = ref(false)
const selected = computed(() => props.items.find((i) => i.value === props.modelValue))
</script>

<template>
  <div class="flex items-center gap-1">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          size="sm"
          :disabled="locked"
          class="h-7 px-2.5 text-xs font-normal"
          :class="modelValue ? 'border-foreground/30 bg-muted/40' : 'text-muted-foreground'"
        >
          {{ selected?.label ?? placeholder }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-64 p-0" align="start">
        <Command>
          <CommandInput :placeholder="searchPlaceholder" class="h-8" />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="item in items"
                :key="item.value"
                :value="item.label"
                @select="$emit('update:modelValue', item.value); open = false"
              >
                <CheckIcon
                  class="mr-2 size-3.5 shrink-0"
                  :class="modelValue === item.value ? 'opacity-100' : 'opacity-0'"
                />
                <span class="text-xs">{{ item.label }}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <template v-if="modelValue">
      <Button
        variant="ghost"
        size="icon"
        class="size-5 text-muted-foreground hover:text-foreground"
        :class="{ 'text-foreground': locked }"
        :title="locked ? 'Unlock' : 'Lock'"
        @click="$emit('toggle-lock')"
      >
        <LockIconv-if="locked" class="size-3" />
        <LockOpenIconv-else class="size-3" />
      </Button>
      <button
        v-if="!locked"
        class="text-muted-foreground hover:text-foreground"
        @click="$emit('clear')"
      >
        <XIconclass="size-3" />
      </button>
    </template>
  </div>
</template>
