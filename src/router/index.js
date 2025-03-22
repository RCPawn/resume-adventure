import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/gateway/projects',
    //   name: 'projects',
    //   component: () => import('../views/ProjectsView.vue'),
    // },
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
    // {
    //   path: '/projects/github',
    //   name: 'github',
    //   component: () => import('../views/GitHubView.vue'),
    // },
    {
      path: '/coming-soon',
      name: 'coming-soon',
      component: () => import('../views/ComingSoon.vue'),
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/ResumeSection.vue'),
    // },
  ],
})

export default router
