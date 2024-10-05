import { createRouter, createWebHashHistory } from 'vue-router'
import AttendanceUpload from './components/AttendanceTMU/AttendanceUpload.vue'
import SessionCreation from './components/SessionCreationTMU/SessionCreation.vue'
import AttendanceSheet from './components/AttendanceSheet/AttendanceSheet.vue'
import CertificateValidation from './components/CertificateValidation/CertificateValidation.vue'
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails.vue'
import CertificationDashboard from './components/CertificateDashboard/CertificateDashboard.vue'
import AttendanceReport from './components/AttendanceReport/AttendanceReport.vue'
import Checker from './components/ExternalCertificate/Checker.vue'

const routes = [
  { path: '/', component: AttendanceUpload },
  { path: '/sessionCreation', component: SessionCreation },
  { path: '/certificationValidator', component: CertificateValidation },
  { path: '/employee', component:EmployeeDetails  },
  { path: '/dashboard', component:CertificationDashboard },
  { path: '/report', component: AttendanceReport },
  { path: '/checker', component: Checker}
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router