import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Dropdown from 'primevue/dropdown';
import router from './router';
import AutoComplete from 'primevue/autocomplete';
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';


createApp(App)
.use(PrimeVue)
.use(router)
.component('InputText',InputText)
.component('Checkbox',Checkbox)
.component('Button',Button)
.component('Calendar',Calendar)
.component('TabView',TabView)
.component('TabPanel',TabPanel)
.component('Textarea',Textarea)
.component('DataTable',DataTable)
.component('Column',Column)
.component('RadioButton',RadioButton)
.component('InputGroup',InputGroup)
.component('InputGroupAddon',InputGroupAddon)
.component('Dropdown',Dropdown)
.component('AutoComplete',AutoComplete)
.component('FileUpload',FileUpload)
.component('Toast',Toast)
.mount('#app')

