<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  customTW?: string,
  customCSS?: string,
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ' + customTW,
        props.class,
      )
    "
    :style="customCSS"
  >
    <slot />
  </div>
</template>
