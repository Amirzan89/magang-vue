import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import IconField from 'primevue/iconfield'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import CheckboxGroup from 'primevue/checkboxgroup'
import Avatar from 'primevue/avatar'
import InputIcon from 'primevue/inputicon'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'
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
    app.component('Button', Button)
    app.component('Dialog', Dialog)
    app.component('Skeleton', Skeleton)
    app.component('Card', Card)
    app.component('IconField', IconField)
    app.component('InputText', InputText)
    app.component('DatePicker', DatePicker)
    app.component('Select', Select)
    app.component('Checkbox', Checkbox)
    app.component('CheckboxGroup', CheckboxGroup)
    app.component('Avatar', Avatar)
    app.component('InputIcon', InputIcon)
    app.component('ProgressSpinner', ProgressSpinner)
}