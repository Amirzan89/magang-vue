<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToastStore } from '@/stores/Toast';
import ToastComponent from '@/components/CustomToast/Toast.vue';
const toast = useToastStore();
const getPositionContainer = ref('');
let lastPos = '';
watch(() => toast.config.position, (newPosition: string) => {
    if(newPosition === lastPos) return;
    const positions: Record<string, string> = {
        'top-left': 'tw-top-0 tw-left-0 tw-mt-4 tw-ml-4',
        'top-center': 'tw-top-0 tw-left-1/2 -tw-translate-x-1/2 tw-mt-4',
        'top-right': 'tw-top-0 tw-right-0 tw-mt-4 tw-mr-4',
        'bottom-left': 'tw-bottom-0 tw-left-0 tw-mb-4 tw-ml-4',
        'bottom-center': 'tw-bottom-0 tw-left-1/2 -tw-translate-x-1/2 tw-mb-4',
        'bottom-right': 'tw-bottom-0 tw-right-0 tw-mb-4 tw-mr-4',
    };
    getPositionContainer.value = positions[newPosition] || 'tw-top-0 tw-left-0';
    lastPos = newPosition;
}, { immediate: true });
</script>
<template>
    <transition-group name="toast" tag="div" class="tw-fixed tw-w-100 tw-max-h-120" :class="getPositionContainer" style="z-index: 999">
        <template v-for="toast in toast.toastData" :key="toast.id">
            <ToastComponent :id="toast.id" :title="toast.title" :message="toast.message" :type="toast.type" :icon="toast.icon" :duration="toast.duration" :timeData="toast.timeData" :class="toast.class" @closeToast="toast.closePopup" />
        </template>
    </transition-group>
</template>
<style scoped>
div div{
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
}
div div:nth-child(n+2) {
    margin-top: 5px;
}
</style>