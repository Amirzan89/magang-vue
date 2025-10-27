import { defineStore } from 'pinia'
export const useGlobalStore = defineStore('global', {
    state: () => ({
        user: null,
        message: null,
        statusCode: null,
    }),
    actions: {
        hydrate(payload: any){
            this.user = payload.user ?? null
            this.message = payload.message ?? null
            this.statusCode = payload.statusCode ?? null
        },
        reset(){
            this.user = null
            this.message = null
            this.statusCode = null
        },
    },
})