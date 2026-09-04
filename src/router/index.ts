import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView/HomeView.vue'
import AnimationView from '@/views/AnimationView/AnimationView.vue'
import SpecialView from '@/views/SpecialView/SpecialView.vue'
import GuidingIdeaView from '@/views/GuidingIdeaView/GuidingIdeaView.vue'
import CompetenceView from '@/views/CompetenceView/CompetenceView.vue'
import BadResultsView from '@/views/BadResultsView/BadResultsView.vue'
import FinalView from '@/views/FinalView/FinalView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/layouts/LoginLayout.vue'),
        },
        {
            path: '/',
            redirect: (to) => {
                const auth = useAuthStore()
                return auth.isAuthenticated ? '/step-1' : { name: 'login', query: to.query }
            },
        },
        { path: '/step-1', name: 'home', component: HomeView, meta: { requiresAuth: true } },
        { path: '/step-2', name: 'step2', component: AnimationView, meta: { requiresAuth: true } },
        { path: '/step-3', name: 'step3', component: SpecialView, meta: { requiresAuth: true } },
        { path: '/step-4/:subId?', name: 'step4', component: CompetenceView, meta: { requiresAuth: true } },
        { path: '/step-5/:subId?', name: 'step5', component: GuidingIdeaView, meta: { requiresAuth: true } },
        { path: '/step-6/:subId?', name: 'step6', component: BadResultsView, meta: { requiresAuth: true } },
        { path: '/step-7', name: 'step7', component: FinalView, meta: { requiresAuth: true } },
    ],
})

router.beforeEach((to) => {
    const auth = useAuthStore()

    if (auth.isAuthenticated && auth.isSessionExpired) {
        auth.logout()
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.name === 'login' && auth.isAuthenticated) {
        return { path: '/step-1' }
    }
})

export default router
