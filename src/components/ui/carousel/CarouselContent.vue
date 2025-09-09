<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { WithClassAsProps } from "./interface"
import { cn } from "@/lib/utils"
import { useCarousel } from "./useCarousel"

defineOptions({
  inheritAttrs: false,
})
// interface WithClassAsProps {
//   class?: string
//   customTW?: string
//   customCSS?: string
// }
const props = defineProps<{
  customTW?: string,
  customCSS?: string,
} & WithClassAsProps>()

const { carouselRef, orientation } = useCarousel()
</script>

<template>
  <div
    ref="carouselRef"
    data-slot="carousel-content"
    class="overflow-hidden"
    :class="customTW"
    :style="customCSS"
    >
    <div
    :class="
        cn(
          'flex ' + customTW,
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          props.class,
      )"
      :style="customCSS"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </div>
</template>
