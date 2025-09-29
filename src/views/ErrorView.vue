<template>
    <HeaderComponent></HeaderComponent>
    <!-- <template v-if="curLayout === 'default'">
    </template>
    <template v-else-if="curLayout === 'auth'">
        <HeaderAuth/>
    </template>
    <template v-if="curLayout === 'default'">
        <Navbar/>
    </template>
    <NotFound/>
    <template v-if="curLayout !== 'empty'">
    </template> -->
    <NotFound/>
    <FooterComponent></FooterComponent>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderComponent from '@/components/HeaderHome.vue'
import FooterComponent from '@/components/Footer.vue'
import NotFound from '@/components/Error/NotFound.vue'
const curLayout = useRoute().meta.layout
</script>