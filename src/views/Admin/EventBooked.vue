<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatTgl } from '@/utils/global'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
const route = useRoute()
const { reqData } = useAxios()
const toast = useToast()
type DialogInp = { label: string; format?: (val: any) => string }
interface EventBooked {
    id: string
    registrationno: string
    registrationname: string,
    gender: 'M' | 'F',
    email: string
    mobileno: string
    eventid: string
    registrationdate: string
    paymentamount: string
    paymentdate: string
    registrationstatus: string
    paymenttype: string
    notes: string
}
const dt = ref()
const local = reactive({
    fetchData: [] as EventBooked[]
})
const filters = ref<any>(null)
const loadingDT = ref(true)
const ebDialog = ref<Partial<EventBooked> | null>(null)
const eventBookedStateDialog = ref(false)
const currentFirst = ref(0)
const rows = ref(10)
const onPage = (event: { first: number; rows: number }) => {
    currentFirst.value = event.first
    rows.value = event.rows
}
const initialFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        registrationname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        registrationdate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        eventgroup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    }
}
initialFilters()
const clearFilters = () => {
    initialFilters()
}
const showDialog = (data: EventBooked) => {
    ebDialog.value = { ...data }
    eventBookedStateDialog.value = true
}
const hideDialog = () => (eventBookedStateDialog.value = false)
onBeforeMount(async() => {
    const res = await reqData({
        url: route.path,
        method: 'POST',
        reqType: 'Json',
    })
    loadingDT.value = false
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, group: 'br', life: 3000 })
        return
    }
    local.fetchData = res.data.map((item: any) => ({
        ...item,
        registrationdate: new Date(item.registrationdate)
    }))
})
const exportCSV = () => dt.value.exportCSV()
const detailFormDialog = {
    registrationno: { label: 'Registration No' },
    registrationname: { label: 'Name' },
    mobileno: { label: 'Mobile Number' },
    gender: { label: 'Gender', format: (v) => v == 'M  ' ? 'Male' : 'Female' },
    email: { label: 'Email' },
    registrationdate: { label: 'Registration Date', format: (v) => formatTgl(new Date(v)) },
    paymentdate: { label: 'Payment Date', format: (v) => formatTgl(new Date(v)) },
    paymentamount: { label: 'Payment Amount', format: (v) => `${Number(v).toLocaleString('id-ID')}` },
    paymenttype: { label: 'Payment Type' },
    registrationstatus: { label: 'Status' },
    notes: { label: 'Notes' }
} as Record<keyof Pick<EventBooked, 
    'registrationno' | 'registrationname' | 'mobileno' | 'gender' | 'email' | 'registrationdate' | 'paymentdate' | 'paymentamount' | 'paymenttype' | 'registrationstatus' | 'notes'
>, DialogInp>

</script>
<template>
    <main class="card">
        <Toolbar class="mb-6">
            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="local.fetchData" dataKey="id" :paginator="true" :rows="rows" :rowsPerPageOptions="[5,10,25]" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" :loading="loadingDT" v-model:filters="filters" filterDisplay="menu" showGridlines :globalFilterFields="['registrationname','email','eventid','registrationstatus','paymenttype']" @page="onPage">
            <template #header>
                <div class="flex justify-between items-center">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilters" />
                    <IconField>
                        <InputIcon><i class="pi pi-search" /></InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Global Search" />
                    </IconField>
                </div>
            </template>
            <template #empty>No bookings found.</template>
            <template #loading>Loading event bookings...</template>
            <Column header="No" style="width: 4rem; text-align: center">
                <template #body="{ index, data }">
                    {{ currentFirst + index + 1 }}
                </template>
            </Column>
            <Column field="registrationno" header="Reg No" sortable style="min-width: 10rem" />
            <Column field="registrationname" header="Name" sortable style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search name" />
                </template>
            </Column>
            <Column field="email" header="Email" sortable style="min-width: 14rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search email" />
                </template>
            </Column>
            <Column field="registrationdate" header="Date" sortable dataType="date" style="min-width: 10rem">
                <template #body="{ data }">{{ formatTgl(data.registrationdate) }}</template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="Select date" />
                </template>
            </Column>
            <Column field="eventgroup" header="Event Group" sortable style="min-width: 8rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Event Group" />
                </template>
            </Column>
            <Column header="Action" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" outlined rounded @click="showDialog(data)" />
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="eventBookedStateDialog" class="w-[75%] xs:w-[330px] phone:w-[400px] sm:w-[480px]" header="Booking Details" modal>
            <div v-if="ebDialog" class="flex flex-col gap-3">
                <div v-for="(config, key) in detailFormDialog" :key="key" class="flex flex-col">
                    <label class="font-semibold">{{ config.label }}</label>
                    <InputText :value="config.format ? config.format(ebDialog[key]) : ebDialog[key]" disabled/>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" text @click="hideDialog" />
            </template>
        </Dialog>
    </main>
</template>