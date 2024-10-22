import { createRouter, createWebHashHistory } from 'vue-router'
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails.vue'
import CertificationDashboard from './components/CertificateDashboard/CertificateDashboard.vue'
import AttendanceReport from './components/AttendanceReport/AttendanceReport.vue'
import Checker from './components/ExternalCertificate/Checker.vue'
import EmailTest from './components/EmailTest/EmailTest.vue'

const routes = [
  { path: '/', component: ()=> import('./components/AttendanceTMU/AttendanceUpload.vue')},
  { path: '/sessionCreation',  component: ()=> import('./components/SessionCreationTMU/SessionCreation.vue') },
  { path: '/certificationValidator', component: ()=> import('./components/CertificateValidation/CertificateValidation.vue')},
  { path: '/employee', component:EmployeeDetails  },
  { path: '/dashboard', component:CertificationDashboard },
  { path: '/report', component: AttendanceReport },
  { path: '/checker', component: Checker},
  { pat: './email',component: EmailTest}
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router