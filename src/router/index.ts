import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/Index.vue'
import { Api } from '@/request'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect: '/home',
        children: [{
            path: '/home',
            name: "首页",
            meta: { visible: false, icon: "HomeFilled" },
            component: () => import('@/views/app/Home.vue'), // 建议进行路由懒加载，优化访问性能
        }, {
            path: '/examList',
            name: '试卷',
            meta: { visible: true, icon: "EditPen" },
            component: () => import('@/views/app/ExamList.vue'),
        }, {
            path: '/questionBank',
            name: '题库',
            meta: { visible: true, icon: "Memo" },
            component: () => import('@/views/app/QuestionBank.vue'),
        }, {
            path: '/wrongSet',
            name: '错题',
            meta: { icon: "DocumentDelete", visible: true },
            component: () => import('@/views/app/WrongSet.vue'),
        }, {
            path: "/habbit",
            name: '习惯',
            meta: { icon: "Calendar", visible: false },
            component: () => import('@/views/app/Habbit.vue'),
        }, {
            path: "/wiki",
            name: '知识',
            meta: { icon: "Paperclip", visible: true },
            component: () => import('@/views/app/Article.vue'),
        }, {
            path: "/greatEvent",
            name: '足迹',
            meta: { icon: "Flag", visible: true },
            component: () => import('@/views/app/GreatEvent.vue'),
        }, {
            path: "/userInfo",
            name: '个人中心',
            component: () => import('@/views/app/UserInfo.vue'),
            meta: { icon: "User", visible: false },
        }, {
            path: '/others',
            name: '其它',
            meta: { icon: "HomeFilled", visible: false },
            children: [{
                path: '/oral_math',
                name: '口算',
                component: () => import('@/views/app/OralMath.vue'),
                meta: { icon: "HomeFilled", visible: false },
            }, {
                path: '/exam',
                name: '考试',
                component: () => import('@/views/app/Exam.vue'),
                meta: { icon: "HomeFilled", visible: false },
            },]
        },]
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