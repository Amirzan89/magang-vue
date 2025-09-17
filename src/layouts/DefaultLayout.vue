<template>
    <HeaderComponent/>
    <router-view />
    <FooterComponent/>
</template>
<script setup lang="ts">
import HeaderComponent from '@/components/HeaderHome.vue'
import FooterComponent from '@/components/Footer.vue'
</script>