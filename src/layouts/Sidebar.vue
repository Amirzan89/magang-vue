<script setup lang="ts">
import { useLayout } from './composables/layout'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToast } from 'primevue/usetoast'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const fetchDataS = useFetchDataStore()
const toast = useToast()
const { layoutState, setActiveMenuItem, toggleMenu } = useLayout()
const isActiveMenu = ref(false)
const itemKey = ref<any>([])
const model = ref<{label: string, icon: string, to: string, key: string, visible?: boolean}[]>([
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', key: 'DashboardPage', to: '/dashboard' },
    { label: 'Kelola Event', icon: 'pi pi-fw pi-home', key: 'EventKelolaPage', to: '/kelola-event' },
    { label: 'Event Booked', icon: 'pi pi-fw pi-home', key: 'EventBookedPage', to: '/event-booked' },
])
onBeforeMount(() => {
    model.value.forEach((element) => {
        itemKey.value.push(element.key)
        const activeItem: string | null = layoutState.activeMenuItem
        isActiveMenu.value = (activeItem === itemKey.value) || activeItem ? activeItem!.startsWith(itemKey.value + '-') : false
    });
})
watch(() => layoutState.activeMenuItem, (newVal: any) => {
    model.value.forEach((element, index) => {
        isActiveMenu.value = newVal === itemKey.value[index] || newVal.startsWith(itemKey.value[index] + '-')
    });
})
const itemClick = (event: Event, item: any, index: number) => {
    if(item.disabled){
        event.preventDefault()
        return
    }
    if((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)){
        toggleMenu()
    }
    if(item.command){
        item.command({ originalEvent: event, item: item })
    }
    setActiveMenuItem(itemKey.value[index])
}
const checkActiveRoute = (item: any) => {
    return route.path === item.to
}
const logoutForm = async() => {
    const res = await reqData({
        url: '/api/admin/logout',
        method: 'POST',
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Logout', detail: res.message, life: 3000 })
        return
    }
    fetchDataS.logout()
    toast.add({ severity: 'success', summary: 'Berhasil Logout', detail: res.message, life: 3000 })
    setTimeout(async() => {
        await router.push('/login')
    }, 3000)
}
</script>
<template>
    <div class="layout-sidebar !pb-5 flex flex-col justify-between">
        <ul class="layout-menu">
            <ul class="layout-submenu">
                <template v-for="(item, i) in model" :key="item">
                    <li :class="{ 'active-menuitem': isActiveMenu }">
                        <router-link v-if="item.to && item.visible !== false" @click="itemClick($event, item, i)" :class="[{ 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
                            <i :class="item.icon" class="layout-menuitem-icon"></i>
                            <span class="layout-menuitem-text">{{ item.label }}</span>
                        </router-link>
                    </li>
                </template>
            </ul>
        </ul>
        <Button variant="outlined" class="px-2.5 flex !justify-start !items-center !gap-1.5 !border-none cursor-pointer" @click="logoutForm">
            <i class="pi pi-fw pi-home !text-[18px]"></i>
            <span class="text-base">Logout</span>
        </Button>
    </div>
</template>