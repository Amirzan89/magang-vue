import { ref, onMounted, onBeforeUnmount } from 'vue'
import { SCREEN_VALUES } from '@/lib/screens'
export function useScreen() {
    const screenCon = ref<number[]>(SCREEN_VALUES)
    const screenSize = ref<number>(0)
    const handle = () => { screenSize.value = window.innerWidth }
    onMounted(() => {
        handle()
        window.addEventListener('resize', handle)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', handle)
    })
    return { screenCon, screenSize }
}