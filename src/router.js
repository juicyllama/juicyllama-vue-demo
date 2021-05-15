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
                component: () => import('./views/authentication/Login.vue')
            }, {
                path: '/error',
                name: '404',
                index: 2,
                component: () => import('./views/authentication/Error404.vue')
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