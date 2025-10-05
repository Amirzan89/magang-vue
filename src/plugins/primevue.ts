import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import StyleClass from 'primevue/styleclass'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Chart from 'primevue/chart';
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import CheckboxGroup from 'primevue/checkboxgroup'
import Avatar from 'primevue/avatar'
import InputIcon from 'primevue/inputicon'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
export default function setupPrimeVue(app: any){
    app.use(PrimeVue, {
        ripple: true,
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.app-dark',
            }
        }
    })
    app.use(ToastService)
    app.directive('styleclass', StyleClass)
    app.component('Dialog', Dialog)
    app.component('DataTable', DataTable)
    app.component('Column', Column)
    app.component('ColumnGroup', ColumnGroup)
    app.component('Row', Row)
    app.component('Chart', Chart)
    app.component('Skeleton', Skeleton)
    app.component('Card', Card)
    app.component('Message', Message)
    app.component('Button', Button)
    app.component('IconField', IconField)
    app.component('InputText', InputText)
    app.component('InputNumber', InputNumber)
    app.component('DatePicker', DatePicker)
    app.component('Select', Select)
    app.component('Checkbox', Checkbox)
    app.component('CheckboxGroup', CheckboxGroup)
    app.component('Avatar', Avatar)
    app.component('InputIcon', InputIcon)
    app.component('ProgressSpinner', ProgressSpinner)
    app.component('Toast', Toast)
}