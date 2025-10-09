<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFetchDataStore } from '@/stores/FetchData'
interface EventBooked {
    id: string
    registrationno: string
    registrationname: string
    email: string
    mobileno: string
    eventid: string
    registrationdate: string
    paymentamount: string
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
const ebDialog = ref<EventBooked | null>(null)
const eventBookedStateDialog = ref(false)
const currentFirst = ref(0)
const rows = ref(10)
const statusOptions = [
    { label: 'Open', value: 'O' },
    { label: 'Closed', value: 'C' },
    { label: 'Pending', value: 'P' }
]
const paymentTypeOptions = [
    { label: 'Cash', value: 'C' },
    { label: 'Transfer', value: 'T' },
    { label: 'QRIS', value: 'Q' }
]
const onPage = (event: { first: number; rows: number }) => {
    currentFirst.value = event.first
    rows.value = event.rows
}
const initialFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        registrationname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        eventid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        registrationstatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        paymenttype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        paymentamount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        registrationdate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    }
}
initialFilters()
const clearFilters = () => {
    initialFilters()
}
const formatDate = (val: string) => new Date(val).toLocaleDateString('en-GB')
const formatCurrency = (val: string) => 'Rp ' + parseFloat(val).toLocaleString('id-ID')
const showDialog = (data: EventBooked) => {
    ebDialog.value = { ...data }
    eventBookedStateDialog.value = true
}
const hideDialog = () => (eventBookedStateDialog.value = false)
onBeforeMount(async() => {
    const res = await useFetchDataStore().fetchPage(useRoute().path, {})
    loadingDT.value = false
    if(!res || res.status === 'error') return
    local.fetchData = res.data
})
const exportCSV = () => dt.value.exportCSV()
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
            <Column header="#" style="width: 4rem; text-align: center">
                <template #body="{ index }">
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
            <Column field="eventid" header="Event ID" sortable style="min-width: 8rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Event ID" />
                </template>
            </Column>
            <Column field="registrationdate" header="Date" sortable dataType="date" style="min-width: 10rem">
                <template #body="{ data }">{{ formatDate(data.registrationdate) }}</template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="Select date" />
                </template>
            </Column>
            <Column field="paymentamount" header="Payment" sortable dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">{{ formatCurrency(data.paymentamount) }}</template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="IDR" locale="id-ID" />
                </template>
            </Column>
            <Column field="registrationstatus" header="Status" sortable style="min-width: 10rem">
                <template #body="{ data }">
                    <Tag :value="data.registrationstatus === 'O' ? 'Open' : data.registrationstatus" :severity="data.registrationstatus === 'O' ? 'success' : 'warn'" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Any" showClear />
                </template>
            </Column>
            <Column field="paymenttype" header="Payment Type" sortable style="min-width: 10rem">
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="paymentTypeOptions" optionLabel="label" optionValue="value" placeholder="Any" showClear />
                </template>
            </Column>
            <Column header="Action" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" outlined rounded @click="showDialog(data)" />
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="eventBookedStateDialog" :style="{ width: '480px' }" header="Booking Details" modal>
            <div v-if="ebDialog" class="flex flex-col gap-3">
                <div v-for="(value, key) in ebDialog" :key="key" class="flex flex-col">
                    <label class="font-semibold capitalize">{{ key }}</label>
                    <InputText v-model="ebDialog[key]" disabled />
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" text @click="hideDialog" />
            </template>
        </Dialog>
    </main>
</template>