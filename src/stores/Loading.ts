import { defineStore } from "pinia";
export const useLoadingStore = defineStore('loadingStore', {
    state: () => ({
        visible: false,
    }),
    actions: {
        showLoading(){
            this.visible = true;
        },
        closeLoading(){
            this.visible = false;
        }
    },
});