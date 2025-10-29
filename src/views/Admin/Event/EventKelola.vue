<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { onBeforeMount, reactive, ref, type Ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { formatTgl } from '@/utils/global'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const toast = useToast()
type DialogInp = { label: string; format?: (val: any) => string }
interface EventData {
    id: string
    id_event: string
    event_name: string
    event_group: string
    start_date: string
}
const dt = ref()
const local = reactive({
    fetchData: [] as EventData[]
})
const filters = ref<any>(null)
const loadingDT = ref(true)
const currentFirst = ref(0)
const rows = ref(10)
const eventData: Ref<EventData | {}> = ref({})
const deleteEventDialog = ref()
const deleteEventsDialog = ref()
const selectedEvents = ref()
const onPage = (event: { first: number; rows: number }) => {
    currentFirst.value = event.first
    rows.value = event.rows
}
const initialFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        event_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        event_group: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        start_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    }
}
initialFilters()
const clearFilters = () => {
    initialFilters()
}
onBeforeMount(async() => {
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    loadingDT.value = false
    if(res.status == 'error'){
        if(res.code === 401){
            toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
            setTimeout(() => router.push('/login'), 3000)
            return
        }
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        return
    }
    local.fetchData = res.data.map((item: any) => ({
        ...item,
        start_date: new Date(item.start_date)
    }))
})
const exportCSV = () => {
    dt.value.exportCSV()    
}
const confirmDeleteEvent = (prod: EventData | {}) => {
    eventData.value = prod;
    deleteEventDialog.value = true
}
const confirmDeleteSelected = () => {
    deleteEventsDialog.value = true
}
const deleteEvent = async (cond: 'single' | 'multi') => {
    let ids: string[] = []
    if(cond === 'single' && (eventData.value as EventData).id_event){
        ids = [(eventData.value as EventData).id_event]
    }else if(cond === 'multi' && selectedEvents.value?.length){
        ids = selectedEvents.value.map((e: any) => e.id_event)
    }else{
        toast.add({ severity: 'warn', summary: 'Tidak ada event terpilih', life: 2500 })
        return
    }
    const res = await reqData({
        url: '/api/kelola-event',
        method: 'DELETE',
        reqBody: { id_events: ids },
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status === 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Hapus Event', detail: res.message, life: 3000 })
        return
    }
    local.fetchData = local.fetchData.filter((val: any) => !ids.includes(val.id_event))
    if(cond === 'single'){
        deleteEventDialog.value = false
        eventData.value = {}
    }else{
        deleteEventsDialog.value = false
        selectedEvents.value = null
    }
    toast.add({ severity: 'success', summary: 'Berhasil Hapus Event', detail: res.message || 'Event berhasil dihapus', life: 3000 })
}
</script>
<template>
    <section class="flex flex-col sm:gap-0.5 md:gap-1 lg:gap-1.5">
        <h1 class="!p-0 !m-0 !text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl">Kelola Event</h1>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button :as="RouterLink" to="/kelola-event/tambah" label="Tambah Event" icon="pi pi-plus" severity="secondary" class="mr-2"/>
                    <Button label="Delete Event" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedEvents || !selectedEvents.length" />
                </template>
        
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
                </template>
            </Toolbar>
            <DataTable ref="dt" v-model:selection="selectedEvents" :value="local.fetchData" dataKey="id" :paginator="true" :rows="rows" :rowsPerPageOptions="[5,10,25]" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" :loading="loadingDT" v-model:filters="filters" filterDisplay="menu" showGridlines :globalFilterFields="['registrationname','email','eventid','registrationstatus','paymenttype']" @page="onPage">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilters" />
                        <IconField>
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Global Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty>No Event found.</template>
                <template #loading>Loading event...</template>
                <Column header="No" style="width: 4rem; text-align: center">
                    <template #body="{ index, data }">
                        {{ currentFirst + index + 1 }}
                    </template>
                </Column>
                <Column field="event_name" header="Nama Event" sortable style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Search Event Name" />
                    </template>
                </Column>
                <Column field="event_group" header="Kategori Event" sortable style="min-width: 14rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Search Event Group" />
                    </template>
                </Column>
                <Column field="start_date" header="Date" sortable dataType="date" style="min-width: 10rem">
                    <template #body="{ data }">{{ formatTgl(data.start_date) }}</template>
                    <template #filter="{ filterModel }">
                        <DatePicker v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="Select tanggal event" />
                    </template>
                </Column>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column header="Action" :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button :as="RouterLink" :to="'/kelola-event/' + slotProps.data.id_event" icon="pi pi-pencil" outlined rounded class="mr-2"/>
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteEvent(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
    <Dialog v-model:visible="deleteEventDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="eventData">Are you sure you want to delete <b>{{ (eventData as EventData).event_name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteEventDialog = false" />
            <Button label="Yes" icon="pi pi-check" @click="deleteEvent('single')" />
        </template>
    </Dialog>
    <Dialog v-model:visible="deleteEventsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="eventData">Are you sure you want to delete the selected events ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteEventsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteEvent('multi')" />
        </template>
    </Dialog>
</template>