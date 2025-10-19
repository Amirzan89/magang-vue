import { defineStore } from "pinia"
export const useLoadingStore = defineStore('loadingStore', {
    state: () => ({
        isLoading: false,
    }),
    actions: {
        setLoading(value: boolean){
            this.isLoading = value
        },
    },
})