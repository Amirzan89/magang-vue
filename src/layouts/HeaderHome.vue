<script setup lang="ts">
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { eventBus } from '@/eventBus'
gsap.registerPlugin(ScrollTrigger)
const navOpen = ref(false)
const route = useRoute()
const routeItems = reactive([
    {
        'label': 'Events',
        'link': '/events',
    },
    {
        'label': 'About',
        'link': '/about',
    },
    {
        'label': 'Blog',
        'link': '/blog',
    },
    {
        'label': 'Contact',
        'link': '/contact',
    },
])
const headerRef = ref<HTMLElement | null>(null)
const bgLayer = ref(null)
const hBg = ['/events', '/search', '/about', '/privacy-policy']
const hBgPrefix = ['/event', '/booking']
const dBg = ['/']
const headerBg = computed(() => {
    return hBg.includes(route.path) || hBgPrefix.some(prefix => route.path.startsWith(prefix))
})
const waitForEvent = (eventName: string): Promise<void> => {
    return new Promise(resolve => {
        const handler = () => {
            eventBus.off(eventName, handler)
            resolve()
        }
        eventBus.on(eventName, handler)
    })
}
const handleHeaderAnim = async() => {
    if(headerBg.value) return
    if(dBg.includes(route.path)){
        await waitForEvent('tHeader')
    }
    gsap.fromTo(bgLayer.value,{ opacity: 0, y: -50 }, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: 'section:first-of-type',
            start: "bottom-=40 top+=80",
            end: "bottom+=40 top+=80",
            scrub: true,
        },
        stagger: {
            from: 'start',
            each: 0.1,
        }
    })
}
onMounted(async() => {
    if(!headerBg.value) gsap.set(bgLayer.value, { opacity: 0, y: -50 })
    handleHeaderAnim()
})
watch(() => route.path, () => {
    gsap.killTweensOf(bgLayer.value)
    if(headerBg.value){
        gsap.set(bgLayer.value, { clearProps: "all" })
    }else{
        gsap.set(bgLayer.value, { opacity: 0, y: -50 })
    }
    handleHeaderAnim()
})
</script>
<template>
    <header ref="headerRef" :class="['w-full z-20 top-0 start-0', headerBg ? 'sticky' : 'fixed']">
        <div ref="bgLayer" class="absolute top-0 left-0 w-full h-full -z-1">
            <img src="@/assets/images/header.png" alt="" class="w-full h-full object-cover" />
            <div class="absolute top-0 left-0 w-full h-full opacity-90 bg-red-500" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"></div>
        </div>
        <div class="w-[90%] xl:w-[95%] 2xl:w-[97%] h-full flex flex-wrap items-center justify-between mx-auto">
            <RouterLink to="/" class="">
                <img src="@/assets/icons/logowhite.png" alt="Uni Events Logo" class="w-auto" style="height: calc(var(--paddTop) - 15px);"/>
            </RouterLink>
            <div class="items-center justify-between gap-5 w-full md:flex md:w-auto md:order-1" :class="navOpen ? 'block' : 'hidden'">
                <div class="flex flex-col p-4 mt-4 font-medium gap-5 md:flex-row md:mt-0">
                    <RouterLink v-for="(item, index) in routeItems" :key="index" :to=item.link class="block xl:text-lg text-white">{{ item.label }}</RouterLink>
                </div>
                <Button :as="RouterLink" to="/lgin/" severity="secondary" variant="outlined" class="!text-white hover:!text-black" :pt="{ label: { class: ['font-semibold ']}}">Login</Button>
            </div>
        </div>
    </header>
</template>
<style scoped lang="scss">
header{
    z-index: z-50;
    height: var(--paddTop);
    scroll-padding-top: var(--paddTop);
}
</style>