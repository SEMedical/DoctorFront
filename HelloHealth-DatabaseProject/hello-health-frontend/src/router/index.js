import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import("@/pages/LoginPage.vue"),
            children: [
                {
                    path: "",
                    name: "loginView",
                    component: () => import("@/views/LoginView.vue"),
                },
                {
                    path: "forgot",
                    name: "forgotView",
                    component: () => import("@/views/ForgotView.vue"),
                }
            ]
        },
        {
            path: '/',
            name: 'home',
            component: () => import("@/pages/HomePage.vue"),
            children: [{
                path: "",
                name: "homeView",
                component: () => import("@/views/MainPageView.vue"),
            }, {
                path: "user",
                name: "myView",
                component: () => import("@/views/UserInfoView.vue")
            }, {
                path: "user/:userId",
                name: "otherView",
                component: () => import("@/views/UserInfoView.vue")
            }, {
                path: "Patient/:patientId",
                name: "PatientView",
                component: () => import("@/views/glycemia.vue")
            }, {
                path: "Message/:patientId",
                name: "MessageView",
                component: () => import("@/views/MessageView.vue")
            }]
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import("@/pages/ErrorPage.vue") },

    ]
})

export default router
