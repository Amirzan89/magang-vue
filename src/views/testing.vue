<script setup lang="ts">
import { ref } from 'vue'
import { useLoading } from '@/stores/Loading'
const Loading = useLoading()
const stateLoading = ref(false)
const toggleLoading = () => {
    stateLoading.value = !stateLoading.value
    Loading.visible = stateLoading.value
}
</script>
<template>
    <button class="btn" @click="toggleLoading">piteken</button>
</template>