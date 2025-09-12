<script setup lang="ts">
import { ref, reactive, onBeforeMount, markRaw, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Autoplay from "embla-carousel-autoplay"
import { useConfig } from '@/composables/useConfig'
import { useFetchDataStore } from '@/stores/FetchData'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots, type CarouselApi, } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import HeaderComponent from '@/components/HeaderHome.vue'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import FooterComponent from '@/components/Footer.vue'
import I_VLeft from '@/assets/icons/hero_home/vector-left.svg?component'
import I_VRight from '@/assets/icons/hero_home/vector-right.svg?component'
import I_music from '@/assets/icons/hero_home/music_note.svg?component'
import I_conferences from '@/assets/icons/hero_home/conferences.svg?component'
import I_celebration from '@/assets/icons/hero_home/celebration.svg?component'
import I_games from '@/assets/icons/hero_home/games.svg?component'
import I_free from '@/assets/icons/card_events/free-tag.svg?component'
import I_DRight from '@/assets/icons/card_events/double-right.svg?component'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import I_FullStar from '@/assets/icons/reviews/full-star.svg?component'
import I_HalfStar from '@/assets/icons/reviews/half-star.svg?component'
import I_EmptyStar from '@/assets/icons/reviews/empty-star.svg?component'
import defaultBoy from '@/assets/images/default_boy.jpg'
import defaultGirl from '@/assets/images/default_girl.png'
const publicConfig = useConfig()
const fetchDataS = useFetchDataStore()
const emblaMainApi = ref<CarouselApi>()
const totalItemsCar = ref(0)
const selectedIndex = ref(0)
let autoplayTimer: ReturnType<typeof setTimeout> | null = null
const local = ref({
    upcoming_events: null as any,
    past_events: null as any,
    reviews: null as any,
})
onBeforeMount(async() =>{
    const tableData = JSON.stringify({
        "userid": "demo@demo.com",
        "groupid": "XCYTUA",
        "businessid": "PJLBBS",
        "sql": "SELECT id, keybusinessgroup, keyregistered, eventgroup, eventid, eventname, eventdescription, startdate, enddate, quota, price, inclusion, imageicon_1, imageicon_2, imageicon_3, imageicon_4, imageicon_5, imageicon_6, imageicon_7, imageicon_8, imageicon_9 FROM event_schedule",
        "order": ""
    })
    const res = await fetchDataS.fetchPage(useRoute().path, {}, tableData)
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.value.upcoming_events = res.data.upcoming_events
    local.value.past_events = res.data.past_events
    local.value.reviews = res.data.reviews
})
const onInitApiCar = (api?: CarouselApi) => {
    if(!api) return
    emblaMainApi.value = api
    totalItemsCar.value = api.slideNodes().length
    selectedIndex.value = api.selectedScrollSnap()
    api.on('select', () => {
        selectedIndex.value = api.selectedScrollSnap()
    })
}
const goToSlide = (index: number) => {
    if(emblaMainApi.value){
        selectedIndex.value = index
        emblaMainApi.value.scrollTo(index)
    }
}
const autoplayPlugin = Autoplay({
    delay: 2500,
    stopOnMouseEnter: true,
    stopOnInteraction: false,
})
const restartAutoplay = () => {
    if(autoplayTimer) clearTimeout(autoplayTimer)
    autoplayTimer = setTimeout(() => {
        autoplayPlugin.reset()
        autoplayPlugin.play()
    }, 150)
}

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
const skeletonUpcoming = (index: string) => {
    return {
        render: (componentVar: any, inpData: any) => {
            return h('div', { class: 'skeleton-wrapper absolute top-0 left-0 flex flex-col space-y-2' }, {
                default: () => {
                    return [
                        componentVar[`cardUpcoming${index}`]?.isErrorPhoto && !inpData.value.imgError
                            ? h(Skeleton, { class: 'h-12 w-12 rounded-full' })
                            : null,
                        // main skeleton items
                        h('div', { class: 'space-y-2' }, { default: () => {
                            return [
                                h(Skeleton, { class: 'h-4 w-[250px]' }),
                                h(Skeleton, { class: 'h-4 w-[200px]' }),
                                h(Skeleton, { class: 'h-4 w-[150px]' }),
                            ]
                        }}
                        )
                    ]}
                }
            )
        }
    }
}
const cardUpcoming = (index: string) => {
    return {
        name: 'cardUpcoming' + index,
        render: (componentVar: any, inpData: any) => {
            return h(RouterLink, { to: inpData.event_id }, {
                default: () => {
                    return h(Card, { class: 'h-full' }, {
                        default: () => h(CardContent, { class: 'relative rounded-xl' }, {
                            default: () => {
                                return [
                                    h('div', { class: 'relative' }, [
                                        h('img', {
                                            src: inpData.img,
                                            alt: '',
                                            class: ['w-full h-full object-contain', inpData.img === '' ? 'hidden' : ''],
                                            onLoad: () => {componentVar[`cardUpcoming${index}`].isErrorPhoto = false},
                                            onError: () => {componentVar[`cardUpcoming${index}`].isErrorPhoto = true},
                                        }),
                                        inpData.isFree ? h(I_free, { class: 'absolute top-0 right-0' }) : null
                                    ]),
                                    h('div', { class: 'w-[90%] mx-auto flex flex-col' }, [
                                        h('div', { class: 'flex gap-5' }, [
                                            h('div', { class: 'flex flex-col' }, [
                                                h('span', { class: 'text-[#3D37F1] font-bold' }, ['May']),
                                                h('span', { class: 'text-black' }, ['11'])
                                            ]),
                                            h('div', { class: 'flex flex-col text-xl text-black' }, [
                                                h('span', { class: '' }, ['Civil Padura']),
                                                h('span', { class: '' }, ['By Civil Engineering Department'])
                                            ]),
                                        ]),
                                        h('div', { class: 'flex flex-col text-xl' }, [
                                            h('div', { class: 'flex gap-2 items-center' }, [
                                                h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                                h('span', null, ['Musical Event']),
                                            ]),
                                            h('div', { class: 'flex gap-2 items-center' }, [
                                                h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                                h('span', null, ['All Universities students can join']),
                                            ]),
                                        ]),
                                        h('div', { class: 'flex justify-between items-center mt-3' }, [
                                            h(I_Location, { class: 'w-8 h-8 text-red-500' }),
                                            h('span', { class: 'text-xl font-medium' }, ['University of Morotuwa']),
                                            h(I_Bookmark, { class: 'w-8 h-8 text-blue-500' }),
                                        ]),
                                    ]),
                                ]
                            }
                        })
                    })
                }
            })
        }
    }
}
const componentUIUpcoming = {
    skeleton: skeletonUpcoming,
    card: cardUpcoming,
}



const skeletonPast = (index: string) => {
    return {
        render: (componentVar: any, inpData: any) => {
            return h('div', { class: 'skeleton-wrapper absolute top-0 left-0 flex flex-col space-y-2' }, {
                default: () => {
                    return [
                        componentVar[`cardPast${index}`]?.isErrorPhoto && !inpData.value.imgError
                            ? h(Skeleton, { class: 'h-12 w-12 rounded-full' })
                            : null,
                        // main skeleton items
                        h('div', { class: 'space-y-2' }, { default: () => {
                            return [
                                h(Skeleton, { class: 'h-4 w-[250px]' }),
                                h(Skeleton, { class: 'h-4 w-[200px]' }),
                                h(Skeleton, { class: 'h-4 w-[150px]' }),
                            ]
                        }}
                        )
                    ]}
                }
            )
        }
    }
}
const cardPast = (index: string) => {
    return {
        name: 'cardPast' + index,
        render: (componentVar: any, inpData: any) => {
            return h(RouterLink, { to: inpData.event_id }, {
                default: () => {
                    return h(Card, { class: 'h-full' }, {
                        default: () => h(CardContent, { class: 'relative rounded-xl' }, {
                            default: () => {
                                return [
                                    h('div', { class: 'relative' }, [
                                        h('img', {
                                            src: inpData.img,
                                            alt: '',
                                            class: ['w-full h-full object-contain', inpData.img === '' ? 'hidden' : ''],
                                            onLoad: () => {componentVar[`cardPast${index}`].isErrorPhoto = false},
                                            onError: () => {componentVar[`cardPast${index}`].isErrorPhoto = true},
                                        }),
                                        inpData.isFree ? h(I_free, { class: 'absolute top-0 right-0' }) : null
                                    ]),
                                    h('div', { class: 'w-[90%] mx-auto flex flex-col' }, [
                                        h('div', { class: 'flex gap-5' }, [
                                            h('div', { class: 'flex flex-col' }, [
                                                h('span', { class: 'text-[#3D37F1] font-bold' }, ['May']),
                                                h('span', { class: 'text-black' }, ['11'])
                                            ]),
                                            h('div', { class: 'flex flex-col text-xl text-black' }, [
                                                h('span', { class: '' }, ['Civil Padura']),
                                                h('span', { class: '' }, ['By Civil Engineering Department'])
                                            ]),
                                        ]),
                                        h('div', { class: 'flex flex-col text-xl' }, [
                                            h('div', { class: 'flex gap-2 items-center' }, [
                                                h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                                h('span', null, ['Musical Event']),
                                            ]),
                                            h('div', { class: 'flex gap-2 items-center' }, [
                                                h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                                h('span', null, ['All Universities students can join']),
                                            ]),
                                        ]),
                                        h('div', { class: 'flex justify-between items-center mt-3' }, [
                                            h(I_Location, { class: 'w-8 h-8 text-red-500' }),
                                            h('span', { class: 'text-xl font-medium' }, ['University of Morotuwa']),
                                            h(I_Bookmark, { class: 'w-8 h-8 text-blue-500' }),
                                        ]),
                                    ]),
                                ]
                            }
                        })
                    })
                }
            })
        }
    }
}
const componentUIPast = {
    skeleton: skeletonPast,
    card: cardPast,
}



const skeletonReviews = (index: string) => {
    return {
        render: (componentVar: any, inpData: any) => {
            return h('div', { class: 'skeleton-wrapper absolute top-0 left-0 flex flex-col space-y-2' }, {
                default: () => {
                    return [
                        componentVar[`cardReviews${index}`]?.isErrorPhoto && !inpData.value.imgError
                            ? h(Skeleton, { class: 'h-12 w-12 rounded-full' })
                            : null,
                        // main skeleton items
                        h('div', { class: 'space-y-2' }, { default: () => {
                            return [
                                h(Skeleton, { class: 'h-4 w-[250px]' }),
                                h(Skeleton, { class: 'h-4 w-[200px]' }),
                                h(Skeleton, { class: 'h-4 w-[150px]' }),
                            ]
                        }}
                        )
                    ]}
                }
            )
        }
    }
}
const cardReviews = (index: string) => {
    return {
        name: 'cardReviews' + index,
        render: (componentVar: any, inpData: any) => {
            return h(Card, { class: 'h-full' }, {
                default: () => h(CardContent, { class: 'relative rounded-xl flex flex-col gap-2' }, {
                    default: () => {
                        return [
                            h('div', { class: 'flex gap-2' }, [
                                h('div', { class: 'relative right-0 w-15 h-15 rounded-full pointer-events-none' }, [
                                    h('img', {
                                        ref: "imageRefs",
                                        src: publicConfig.baseURL + inpData.photo || [defaultBoy, defaultGirl][Math.floor(Math.random() * 2)],
                                        alt: '',
                                        class: ['absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full object-cover'],
                                        style: ['clip-path: circle();'],
                                        onLoad: () => {componentVar[`cardReviews${index}`].isLoadingImg = false},
                                        onError: () => {componentVar[`cardReviews${index}`].isLoadingImg = true},
                                    }),
                                ]),
                                h('div', { class: '' }, [
                                    h('div', { class: 'flex' }, [
                                        (() => {
                                            const stars = []
                                            const full = Math.floor(inpData.rating)
                                            const half = inpData.rating % 1 >= 0.5
                                            const empty = 5 - full - (half ? 1 : 0)
                                            for(let i = 0; i < full; i++) stars.push(h(I_FullStar, { class: 'w-5 h-5 text-yellow-500' }))
                                            for(let i = 0; i < empty; i++) stars.push(h(I_EmptyStar, { class: 'w-5 h-5 text-yellow-500' }))
                                            if(half) stars.push(h(I_HalfStar, { class: 'w-6 h-6 text-yellow-500'}))
                                            return stars
                                        })()
                                    ]),
                                    h('h5', { class: '' }, ['Taylor Swifft']),
                                    h('span', { class: '' }, ['20 Agustus 2025']),
                                ])
                            ]),
                            h('p', { class: '' }, ['Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.'])
                        ]
                    }
                })
            })
        }
    }
}
const componentUIReviews = {
    skeleton: skeletonReviews,
    card: cardReviews,
}
</script>
<template>
    <HeaderComponent/>
    <section class="relative h-screen pt-16 bg-blue-600">
        <div class="absolute inset-0">
            <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-b from-pink-500/80 to-indigo-600/90"></div>
        </div>
        <div class="bg"></div>
        <div class="relative z-10 flex flex-col justify-center gap-24 items-center h-full text-white">
            <div class="w-[92%] h-1/2">
                <div class="relative left-1/2 -translate-x-1/2 rounded-xl h-full">
                    <Carousel class="relative z-0 inset-0 rounded-xl overflow- w-full h-full bg-red-500" @init-api="onInitApiCar" :plugins="[autoplayPlugin]" @mouseenter="autoplayPlugin.stop" @mouseleave="restartAutoplay">
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
                        <div class="absolute w-full h-full top-0 left-0 flex justify-around">
                            <div class="bg absolute w-full h-full"></div>
                            <div class="self-center w-[47%] h-1/2 relative group">
                                <CarouselPrevious :class="'left-0 bg-transparent border-transparent text-white/0 hover:bg-transparent hover:text-red-500 group-hover:text-red-500 group-hover:disabled:text-red-500/0 w-fit h-fit'" :cus-icon="I_VLeft" :cusIconClass="'!w-7 !h-7'"/>
                                <div class="w-[87%] h-full relative left-1/2 -translate-x-1/2 px-4">
                                    <h3 class="text-3xl">Mavisuru Ragasoba</h3>
                                    <span>University morawa</span>
                                    <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                                    <RouterLink to="/" class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 text-lg text-white border-2 border-white">Learn More</RouterLink>
                                </div>
                                <CarouselNext :class="'right-0 bg-transparent border-transparent text-white/0 hover:bg-transparent hover:text-red-500 group-hover:text-red-500 group-hover:disabled:text-red-500/0 w-fit h-fit'" :cusIcon="I_VRight" :cusIconClass="'!w-7 !h-7'"/>
                            </div>
                            <div class="self-center w-[35%] h-1/2 relative">
                                <h3 class="text-3xl">UNI EVENTS</h3>
                                <p class="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                                <RouterLink to="/about" class="w-35 h-10 rounded-lg absolute bottom-[10%] inline-flex justify-center items-center font-bold mt-5 bg-red-500 text-lg text-white">About US</RouterLink>
                            </div>
                            <CarouselDots v-model:currentIndex="selectedIndex" :totalItems="totalItemsCar" @goToSlide="goToSlide"/>
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
    <section class="relative min-h-screen flex flex-col">
        <div class="w-[95%] mx-auto h-fit">
            <h2 class="text-4xl mt-5">Upcoming Events</h2>
            <CustomCardWithSkeletonComponent :componentUI="componentUIUpcoming" :inpData="local.upcoming_events" customTW="h-full mt-5" customCSS="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem;"/>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 mt-10 inline-block text-[#3D37F1] border border-[#3D37F1] px-4 py-2 rounded-2xl hover:bg-[#3D37F1] hover:text-white">See All Events</RouterLink>
        </div>
        <div class="sm:h-55 xl:h-65 mt-50 bg-purple-500">
            <div class="w-[90%] h-full relative left-1/2 -translate-x-1/2 flex justify-between items-end overflow-y-visible">
                <img src="@/assets/images/image-3.png" alt="" class="h-100 self-end">
                <div class="w-fit h-[92%] flex flex-col items-center text-white">
                    <h2 class="text-2xl">Add Your Loving Event</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <RouterLink to="/" class="relative bottom-[20%] mt-auto px-4 py-2 rounded-md" style="background-color:#F5167E">View all events</RouterLink>
                </div>
            </div>
        </div>
    </section>
    <section class="relative min-h-screen">
        <div class="w-[95%] mx-auto h-fit">
            <h2 class="text-4xl mt-5">Past Events</h2>
            <CustomCardWithSkeletonComponent :componentUI="componentUIPast" :inpData="local.past_events" customTW="h-full mt-5" customCSS="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem;"/>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 mt-10 inline-block text-[#3D37F1] border border-[#3D37F1] px-4 py-2 rounded-2xl hover:bg-[#3D37F1] hover:text-white">Load More</RouterLink>
        </div>
    </section>
    <section class="relative min-h-screen">
        <div class="w-[95%] mx-auto h-fit">
            <h2 class="w-fit mx-auto text-4xl text-[#242565]">Reviews About Us</h2>
            <p class="w-fit mx-auto text-xl text-[#242565]">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <CustomCardWithSkeletonComponent :componentUI="componentUIReviews" :inpData="local.reviews" customTW="h-full mt-5" customCSS="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem;"/>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 mt-10 inline-block text-[#3D37F1] border border-[#3D37F1] px-4 py-2 rounded-2xl hover:bg-[#3D37F1] hover:text-white">Load More</RouterLink>
        </div>
    </section>
    <FooterComponent/>
</template>
<style scoped>
</style>