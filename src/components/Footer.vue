<template>
    <footer class="layout-footer">
        <span class="3xs:tw-text-xs xs:tw-text-sm sm:tw-text-base lg:tw-text-lg tw-text-palText">
            © Copyright {{ publicConfig.appName }}. All Rights Reserved
        </span>
    </footer>
</template>
<script setup lang="ts">
import { useConfig } from '@/composables/useConfig';
const publicConfig = useConfig()
</script>