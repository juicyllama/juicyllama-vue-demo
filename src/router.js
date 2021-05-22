import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // ======================
        // Blank Layout
        // ======================    
        {
            path: '',
            component: () => import('./layout/blank/Blank.vue'),
            // ======================
            // Theme routes / pages
            // ======================
            children: [{
                path: '/',
                redirect: '/login'
            }, {
                path: '/login',
                name: 'Login',
                index: 1,
                component: () => import('./views/_authentication/Login.vue')
            }, {
                path: '/error',
                name: '404',
                index: 2,
                component: () => import('./views/404.vue')
            }]
        },
        {
            // ======================
            // Full Layout
            // ======================
            path: '',
            component: () => import('./layout/full/MainContainer.vue'),
            // ======================
            // Theme routes / pages
            // ======================
            children: [
                {
                path: '/home',
                name: 'Home',
                i18n: "Home",
                index: 1,
                component: () => import('./views/Home.vue')
                },
                {
                    path: '/superhero',
                    name: 'Superhero',
                    i18n: "Superhero",
                    index: 1,
                    component: () => import('./views/Superhero.vue')
                },
                {
                    path: '/online',
                    name: 'Who\'s Online',
                    i18n: 'Who\'s Online',
                    index: 1,
                    component: () => import('./views/Activity/WhosOnline.vue')
                },
                {
                    path: '/streak',
                    name: 'Daily Streak',
                    i18n: 'Daily Streak',
                    index: 1,
                    component: () => import('./views/Activity/Streak.vue')
                },
                {
                    path: '/profile/:user',
                    name: 'Profile',
                    i18n: 'Profile',
                    index: 1,
                    component: () => import('./views/Profile.vue')
                },
                {
                    path: '/badges',
                    name: 'Badges',
                    i18n: 'Badges',
                    index: 1,
                    component: () => import('./views/Badges/Badges.vue')
                },
                {
                    path: '/badge/:badge_id',
                    name: 'Badge',
                    i18n: 'Badge',
                    index: 1,
                    component: () => import('./views/Badges/Badge.vue')
                },
                {
                    path: '/following',
                    name: 'Following',
                    i18n: 'Following',
                    index: 1,
                    component: () => import('./views/Connections/Following.vue')
                },
                {
                    path: '/followers',
                    name: 'Followers',
                    i18n: 'Followers',
                    index: 1,
                    component: () => import('./views/Connections/Followers.vue')
                },
                {
                    path: '/messages',
                    name: 'Messages',
                    i18n: 'Messages',
                    index: 1,
                    component: () => import('./views/Messages/Chat.vue')
                },
                {
                    path: '/messages/:chat_id',
                    name: 'Message',
                    i18n: 'Message',
                    index: 1,
                    component: () => import('./views/Messages/Chat.vue')
                },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/error'
        }
    ]
})

import NProgress from 'nprogress';

router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
})

router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
})
export default router