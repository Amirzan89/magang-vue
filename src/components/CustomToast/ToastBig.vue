<template>
    <div v-if="local.state === 'green'" class="z-50 3xsphone:w-50 sm:w-60 lg:w-70 xl:w-80 3xsphone:h-12 lg:h-14 xl:h-15 fixed 3xsphone:right-1 right-5 3xsphone:bottom-2 bottom-5 text-lg font-normal" ref="greenPopup">
        <div class="w-full h-full absolute 3xsphone:rounded-lg md:rounded-xl xl:rounded-xl" @click="closePopup('red',true)" style="background: #ECFFEB;border: 2px #01B701 solid;"></div>
        <div class="absolute 3xsphone:w-5 phone:w-6 xl:w-9 3xsphone:h-5 phone:h-6 xl:h-9 top-1/2 -translate-y-1/2 rounded-full" style="left: 5%; background: #bcffb7;">
            <div class="absolute 3xsphone:w-5 phone:w-6 xl:w-9 3xsphone:h-5 phone:h-6 xl:h-9 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style="border: 2px #01B701 solid;"></div>
            <FontAwesomeIcon icon="fa-solid fa-check" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 3xsphone:text-sm xsphone:text-xs phone:text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-green-700"/>
        </div>
        <FontAwesomeIcon icon="fa-solid fa-xmark" class="absolute top-1/2 -translate-y-1/2 3xsphone:text-lg md:text-xl lg:text-2xl xl:text-3xl text-green-500 cursor-pointer" style="right: 5%;"/>
        <label class="absolute top-1/2 3xsphone:left-1/5 md:left-1/6 lg:left-1/7 xl:left-1/6 2xl:left-1/5 -translate-y-1/2 3xsphone:text-sm lg:text-sm xl:text-lg font-medium leading-7 whitespace-normal break-keep text-green-500">{{  local.message }}</label>
    </div>
</template>
<style scoped>
.fade-out{
    animation: fadeOut 0.75s ease forwards;
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        display: none;
    }
}
</style>
<script setup>
import { onMounted, reactive, ref,  } from 'vue';
import { eventBus } from '~/app/eventBus';
const publicConfig = useRuntimeConfig().public;
const local = reactive({
    state:'',
    message:'',
});
const greenPopup = ref(null);
const redPopup = ref(null);
onMounted(()=> {
    eventBus.on('showGreenPopup',function(message){
        showGreenPopup(message);
    });
    eventBus.on('showRedPopup',function(message){
        showRedPopup(message);
    });
    eventBus.on('showCountDown',function(message){
        showCountDown(message);
    });
    eventBus.on('closePopup',function(opt){
        closePopup(opt);
    });
});
const showCountDown = (data) => {
    local.message = data;
    local.state = 'red';
};
const showRedPopup = (data, div = null) => {
    local.message = data;
    local.state = 'red';
    setTimeout(function(){
        closePopup('red');
    }, 3000);
};
const showGreenPopup = (data, div = null) => {
    local.message = data;
    local.state = 'green';
    setTimeout(function(){
        closePopup('green');
    }, 3000);
};
const closePopup = (opt, click = false, divInp = null) => {
    if(click){
        if (opt == 'green') {
            local.state = '';
            local.message = '';
        } else if (opt == 'red') {
            local.state = '';
            local.message = '';
        }
    }else{
        if (opt == 'green') {
            greenPopup.value.classList.add('fade-out');
            setTimeout(function(){
                greenPopup.value.classList.remove('fade-out');
                local.state = '';
                local.message = '';
            }, 750);
        } else if (opt == 'red') {
            redPopup.value.classList.add('fade-out');
            setTimeout(function(){
                redPopup.value.classList.remove('fade-out');
                local.state = '';
                local.message = '';
            }, 750);
        }
    }
    if(divInp !== null){
        if(divInp == 'login'){
            loginPage();
        }else{
            showDiv(divInp);
        }
    }
};
</script>