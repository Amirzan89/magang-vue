<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useFetchDataStore } from '@/stores/FetchData';
const local = reactive({
    list_events: null,
    total_event: 0,
    event_group: [],
})
onBeforeMount(async() => {
    const res = await useFetchDataStore().fetchPage(useRoute().path, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.list_events = res.data.list_events
    local.total_event = res.data.total_event
    local.event_group = res.data.event_group
})
</script>
<template>
    <main class="grid">
        <div class="">
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