import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AnimationView from '@/views/AnimationView.vue'
import SpecialView from '@/views/SpecialView.vue'
import GuidingIdeaView from '@/views/GuidingIdeaView.vue'
import CompetenceView from '@/views/CompetenceView.vue'
import BadResultsView from '@/views/BadResultsView.vue'
import FinalView from '@/views/FinalView.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/step-1',
        },
        { path: '/step-1', name: 'home', component: HomeView },
        { path: '/step-2', name: 'step2', component: AnimationView },
        { path: '/step-3', name: 'step3', component: SpecialView },
        { path: '/step-4/:subId?', name: 'step4', component: CompetenceView },
        { path: '/step-5/:subId?', name: 'step5', component: GuidingIdeaView },
        { path: '/step-6', name: 'step6', component: BadResultsView },
        { path: '/step-7', name: 'step7', component: FinalView },
    ],
})

export default router
