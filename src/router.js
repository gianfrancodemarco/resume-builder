import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import EditorPage from './views/EditorPage.vue'

const routes = [
    { path: '/', component: LandingPage, name: 'landing' },
    { path: '/editor', component: EditorPage, name: 'editor' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Track route changes with GoatCounter (the script loads async, so the first view may wait for it)
function trackPageview(path) {
    const count = () => window.goatcounter.count({ path })
    if (window.goatcounter?.count) {
        count()
    } else {
        document.querySelector('script[data-goatcounter]')?.addEventListener('load', count, { once: true })
    }
}

router.afterEach((to) => {
    trackPageview(to.path)
})

export default router
