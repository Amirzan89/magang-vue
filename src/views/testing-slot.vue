<script setup lang="ts">
import TestingSlotComponent from '@/components/TestingSlot.vue'
</script>
<template>
    <TestingSlotComponent>
        <template #testing="{ sendToComponent }">
            <button @click="sendToComponent('pppp coo kenekkk')">ikiii button</button>
        </template>
    </TestingSlotComponent>
</template>