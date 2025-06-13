import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import EditorPage from './components/EditorPage.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/editor', component: EditorPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
