<script setup lang="ts">
import { useLayout } from './composables/layout'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { layoutState, setActiveMenuItem, toggleMenu } = useLayout()
const isActiveMenu = ref(false)
const itemKey = ref<any>([])
const model = ref<{label: string, icon: string, to: string, key: string, visible?: boolean}[]>([
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', key: 'DashboardPage', to: '/dashboard' },
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
</script>
<template>
    <div class="layout-sidebar">
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
    </div>
</template>