<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchDataStore } from '@/stores/FetchData';
const chartData = ref<any>();
const chartOptions = ref<any>(null);
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
    const res = await useFetchDataStore().fetchPage(useRoute().path, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
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
    <main class="grid">
        <div class="">
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]"></Chart>
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