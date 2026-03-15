<template>
  <div class="flex items-center gap-2 px-4 border-b border-border bg-muted/50 select-none shrink-0 h-9">
    <!-- Traffic lights -->
    <div class="flex items-center gap-1.5 group">
      <div class="size-3 rounded-full bg-red-500 flex items-center justify-center">
        <span class="text-red-900 text-[8px] font-bold leading-none opacity-0 group-hover:opacity-100 transition-opacity">×</span>
      </div>
      <div class="size-3 rounded-full bg-yellow-500 flex items-center justify-center">
        <span class="text-yellow-900 text-[8px] font-bold leading-none opacity-0 group-hover:opacity-100 transition-opacity">−</span>
      </div>
      <div class="size-3 rounded-full bg-green-500 flex items-center justify-center">
        <span class="text-green-900 text-[8px] font-bold leading-none opacity-0 group-hover:opacity-100 transition-opacity">+</span>
      </div>
    </div>

    <!-- Title -->
    <div class="flex-1 text-center text-[11px] text-muted-foreground">
      <span class="text-muted-foreground/50">guest@aivangogh: </span>
      <span>~</span>
    </div>
  </div>
</template>
