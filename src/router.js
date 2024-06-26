import { createRouter, createWebHashHistory } from 'vue-router'
import AttendanceUpload from './components/AttendanceTMU/AttendanceUpload.vue'
import SessionCreation from './components/SessionCreationTMU/SessionCreation.vue'
import AttendanceSheet from './components/AttendanceSheet/AttendanceSheet.vue'
import CertificateValidation from './components/CertificateValition.Vue/CertificateValidation.vue'

const routes = [
  { path: '/', component: AttendanceUpload },
  { path: '/about', component: SessionCreation },
  { path: '/attendance', component: CertificateValidation }
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router