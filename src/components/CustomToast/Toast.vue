<script setup lang="ts">
import { onMounted } from 'vue';
const props = defineProps(['id', 'title', 'message', 'type', 'icon', 'duration', 'timeData', 'class']);
const emit = defineEmits(['closeToast']);
onMounted(() => {
    setTimeout(() => {
        emit('closeToast', props.id)
    }, props.duration * 1000);
})
</script>
<template>
    <div class="relative w-full 3xs:h-12 lg:h-14 xl:h-20 text-lg font-normal rounded-2xl toast" :class="props.class">
        <div class="w-full h-full absolute 3xs:rounded-lg rounded-xl" style="background: #ECFFEB;border: 2px #01B701 solid;"></div>
        <div class="absolute 3xs:w-5 phone:w-6 xl:w-9 3xs:h-5 phone:h-6 xl:h-9 top-1/2 -translate-y-1/2 rounded-full" style="left: 5%; background: #bcffb7;">
            <div class="absolute 3xs:w-5 phone:w-6 xl:w-9 3xs:h-5 phone:h-6 xl:h-9 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style="border: 2px #01B701 solid;"></div>
            <!-- <FontAwesomeIcon icon="fa-solid fa-check" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 3xs:text-sm xsphone:text-xs phone:text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-green-700"/> -->
        </div>
        <!-- <FontAwesomeIcon icon="fa-solid fa-xmark" class="absolute top-1/2 -translate-y-1/2 3xs:text-lg md:text-xl lg:text-2xl xl:text-3xl text-green-500 cursor-pointer" style="right: 5%;"/> -->
        <label class="absolute top-1/2 -translate-y-1/2 3xs:left-1/5 md:left-1/6 lg:left-1/7 xl:left-1/6 2xl:left-1/5 3xs:text-sm lg:text-sm xl:text-lg font-medium leading-7 whitespace-normal break-keep text-green-500">{{  props.message }} {{ props.timeData ?? '' }}</label>
        <button type="button" class="absolute top-1/2 -translate-y-1/2 right-5" @click="emit('closeToast', props.id, true)">X</button>
    </div>
</template>
<style scoped>
.toast-enter-active, .toast-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast-enter-from {
    transform: translateY(100%);
    opacity: 0;
}
.toast-enter-to {
    transform: translateY(0);
    opacity: 1;
}
.toast-leave-from {
    transform: translateY(0);
    opacity: 1;
}
.toast-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>