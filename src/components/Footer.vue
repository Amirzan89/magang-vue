<script setup lang="ts">
import { reactive, markRaw } from 'vue'
import { useRouter,RouterLink } from 'vue-router'
import { Login } from '@/composables/api/auth'
import { useConfig } from '@/composables/useConfig'
import { useLoadingStore } from '@/stores/Loading'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToastStore } from '@/stores/Toast'
import I_facebook from '@/assets/icons/footer_home/facebook.svg?component'
import I_twitter from '@/assets/icons/footer_home/twitter.svg?component'
import I_linkedln from '@/assets/icons/footer_home/linkedln.svg?component'
const publicConfig = useConfig()
const route = useRouter()
const fetchDataS = useFetchDataStore()
const loading = useLoadingStore()
const toast = useToastStore()
const local = reactive({
    isRequestInProgress: false,
    isUpdated: false,
    isPasswordShow: false,
})
const routeItems = reactive([
    {
        'name': 'Facebook Page',
        'link': 'https://facebook.com',
        'icon': markRaw(I_facebook),
    },
    {
        'name': 'Twitter Page',
        'link': 'https://twitter.com',
        'icon': markRaw(I_twitter),
    },
    {
        'name': 'Linkedln Page',
        'link': 'https://linkedln.com',
        'icon': markRaw(I_linkedln),
    },
])
const planItems = [
    {
        'label': 'Create And Set Up',
        'link': '/create',
    },
    {
        'label': 'Sell Tickets',
        'link': '/sell-tickets',
    },
    {
        'label': 'Online RSVP',
        'link': '/online-rsvp',
    },
    {
        'label': 'Online EVents',
        'link': '/online-events',
    },
]
const EventickItems = reactive([
    {
        'label': 'About Us',
        'link': '/about',
    },
    {
        'label': 'Press',
        'link': '/press',
    },
    {
        'label': 'Contact Us',
        'link': '/contact',
    },
    {
        'label': 'Help Center',
        'link': '/help',
    },
    {
        'label': 'How It Works',
        'link': '/how',
    },
    {
        'label': 'Privacy',
        'link': '/privacy',
    },
    {
        'label': 'Terms',
        'link': '/terms',
    },
])
</script>
<template>
    <footer class="bg-[#0A075F]">
        <div class="mx-auto w-full lg:max-w-[97%] p-4 lg:py-6">
            <div class="lg:flex lg:flex-row lg:justify-between">
                <div class="lg:w-[28%] xl:w-[30%] flex flex-col items-start mb-1 lg:mb-0">
                    <img src="@/assets/images/logowhite.png" class="h-10 sm:h-[30%] md:h-[40%]" alt="UniEvents Logo" />
                    <span class="text-white text-sm xl:text-lg">Eventick is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</span>
                    <div class="flex mt-2 lg:mt-5 justify-center gap-2">
                        <template v-for="(item, index) in routeItems" :key="index">
                            <RouterLink :to="item.link" class="rounded-full flex justify-center items-center">
                                <component :is="item.icon" class="w-7 lg:w-10 h-7 lg:h-10 "/>
                            </RouterLink>
                        </template>
                    </div>
                </div>
                <div class="w-full lg:w-[28%] xl:w-[25%] mb-3 lg:mb-0 flex justify-between gap-10">
                    <div class="flex-1">
                        <h2 class="lg:2 text-sm lg:text-lg font-medium lg:font-semibold text-white uppercase">Plan Events</h2>
                        <div class="mt-1 flex flex-col gap-1 text-xs lg:font-medium text-white">
                            <template v-for="(item, index) in planItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="lg:mb-3 text-sm lg:text-lg font-medium lg:font-semibold text-white uppercase">Eventick</h2>
                        <div class="mt-1 flex flex-col gap-1 text-xs lg:font-medium text-white">
                            <template v-for="(item, index) in EventickItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="lg:w-[42%] xl:w-[40%] lg:mb-0 text-white">
                    <h2 class="lg:mb-3 text-sm lg:text-lg font-semibold uppercase">Stay In The Loop</h2>
                    <p class="mb-4 text-sm">Join our mailing list to stay in the loop with our newest for Event and concert</p>
                    <form class="relative w-[80%] lg:w-[50%] lg:h-fit">
                        <input type="email" id="first_name" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter your email address" required>
                        <!-- <button class="absolute top-1/2 -translate-y-1/2 right-[2%] bg-red-500 px-1.75 py-1.25 flex justify-center items-center rounded-sm md:rounded-md xl:rounded-lg cursor-pointer text-xs" @click="send">Subscribe</button> -->
                    </form>
                </div>
            </div>
            <hr class="mt-5 mb-2 lg:my-5 border-gray-200 sm:mx-auto dark:border-gray-700" />
            <div class="sm:w-4/5 lg:w-full flex justify-center items-center">
                <span class="text-xs sm:text-center text-white">© Copyright {{ publicConfig.appName }} All Rights Reserved.</span>
            </div>
        </div>
    </footer>
</template>