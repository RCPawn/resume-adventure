import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/game',
            name: 'adventure',
            component: () => import('../views/GameView.vue'),
        },
        {
            path: '/olive-ppt',
            name: 'olive-ppt',
            component: () => import('../views/OlivePpt.vue'),
        },
        {
            path: '/model',
            name: 'model',
            component: () => import('../views/ModelView.vue'),
        },
        {
            path: '/project/:id',
            name: 'project',
            component: () => import('../views/ProjectDetail.vue'),
        },
    ],
})

export default router
