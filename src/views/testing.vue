<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
const toast = useToast()
function showSuccess() {
    toast.add({
        severity: 'success',
        summary: 'Sukses',
        detail: 'Operasi berhasil dilakukan',
        life: 3000
    })
}
</script>
<template>
    <button class="bg-red-500" @click="showSuccess">piteken</button>
</template>