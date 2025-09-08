<script setup lang="ts">
import { useToastStore } from '@/stores/Toast'
const Toast = useToastStore()
const redToast = () => {
    Toast.error({ id: Date.now().toString(), title: 'testing abang', message: 'akuuuuu abang' })
}
const ijoToast = () => {
    Toast.success({ id: Date.now().toString(), title: 'testing ijo', message: 'akuuuuu ijoo' })
}
</script>
<template>
    <button class="bg-red-500" @click="redToast">piteken</button>
    <button class="bg-green-500" @click="ijoToast">piteken</button>
</template>