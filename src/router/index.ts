import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/Index.vue'
import { Api } from '@/request'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect: 'home',
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/app/Home.vue'), // 建议进行路由懒加载，优化访问性能
                meta: { title: "首页", icon: "HomeFilled", visible: true, padding: true, is_child: false },
            },
            {
                path: '/examList',
                name: 'examList',
                component: () => import('@/views/app/ExamList.vue'),
                meta: { title: "试卷", icon: "EditPen", visible: true, is_child: false },
            },
            {
                path: '/questionBank',
                name: 'questionBank',
                component: () => import('@/views/app/QuestionBank.vue'),
                meta: { title: "题库", icon: "Memo", visible: false, is_child: false },
            },
            {
                path: '/wrongSet',
                name: 'wrongSet',
                component: () => import('@/views/app/WrongSet.vue'),
                meta: { title: "错题", icon: "Memo", visible: true, is_child: false },
            },
            {
                path: '/user',
                name: 'user',
                meta: { title: "我", icon: "User", visible: true, is_child: false },
                children: [
                    {
                        path: "/habbit",
                        name: 'habbit',
                        component: () => import('@/views/app/Habbit.vue'),
                        meta: { title: "小习惯", icon: "el-icon-s-home", visible: true, is_child: true },
                    },
                    {
                        path: "/userInfo",
                        name: 'userInfo',
                        component: () => import('@/views/app/UserInfo.vue'),
                        meta: { title: "个人中心", icon: "el-icon-s-home", visible: true, is_child: true },
                    },
                    {
                        path: "/logout",
                        name: "logout",
                        // component: () => import('@/views/a.vue'),
                        redirect: 'login',
                        meta: { title: "退出", icon: "el-icon-s-home", visible: true, is_child: true },
                    }
                ]
            },
            {
                path: '/exam',
                name: 'exam',
                component: () => import('@/views/app/Exam.vue'),
                meta: { title: "考试", icon: "HomeFilled", visible: false },
            },
            {
                path: '/oral_math',
                name: 'oral_math',
                component: () => import('@/views/app/OralMath.vue'),
                meta: { title: "口算", icon: "HomeFilled", visible: false },
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.path == "/login") {
        next()
        return
    }
    var ui = Api.loadUserInfoFromStorage()
    if (ui == null) {
        next('/login')
        return
    }
    await Api.verifyToken(ui.access).then(res => {
        next()
    }).catch(error => {
        next('/login')
    })
})

export default router