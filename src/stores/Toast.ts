import { defineStore } from "pinia";
type PositionToast = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
const defaultDuration = 5;
interface config{
    position: PositionToast,
    maxToast: number,
}
interface Toast{
    id?: string,
    title: string,
    message: string,
    icon?: string,
    type?: 'success' | 'info' | 'warn' | 'error' | 'countdown' | 'custom_countdown' | 'default',
    duration?: number,
    durationCountDown?: number,
    timeData?: string,
    callback?: Function | null,
    class?: string,
}
export const useToastStore = defineStore('toast', {
    state: () => {
        return {
            config: {
                position: 'bottom-right' as PositionToast,
                maxToast: 5,
            },
            toastData: [] as Toast[],
        };
    },
    actions: {
        setConfig(data: config){
            this.config.position = data.position || this.defaultConfig().position;
            this.config.maxToast = data.maxToast || this.defaultConfig().maxToast;
        },
        async pushToast(data: Toast){
            if(this.toastData.length >= this.config.maxToast){
                const oldestToast = this.toastData[0];
                await this.closePopup(oldestToast.id);
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            const toast = {
                ...data,
                id: data.id ?? Date.now().toString(),
                duration: data.duration || defaultDuration,
                callback: data.callback || null,
                class: data.class || '',
                timeData: '',
            };
            this.toastData.push(toast);
            if(toast.type === "countdown"){
                this.startCountdown(toast.id, toast.durationCountDown);
            }
        },
        startCountdown(id: string, duration: number){
            let remainingTime = duration * 1000;
            const toastIndex = this.toastData.findIndex((toast) => toast.id === id);
            if(toastIndex === -1) return;
            const updateTimeData = () => {
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                this.toastData[toastIndex].timeData = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
            };
            updateTimeData();
            const interval = setInterval(() => {
                if(!this.toastData[toastIndex]){
                    clearInterval(interval);
                    return;
                }
                if(remainingTime <= 0){
                    clearInterval(interval);
                    this.closePopup(id);
                    return;
                }
                remainingTime -= 1000;
                updateTimeData();
            }, 1000);
        },
        updateToast(inp: Toast){
            const toastIndex = this.toastData.findIndex((toast) => toast.id === inp.id);
            if(toastIndex === -1) return;
            this.toastData[toastIndex] = { ...inp };
        },
        success(data: Omit<Toast, "type">){
            // console.log('mlebuuu sucess');
            this.pushToast({
                ...data,
                type: "success",
            });
        },
        info(data: Omit<Toast, "type">){
            // console.log('mlebuuu information');
            this.pushToast({
                ...data,
                type: "info",
            });
        },
        warning(data: Omit<Toast, "type">){
            // console.log('mlebuuu warning');
            this.pushToast({
                ...data,
                type: "warn",
            });
        },
        error(data: Omit<Toast, "type">){
            // console.log('mlebuuu errror');
            this.pushToast({
                ...data,
                type: "error",
            });
        },
        countDown(data: Omit<Toast, "type">){
            if(!data.durationCountDown) return;
            // console.log('counttdown ')
            this.pushToast({
                ...data,
                type: "countdown",
            });
        },
        customCountDown(data: Omit<Toast, "type">){
            // console.log('customm countdown ')
            this.pushToast({
                ...data,
                type: "custom_countdown",
            });
        },
        async closePopup(id: string, click = false){
            const index = this.toastData.findIndex((item) => item.id === id);
            if(index === -1) return;
            const popToast = () => {
                this.toastData.splice(index, 1);
            };
            if(!this.toastData[index]) return;
            if(!click){
                this.toastData[index].class += ' fade-out';
                await new Promise(resolve => setTimeout(resolve, 400));
            }
            popToast();
            if(this.toastData[index]?.callback && typeof this.toastData[index].callback === 'function'){
                this.toastData[index].callback();
            }
        },
        defaultConfig(){
            return {
                position: 'top-left' as PositionToast,
                maxToast: 5,
            }
        },
    },
});