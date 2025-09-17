import { ref, computed, onMounted, onUnmounted } from 'vue'
export function useViewport(){
    const width = ref<number>(0)
    const update = () => {
        width.value = window.innerWidth
    }
    onMounted(() => {
        update()
        window.addEventListener('resize', update)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', update)
    })
    const isMobile = computed(() => (width.value < 768) || false)
    const isDesktop = computed(() => (width.value >= 1024) || false)
    return { width, isMobile, isDesktop }
}