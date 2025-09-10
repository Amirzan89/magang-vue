<script setup lang="ts">
import type { WithClassAsProps } from './interface'
const props = defineProps<{
  totalItems: number
  currentIndex: number
  customTW?: string
  customCSS?: string
} & WithClassAsProps>()
const emit = defineEmits<{
  (e: 'goToSlide', index: number): void
}>()
</script>
<template>
  <div
    class="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex gap-2"
    :class="props.customTW"
    :style="props.customCSS"
  >
    <template v-for="(_, index) in props.totalItems" :key="index">
      <div
        class="w-4 h-4 rounded-full border-2 transition-all duration-300 cursor-pointer"
        :class="index === props.currentIndex
          ? 'bg-green-500 border-green-600 scale-110'
          : 'bg-transparent border-green-500 opacity-50 hover:opacity-100'"
        @click="emit('goToSlide', index)"
      />
    </template>
  </div>
</template>