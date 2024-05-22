import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';


createApp(App)
.use(PrimeVue)
.component('InputText',InputText).component('Checkbox',Checkbox).component('Button',Button).component('Calendar',Calendar)
.mount('#app')
