<template>
    <footer class="bg-white dark:bg-gray-900">
        <div class="mx-auto w-full max-w-[92%] p-4 lg:py-6">
            <div class="md:flex justify-between ">
                <div class="w-[37%] flex flex-col items-start mb-6 md:mb-0 bg-amber-500">
                    <img src="@/assets/images/logowhite.png" class="h-28 relative -left-[7%]" alt="UniEvents Logo" />
                    <span class="text-white">Eventick is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</span>
                    <div class="flex mt-5 sm:justify-center">
                        <RouterLink to="https://facebook.com" class="w-8 h-8 rounded-full bg-[#3B5998] flex justify-center items-center text-white">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                    <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                                </svg>
                            <span class="sr-only">Facebook page</span>
                        </RouterLink>
                        <RouterLink to="https://x.com" class="w-8 h-8 rounded-full bg-[#55ACEE] flex justify-center items-center text-white ms-5">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                            </svg>
                            <span class="sr-only">Twitter page</span>
                        </RouterLink>
                        <RouterLink to="https://linkedln.com" class="w-8 h-8 rounded-full bg-[#007AB9] flex justify-center items-center text-white ms-5">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                            </svg>
                            <span class="sr-only">Linkedin</span>
                        </RouterLink>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 w-fit bg-blue-500">
                    <div>
                        <h2 class="mb-6 text-lg font-semibold text-white uppercase">Plan Events</h2>
                        <ul class="text-white font-medium">
                            <li class="mb-4">
                                <RouterLink to="https://flowbite.com/" class="hover:underline">Create And Set Up</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="https://tailwindcss.com/" class="hover:underline">Sell Tickets</RouterLink>
                            </li>
                            <li>
                                <RouterLink to="https://tailwindcss.com/" class="hover:underline">Online RSVP</RouterLink>
                            </li>
                            <li>
                                <RouterLink to="https://tailwindcss.com/" class="hover:underline">Online EVents</RouterLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="mb-6 text-lg font-semibold text-white uppercase">Eventick</h2>
                        <ul class="text-white font-medium">
                            <li class="mb-4">
                                <RouterLink to="/about" class="hover:underline ">About Us</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="/press" class="hover:underline ">Press</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="/contact" class="hover:underline ">Contact Us</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="/help" class="hover:underline ">Help Center</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="/how" class="hover:underline ">How It Works</RouterLink>
                            </li>
                            <li class="mb-4">
                                <RouterLink to="Privacy" class="hover:underline ">Privacy</RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/terms" class="hover:underline">Terms</RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="w-[30%] bg-red-500 text-white">
                    <div>
                        <h2 class="mb-6 text-lg font-semibold  uppercase">Resources</h2>
                        <p class="mb-4">Join our mailing list to stay in the loop with our newest for Event and concert</p>
                        <form class="relative h-fit">
                            <input type="email" id="first_name" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter your email address" required>
                            <button class="absolute top-1/2 -translate-y-1/2 right-[2%] bg-red-500 px-4 py-1 flex justify-center items-center rounded-xl cursor-pointer" @click="send">Subscribe Now</button>
                        </form>
                    </div>
                </div>
            </div>
            <!-- <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" /> -->
            <hr class="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-5" />
            <div class="sm:w-4/5 md:w-full flex justify-center items-center">
                <span class="text-sm sm:text-center text-white">© Copyright {{ publicConfig.appName }} All Rights Reserved.</span>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import { useConfig } from '@/composables/useConfig';
import { RouterLink } from 'vue-router';
const publicConfig = useConfig()
const 
console.log('isiii footer ', publicConfig)
</script>