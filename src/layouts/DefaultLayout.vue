<template>
    <HeaderComponent/>
    <router-view />
    <FooterComponent/>
    <Toast position="bottom-right" />
</template>
<script setup lang="ts">
import HeaderComponent from './HeaderHome.vue'
import FooterComponent from './FooterHome.vue'
</script>