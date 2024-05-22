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


createApp(App)
.use(PrimeVue)
.component('InputText',InputText)
.component('Checkbox',Checkbox)
.component('Button',Button)
.component('Calendar',Calendar)
.component('TabView',TabView)
.component('TabPanel',TabPanel)
.mount('#app')
