<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()
const backOrHome = () => {
    if(window.history.state.back === null){
        router.push("/");
    }else{
        router.back();
    }
}
</script>
<template>
    <section class="w-full relative overflow-x-clip" style="height: calc(100vh - var(--paddTop));">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute -bottom-[15%] -right-[36%] w-[90%] h-[90%] -z-1 object-cover opacity-30"/>
        <div class="w-fit relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row items-center gap- phone:gap-2 sm:gap-5 md:gap-10 lg:gap-20 xl:gap-30 2xl:gap-40">
            <img src="@/assets/images/notfound.png" alt="" class="h-47 xs:-50 phone:h-55 sm:h-60 md:h-80 lg:h-90 xl:h-100 2xl:h-110">
            <div class="flex flex-col items-center gap-1 md:gap-3">
                <span class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-red-500">Page Not Found</span>
                <Button @click="backOrHome" variant="outlined" class="!px-1 !py-0.5 phone:!px-1.75 phone!py-1 md:!px-3 md:!py-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1]">Back To Home</Button>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
</style>