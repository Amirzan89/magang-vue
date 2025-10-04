<template>
    <HeaderComponent/>
    <router-view />
    <FooterComponent/>
</template>
<script setup lang="ts">
import HeaderComponent from '@/layouts/HeaderHome.vue'
import FooterComponent from '@/layouts/FooterHome.vue'
</script>