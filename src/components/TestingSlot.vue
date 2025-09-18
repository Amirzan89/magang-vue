<script setup lang="ts">
import { ref, watch } from 'vue';
const local = ref('')
const injectFunction = (inp: any) => {
    console.log('wss entokk ', inp)
    local.value = inp
    console.log('horee wss entokk ', local.value)
}
watch(() => local, () => {
    console.log('nguwasii', local.value)
}, { immediate: true })
</script>
<template>
    <p>{{ local }}</p>
    <slot name="testing" :sendToComponent="injectFunction"></slot>
</template>