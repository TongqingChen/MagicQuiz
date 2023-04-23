import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('../views/Home.vue') // 建议进行路由懒加载，优化访问性能
            }
        ]
    },
    {
        path: '/examList',
        name: 'examList',
        component: () => import('../views/ExamList.vue')
    },
    {
        path: '/questionBank',
        name: 'questionBank',
        component: () => import('../views/QuestionBank.vue')
    },
    {
        path: '/user',
        name: 'user',
        children: [
            {
                path: "/userInfo",
                component: () => import('../views/Exam.vue')
            }
        ]
    },
    {
        path: '/exam',
        name: 'exam',
        component:()=>import('../views/Exam.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router