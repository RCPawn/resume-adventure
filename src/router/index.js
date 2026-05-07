import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
        }
        return { top: 0, left: 0 }
    },
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
        {
            path: '/share',
            name: 'share-home',
            component: () => import('../views/ShareListView.vue'),
        },
        {
            path: '/share/:slug',
            name: 'share-detail',
            component: () => import('../views/ShareDetail.vue'),
        },
    ],
})

export default router
