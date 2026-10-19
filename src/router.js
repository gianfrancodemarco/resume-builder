import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import EditorPage from './views/EditorPage.vue'
import { trackPageview } from './analytics'

const routes = [
    { path: '/', component: LandingPage, name: 'landing' },
    { path: '/editor', component: EditorPage, name: 'editor' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Track route changes with GoatCounter
router.afterEach((to) => {
    trackPageview(to.path)
})

export default router
