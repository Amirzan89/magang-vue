<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const toast = useToast()
const chartData = ref<any>()
const chartOptions = ref<any>(null)
const local = reactive({
    list_events: null,
    total_event: 0,
    event_group: [],
})
const setChartData = () => {
    if (!local.event_group?.length) return {};
    const documentStyle = getComputedStyle(document.body);
    return {
        labels: local.event_group.map((e: any) => e.event_group_name),
        datasets: [
            {
                data: local.event_group.map((e: any) => e.total_event),
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-cyan-500'),
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-gray-500'),
                    documentStyle.getPropertyValue('--p-blue-500'),
                    documentStyle.getPropertyValue('--p-green-500'),
                    documentStyle.getPropertyValue('--p-pink-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-cyan-400'),
                    documentStyle.getPropertyValue('--p-orange-400'),
                    documentStyle.getPropertyValue('--p-gray-400'),
                    documentStyle.getPropertyValue('--p-blue-400'),
                    documentStyle.getPropertyValue('--p-green-400'),
                    documentStyle.getPropertyValue('--p-pink-400')
                ]
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: textColor
                }
            }
        }
    };
};
onBeforeMount(async() => {
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    if(res.status == 'error'){
        if(res.code === 401){
            toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
        }else{
            toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        }
        setTimeout(() => {
            router.push('/login')
        }, 3000);
        return
    }
    local.list_events = res.data.list_events
    local.total_event = res.data.total_event
    local.event_group = res.data.event_group
    if (local.event_group && local.event_group.length) {
        chartData.value = setChartData()
        chartOptions.value = setChartOptions()
    }
})
</script>
<template>
    <main class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6 xl:row-span-2">
            <div class="card">
                <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]"></Chart>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
            <div class="card mb-0 h-full">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total Event</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ local.total_event }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
            <div class="card mb-0 h-full">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total Kategori</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ local.total_event }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <DataTable :value="local.list_events" tableStyle="min-width: 50rem" :pt="{ root: { class: ['col-span-12 rounded-xl'] } }">
            <template #header>
                <div class="flex flex-wrap">
                    <span class="text-xl font-bold">List Item</span>
                </div>
            </template>
            <Column field="event_name" header="Nama Event"></Column>
            <Column field="start_date" header="Tanggal Mulai Event"></Column>
            <Column field="nama_lokasi" header="Nama Lokasi"></Column>
            <Column field="link_lokasi" header="Posisi Lokasi">
                <template #body="slotProps">
                    <Button as="a" :href="slotProps.data.link_lokasi" target="_blank" rel="noopener noreferrer">
                        <i class="pi pi-map-marker"></i>
                        <span>Lokasi</span>
                    </Button>
                </template>
            </Column>
        </DataTable>
    </main>
</template>