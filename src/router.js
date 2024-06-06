import { createRouter, createWebHashHistory } from 'vue-router'
import AttendanceUpload from './components/AttendanceTMU/AttendanceUpload.vue'
import SessionCreation from './components/SessionCreationTMU/SessionCreation.vue'
 
const routes = [
  { path: '/', component: AttendanceUpload },
  { path: '/about', component: SessionCreation }
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router