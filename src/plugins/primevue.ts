import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import IconField from 'primevue/iconfield'
import Avatar from 'primevue/avatar';
import InputIcon from 'primevue/inputicon'
import ToastService from 'primevue/toastservice'
export default function setupPrimeVue(app: any){
    app.use(PrimeVue, {
        ripple: true,
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '',
            }
        }
    })
    app.use(ToastService)
    app.component('InputText', InputText)
    app.component('Button', Button)
    app.component('Dialog', Dialog)
    app.component('Skeleton', Skeleton)
    app.component('Card', Card)
    app.component('IconField', IconField)
    app.component('Avatar', Avatar)
    app.component('InputIcon', InputIcon)
}