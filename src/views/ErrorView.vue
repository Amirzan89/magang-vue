<template>
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
    <Footer></Footer>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
// import HeaderAuth from '@/components/HeaderAuth.vue'
import NotFound from '@/components/Error/NotFound.vue'
const curLayout = useRoute().meta.layout
</script>