<script setup lang="ts">
import { useToastStore } from '@/stores/Toast'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"
const toast = useToastStore()
const redToast = () => {
    toast.error({ id: Date.now().toString(), title: 'testing abang', message: 'akuuuuu abang' })
}
const ijoToast = () => {
    toast.success({ id: Date.now().toString(), title: 'testing ijo', message: 'akuuuuu ijoo' })
}
</script>
<template>
    <Card :customTW="'h-full'">
        <CardContent class="flex aspect-square items-center justify-center p-6 h-full">
            <span class="text-4xl font-semibold"> 1 </span>
        </CardContent>
    </Card>
    <div class="flex flex-col space-y-3">
        <Skeleton class="h-[125px] w-[250px] rounded-xl" />
        <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
        </div>
    </div>
    <button class="bg-red-500" @click="redToast">piteken</button>
    <button class="bg-green-500" @click="ijoToast">piteken</button>
</template>