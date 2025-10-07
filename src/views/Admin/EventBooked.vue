<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchDataStore } from '@/stores/FetchData';
interface eventBooked {
    booked_id: string,
    name_person: string,
    event_id: string,
    booked_id: string,
    booked_id: string,
}
const local = reactive({
    fetchData: null,
})
const filters = ref<any>(null);
const dt = ref();
const loadingDT = ref(null);
const ebDialog = ref({});
const eventBookedStateDialog = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const initFiltersDT = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    };
}
const showDialog = (item) => {
    ebDialog.value = { ...item };
    eventBookedStateDialog.value = true;
}
function hideDialog() {
    eventBookedStateDialog.value = false;
    submitted.value = false;
}
onBeforeMount(() => {
    ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    CustomerService.getCustomersLarge().then((data) => {
        customers1.value = data;
        loadingDT.value = false;
        customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    initFiltersDT();
});
const exportCSV = () => {
    dt.value.exportCSV();
}
// onBeforeMount(async() => {
//     const res = await useFetchDataStore().fetchPage(useRoute().path, {})
//     if(res ==  undefined || res.status == 'error'){
//         return
//     }
//     console.log('enttokk dataa ', res.data)
//     local.fetchData = res.data
// })
</script>
<template>
    <main class="card">
        <Toolbar class="mb-6">
            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
            </template>
        </Toolbar>
        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable ref="dt" :value="local.fetchData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filters" filterDisplay="menu" :loading="loadingDT" :filters="filters" :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']" showGridlines>
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()"/>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No event booked found. </template>
            <template #loading> Loading event booked data. Please wait. </template>
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">{{ data.name }}</template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name"/>
                </template>
            </Column>
            <Column header="Country" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px"/>
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
            </Column>
            <!-- <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">{{ formatDate(data.date) }}</template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column> -->
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="showDialog(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </main>
    <Dialog v-model:visible="eventBookedStateDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
        <div class="flex flex-col gap-6">
            <img v-if="ebDialog.image" :src="`https://primefaces.org/cdn/primevue/images/ebDialog/${ebDialog.image}`" :alt="ebDialog.image" class="block m-auto pb-4" />
            <div>
                <label for="name" class="block font-bold mb-3">Name</label>
                <InputText id="name" v-model.trim="ebDialog.name" :disabled="true" />
            </div>
        </div>

        <template #footer>
            <Button label="Close" icon="pi pi-times" text @click="hideDialog" />
        </template>
    </Dialog>
</template>