<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
import EventFormAdmin from '@/components/EventFormAdmin.vue'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const toast = useToast()
const local = reactive({
    isFirstTime: true,
    fetchData: [] as { name: string, value: string }[],
})
onBeforeMount(async() => {
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    if(res.status == 'error'){
        if(res.code === 401){
            toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
            setTimeout(() => router.push('/login'), 3000)
            return
        }
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        return
    }
    local.fetchData = res.data
})
</script>
<template>
    <section class="flex flex-col sm:gap-0.5 md:gap-1 lg:gap-1.5">
        <h1 class="!p-0 !m-0 !text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl">Event Tambah</h1>
        <div class="card !pt-0 !px-3 !pb-4" style="box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
            <EventFormAdmin mode="tambah" :inpDataGroup="local.fetchData"/>
        </div>
    </section>
</template>