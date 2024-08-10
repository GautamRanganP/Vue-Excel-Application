import { createRouter, createWebHashHistory } from 'vue-router'
import AttendanceUpload from './components/AttendanceTMU/AttendanceUpload.vue'
import SessionCreation from './components/SessionCreationTMU/SessionCreation.vue'
import AttendanceSheet from './components/AttendanceSheet/AttendanceSheet.vue'
import CertificateValidation from './components/CertificateValidation/CertificateValidation.vue'
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails.vue'

const routes = [
  { path: '/', component: AttendanceUpload },
  { path: '/sessionCreation', component: SessionCreation },
  { path: '/certificationValidator', component: CertificateValidation },
  { path: '/employee', component:EmployeeDetails  }
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router