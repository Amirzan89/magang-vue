import { defineStore } from "pinia";
export const useLoading = defineStore('loadingStore', {
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