<script setup lang="ts">
import { ref, reactive, computed, onMounted, markRaw } from 'vue'
import { RouterLink } from 'vue-router'
import { watchOnce } from "@vueuse/core"
import HeaderComponent from '@/components/HeaderHome.vue'
import FooterComponent from '@/components/Footer.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi, } from '@/components/ui/carousel'
import I_VLeft from '@/assets/icons/hero_home/vector-left.svg?component'
import I_VRight from '@/assets/icons/hero_home/vector-right.svg?component'
import I_music from '@/assets/icons/hero_home/music_note.svg?component'
import I_conferences from '@/assets/icons/hero_home/conferences.svg?component'
import I_celebration from '@/assets/icons/hero_home/celebration.svg?component'
import I_games from '@/assets/icons/hero_home/games.svg?component'
import heroImg from '@/assets/images/party-1.png'
import rectImg from '@/assets/images/Rectangle-3859.png'
import img3 from '@/assets/images/image-3.png'
import cele3 from '@/assets/images/cele-3.png'
// CAROUSEL
const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)
const onSelect = () => {
    if (!emblaMainApi.value || !emblaThumbnailApi.value) return
    selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
    emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}
const onThumbClick = (index: number) => {
    if (!emblaMainApi.value || !emblaThumbnailApi.value) return
    emblaMainApi.value.scrollTo(index)
}
watchOnce(emblaMainApi, (emblaMainApi) => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on("select", onSelect)
    emblaMainApi.on("reInit", onSelect)
})
const catHero = reactive([
    {
        'name': 'Music Events',
        'icon': markRaw(I_music),
    },
    {
        'name': 'Conferences',
        'icon': markRaw(I_conferences),
    },
    {
        'name': 'Celebration',
        'icon': markRaw(I_celebration),
    },
    {
        'name': 'Games',
        'icon': markRaw(I_games),
    },
])
// // AUTO-PLAY (opsional)
// let timer: number | undefined
// onMounted(() => {
//     timer = window.setInterval(nextSlide, 5000)
// })

// onMounted(async () => {
//     // fetch data dari API Laravel-mu (contoh):
//     // const res = await fetch('/api/events')
//     // items.value = await res.json()
//     // sementara dummy:
//     items.value = [
//         { id: 1, eventname: 'Music Fest', startdate: '2025-09-20', price: 150000, imageicon_1: heroImg, type: 'music', university: 'US' },
//         { id: 2, eventname: 'Tech Conf', startdate: '2025-10-05', price: 0, imageicon_1: rectImg, type: 'conference', university: 'CA' },
//         { id: 3, eventname: 'Games Day', startdate: '2025-11-02', price: 75000, imageicon_1: heroImg, type: 'games', university: 'DE' },
//     ]
//     loading.value = false
// })

</script>
<template>
    <HeaderComponent/>
    <section class="relative h-screen pt-16 bg-blue-600">
        <!-- <div class="absolute inset-0">
            <img :src="heroImg" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-b from-pink-500/80 to-indigo-600/90"></div>
        </div> -->
        <div class="bg"></div>
        <div class="relative z-10 flex flex-col justify-center gap-24 items-center h-full text-white">
            <div class="w-[92%] h-1/2">
                <div class="relative left-1/2 -translate-x-1/2 rounded-xl h-full">
                    <Carousel class="relative z-0 inset-0 rounded-xl overflow- w-full h-full bg-red-500" @init-api="(val) => emblaMainApi = val">
                        <CarouselContent :customTW="'h-full'">
                            <CarouselItem v-for="(_, index) in 10" :key="index">
                                <div class="p-1 h-full">
                                    <Card :customTW="'h-full'">
                                        <CardContent class="flex aspect-square items-center justify-center p-6 h-full">
                                            <span class="text-4xl font-semibold">{{ index + 1 }}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <div class="absolute w-full h-full top-0 left-0  flex justify-around">
                            <div class="bg absolute w-full h-full"></div>
                            <div class="self-center w-[47%] h-1/2 relative group">
                                <CarouselPrevious :class="'left-0 bg-transparent border-transparent text-white/0 hover:bg-transparent hover:text-red-500 group-hover:text-red-500 group-hover:disabled:text-red-500/0 w-fit h-fit'" :cus-icon="I_VLeft" :cusIconClass="'!w-7 !h-7'"/>
                                <div class="w-[87%] h-full relative left-1/2 -translate-x-1/2 px-4">
                                    <h3 class="text-3xl">Mavisuru Ragasoba</h3>
                                    <span>University morawa</span>
                                    <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                                    <RouterLink to="/"
                                    class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 text-lg text-white border-2 border-white">
                                    Learn More
                                    </RouterLink>
                                </div>
                                <CarouselNext :class="'right-0 bg-transparent border-transparent text-white/0 hover:bg-transparent hover:text-red-500 group-hover:text-red-500 group-hover:disabled:text-red-500/0 w-fit h-fit'" :cusIcon="I_VRight" :cusIconClass="'!w-7 !h-7'"/>
                            </div>
                            <div class="self-center w-[35%] h-1/2 relative">
                                <h3 class="text-3xl">UNI EVENTS</h3>
                                <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                                <RouterLink to="/about" class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 bg-red-500 text-lg text-white">About US</RouterLink>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>
            <ul class="w-3/4 xl:w-[87%] flex justify-around text-white">
                <template v-for="(item, index) in catHero" :key="index">
                    <li class="flex flex-col items-center gap-1">
                        <div class="bg-white inline-flex justify-center items-center rounded-full w-fit">
                            <component :is="item.icon" class="size-10 m-5"></component>
                        </div>
                        <span class="block text-center">{{ item.name }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </section>
    <!-- CARDS / UPCOMING -->
    <section class="relative min-h-screen h-fit flex flex-col justify-between">
        <div class="relative w-[90%] self-center">
            <h1 class="font-bold text-3xl">Upcoming Events</h1>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <!-- Skeleton -->
                <template v-if="loading && items.length === 0">
                <li v-for="i in 6" :key="i" class="card bg-base-100 shadow-sm animate-pulse rounded-2xl">
                    <div class="h-48 bg-base-200 rounded-t-2xl"></div>
                    <div class="p-4 space-y-2">
                    <div class="h-5 bg-base-200 rounded w-2/3"></div>
                    <div class="h-4 bg-base-200 rounded w-full mt-2"></div>
                    <div class="h-10 bg-base-200 rounded mt-4"></div>
                    </div>
                </li>
                </template>

                <!-- Real items -->
                <li v-for="item in filtered" :key="String(item.id)" class="card bg-white shadow-sm rounded-2xl overflow-hidden">
                <figure class="h-48">
                    <img :src="item.imageicon_1" :alt="item.eventname" class="w-full h-full object-cover" loading="lazy" />
                </figure>
                <div class="p-4">
                    <h2 class="font-semibold text-lg">{{ item.eventname }}</h2>
                    <p class="text-sm text-gray-600">{{ item.startdate }}</p>
                    <div class="mt-4 flex justify-between items-center">
                    <span class="font-semibold">{{ formatPrice(item.price) }}</span>
                    <button class="btn btn-primary px-4 py-2 rounded-lg bg-blue-600 text-white" @click="buy(item)">Buy Now</button>
                    </div>
                </div>
                </li>
            </ul>

            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 mt-10 inline-block text-[#3D37F1] border border-[#3D37F1] px-4 py-2 rounded-2xl hover:bg-[#3D37F1] hover:text-white">See All Events</RouterLink>
        </div>

        <div class="sm:h-30 xl:h-40 flex flex-row mt-20 justify-evenly overflow-y-visible">
            <img :src="img3" alt="" class="h-70 self-end" />
            <div class="w-fit h-3/4 relative top-1/2 -translate-y-1/2 flex flex-col items-center text-white">
                <h2>Add Your Loving Event</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                <RouterLink to="/" class="px-4 py-2 rounded-2xl mt-2" style="background-color:#F5167E">View all events</RouterLink>
            </div>
        </div>
    </section>

    <section class="relative min-h-screen h-fit flex flex-col justify-between border-black border-4">
        <div class="absolute top-0 left-0 w-full h-full"></div>
        <img :src="cele3" alt="" class="absolute right-0" />
    </section>
    <FooterComponent/>
</template>
<style scoped>
</style>