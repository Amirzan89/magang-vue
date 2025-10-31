<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
import EventFormAdmin from '@/components/EventFormAdmin.vue'
import { type EventGroup, type EventData } from '@/components/EventFormAdmin.vue'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const toast = useToast()
const local = reactive({
    isFirstTime: true,
    fetchDataGroup: [] as EventGroup[],
    fetchData: {} as EventData,
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
    if(route.name == 'EventTambahPage'){
        local.fetchData = res.data
    }else{
        console.log('mariii ', res)
        local.fetchDataGroup = res.data.category
        local.fetchData = res.data.event
    }
})
</script>
<template>
    <section class="flex flex-col sm:gap-0.5 md:gap-1 lg:gap-1.5">
        <h1 class="!p-0 !m-0 !text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl">
            <template v-if="route.name == 'EventTambahPage'">Event Tambah</template>
            <template v-else>Event Detail</template>
        </h1>
        <div class="card !pt-0 !px-3 !pb-4" style="box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
            <EventFormAdmin :mode="(route.name == 'EventTambahPage') ? 'tambah' : 'detail'" :inpDataGroup="local.fetchDataGroup" :inpData="local.fetchData"/>
        </div>
    </section>
</template>