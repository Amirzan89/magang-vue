<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import HeaderComponent from '@/components/HeaderHome.vue'
import FooterComponent from '@/components/Footer.vue'
import Button from '@/components/ui/button/Button.vue'
import heroImg from '@/assets/images/party-1.png'
import rectImg from '@/assets/images/Rectangle-3859.png'
import img3 from '@/assets/images/image-3.png'
import cele3 from '@/assets/images/cele-3.png'
// CAROUSEL
const slides = [heroImg, heroImg, heroImg, heroImg] // taruh path berbeda kalau ada
const activeSlide = ref(0)
const nextSlide = () => (activeSlide.value = (activeSlide.value + 1) % slides.length)
const prevSlide = () => (activeSlide.value = (activeSlide.value - 1 + slides.length) % slides.length)
const go = (i: number) => (activeSlide.value = i)

// // AUTO-PLAY (opsional)
// let timer: number | undefined
// onMounted(() => {
//     timer = window.setInterval(nextSlide, 5000)
// })

// FILTERS & CARDS (pengganti Alpine x-data/x-init)
type Item = { id: number; eventname: string; startdate: string; price: number; imageicon_1: string; type?: string; university?: string }
const loading = ref(true)
const items = ref<Item[]>([])
const filters = ref({ month: '', university: '', eventType: '' })

onMounted(async () => {
    // fetch data dari API Laravel-mu (contoh):
    // const res = await fetch('/api/events')
    // items.value = await res.json()
    // sementara dummy:
    items.value = [
        { id: 1, eventname: 'Music Fest', startdate: '2025-09-20', price: 150000, imageicon_1: heroImg, type: 'music', university: 'US' },
        { id: 2, eventname: 'Tech Conf', startdate: '2025-10-05', price: 0, imageicon_1: rectImg, type: 'conference', university: 'CA' },
        { id: 3, eventname: 'Games Day', startdate: '2025-11-02', price: 75000, imageicon_1: heroImg, type: 'games', university: 'DE' },
    ]
    loading.value = false
})

const filtered = computed(() => {
    return items.value.filter(it => {
        const byUni = !filters.value.university || it.university === filters.value.university
        const byType = !filters.value.eventType || it.type === filters.value.eventType
        const byMonth = !filters.value.month || (it.startdate?.slice(0, 7) === filters.value.month)
        return byUni && byType && byMonth
    })
})

const formatPrice = (n: number) => n === 0 ? 'Free' : n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const buy = (item: Item) => {
    // trigger ke route/checkout
    alert(`Buy ${item.eventname}`)
}
</script>
<template>
    <HeaderComponent/>
    <!-- HERO -->
    <section class="relative h-screen pt-16">
        <!-- <div class="absolute inset-0">
            <img :src="heroImg" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-b from-pink-500/80 to-indigo-600/90"></div>
        </div> -->
        <div class="bg"></div>
        <div class="relative z-10 flex flex-col justify-center gap-24 items-center h-full text-white">
            <div class="w-[87%] h-1/2">
                <div class="relative left-1/2 -translate-x-1/2 rounded-xl h-full">
                    <!-- Carousel -->
                    <div class="absolute z-0 inset-0 rounded-xl overflow-hidden">
                        <img :src="rectImg"
                            class="absolute block w-3/4 xl:w-[87%] h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                            alt="bg rectangle" />
                        <transition name="fade" mode="out-in">
                        <img :key="activeSlide"
                            :src="slides[activeSlide]"
                            class="absolute block w-3/4 xl:w-[87%] h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                            alt="slide" />
                        </transition>
                        <div class="absolute inset-0 bg-gradient-to-b from-pink-500/60 to-indigo-600/80"></div>
                    </div>

                    <!-- Content beside -->
                    <div class="w-[95%] h-3/5 relative z-10 left-1/2 -translate-x-1/2 top-[10%] flex justify-around">
                        <div class="w-2/5 h-4/5 self-center flex justify-between items-center">
                        <button class="size-8 rounded-full bg-white/20 backdrop-blur hover:bg-white/30" @click="prevSlide" aria-label="Prev">‹</button>
                        <div class="flex-1 h-full relative px-4">
                            <h3 class="text-3xl">Mavisuru Ragasoba</h3>
                            <span>University morawa</span>
                            <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                            <RouterLink to="/"
                            class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 text-lg text-white border-2 border-white">
                            Learn More
                            </RouterLink>
                        </div>
                        <button class="size-8 rounded-full bg-white/20 backdrop-blur hover:bg-white/30" @click="nextSlide" aria-label="Next">›</button>
                        </div>

                        <div class="w-2/5 h-4/5 self-center relative">
                        <h3 class="text-3xl">UNI EVENTS</h3>
                        <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                        <RouterLink to="/about" class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 bg-red-500 text-lg text-white">About US</RouterLink>
                        </div>
                    </div>

                    <!-- Dots -->
                    <ul class="absolute left-1/2 -translate-x-1/2 bottom-5 flex gap-3">
                        <li v-for="(s, i) in slides" :key="i"
                            class="w-3 h-3 rounded-full cursor-pointer"
                            :class="i===activeSlide ? 'bg-white' : 'bg-white/50'"
                            @click="go(i)"></li>
                    </ul>

                <!-- Filters bar -->
                </div>
            </div>

            <!-- ICONS ROW -->
            <ul class="w-3/4 xl:w-[87%] flex justify-around text-white">
                <li class="flex flex-col items-center gap-1">
                <div class="bg-white inline-flex justify-center items-center size-16 rounded-full">
                    <!-- svg inline kalau mau -->
                </div>
                <span class="block text-center">Music event</span>
                </li>
                <li class="flex flex-col items-center gap-1">
                <div class="bg-white inline-flex justify-center items-center size-16 rounded-full"></div>
                <span class="block text-center">Conferences</span>
                </li>
                <li class="flex flex-col items-center gap-1">
                <div class="bg-white inline-flex justify-center items-center size-16 rounded-full"></div>
                <span class="block text-center">Annual Celebrations</span>
                </li>
                <li class="flex flex-col items-center gap-1">
                <div class="bg-white inline-flex justify-center items-center size-16 rounded-full"></div>
                <span class="block text-center">Games</span>
                </li>
            </ul>
        </div>
    </section>

    <!-- CARDS / UPCOMING -->
    <section class="relative min-h-screen h-fit flex flex-col justify-between">
        <div class="relative w-[90%] self-center">
            <div class="sticky top-20 w-full flex flex-row justify-between items-center z-10">
                <div class="bg-white rounded-3xl">
                <h2 class="text-[#242565] xl:text-3xl mt-4 mb-4 ml-6 mr-6">Upcoming Event</h2>
                </div>
                <div class="flex flex-row h-fit gap-5">
                <div class="bg-white rounded-xl px-4 py-2">WeekDays</div>
                <div class="bg-white rounded-xl px-4 py-2">Popular</div>
                <div class="bg-white rounded-xl px-4 py-2">Latest</div>
                </div>
            </div>

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

            <RouterLink to="/events"
                class="relative left-1/2 -translate-x-1/2 mt-10 inline-block text-[#3D37F1] border border-[#3D37F1] px-4 py-2 rounded-2xl hover:bg-[#3D37F1] hover:text-white">
                See All Events
            </RouterLink>
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