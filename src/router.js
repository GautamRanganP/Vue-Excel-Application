import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: ()=> import('./components/AttendanceTMU/AttendanceUpload.vue')},
  { path: '/sessionCreation',  component: ()=> import('./components/SessionCreationTMU/SessionCreation.vue') },
  { path: '/certificationValidator', component: ()=> import('./components/CertificateValidation/CertificateValidation.vue')},
  { path: '/employee', component: ()=> import('./components/EmployeeDetails/EmployeeDetails.vue')  },
  { path: '/dashboard', component: ()=> import('./components/CertificateDashboard/CertificateDashboard.vue') },
  { path: '/report', component: ()=> import('./components/AttendanceReport/AttendanceReport.vue') },
  { path: '/checker', component: ()=> import('./components/ExternalCertificate/Checker.vue') },
  { path: '/email', component: ()=> import('./components/EmailTest/EmailTest.vue') },
  { path: '/filter', component: ()=> import('./components/ExtractExcelData/ExtractExcelData.vue') },
  { path: '/:catchAll(.*)', component: ()=> import('./components/ErrorBoundary/ErrorBoundary.vue') }
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router