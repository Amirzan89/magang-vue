<script setup lang="ts">
import { useLoadingStore } from '@/stores/Loading'
const loading = useLoadingStore()
</script>
<template>
    <div v-if="loading.isLoading" class="fixed left-0 top-0 w-full h-full pointer-events-none" style="z-index: 9999">
        <div class="relative w-full h-full left-0 top-0" style="background-color: rgba(0, 0, 0, 0.25)"></div>
        <div class="absolute inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-25 loader"></div>
    </div>
</template>
<style>
.loader {
    aspect-ratio: .75;
    --c: no-repeat linear-gradient(#fff 0 0);
    background:
        var(--c) 0%   50%,
        var(--c) 50%  50%,
        var(--c) 100% 50%;
    background-size: 20% 50%;
    animation: l6 1s infinite linear;
}
@keyframes l6 {
    20% {background-position: 0% 0%  ,50% 50% ,100% 50% }
    40% {background-position: 0% 100%,50% 0%  ,100% 50% }
    60% {background-position: 0% 50% ,50% 100%,100% 0%  }
    80% {background-position: 0% 50% ,50% 50% ,100% 100%}
}
</style>