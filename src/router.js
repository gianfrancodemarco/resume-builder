import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import EditorPage from './views/EditorPage.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/editor', component: EditorPage }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
