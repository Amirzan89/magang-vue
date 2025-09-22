<template>
    <section>
        <div class="bg h-screen absolute inset-0">
            <nav>
                <img src="@/assets/images/header.png" alt="">
            </nav>
            <!-- <img src="@/assets/images/cele3.png" alt="">
            <div class="inset-0"></div> -->
        </div>
        <div class="flex gap-5">
            <!-- <img src="@/assets/images/notfound.png" alt=""> -->
            <div>
                <span class="bg-red-500 text-xl"></span>
                <RouterLink to="/" class="text-[#2B0DB1]">Back To Home</RouterLink>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
</script>
<style scoped lang="scss">
section .bg{
    // background-image:
    //     linear-gradient(135deg, rgba(237,70,144,1) 0%, rgba(85,34,204,1) 100%),
    //     url('@/assets/images/cele3.png');
    // background-position: center;
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-color: #ED4690;
    background: #ED4690;
    background: linear-gradient(135deg, rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%), url('@/assets/images/cele3.png');
}
</style>