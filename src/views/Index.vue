<template>
    <div>
        <el-container class="layout">
            <el-header class="header">
                <div class="el-logo" @click.native="userInfoCommand('home')">
                    <img src="@/assets/logo.png" />
                    <span class="title">首页</span>
                </div>
                <el-menu :ellipsis="false" :default-active="activeIdx" class="menu" mode="horizontal"
                    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" router>
                    <MenuItem v-for="item in menuList" :key="item.path" :item="item" />
                </el-menu>
                <el-tooltip content="全屏" place-ment="top" effect="dark">
                    <el-button link :icon="FullScreen" type="primary" @click="screenfull.toggle()"
                        style="padding-right: 10px;"></el-button>
                </el-tooltip>
                <el-dropdown @command="userInfoCommand">
                    <div class="header-user">
                        <el-avatar :size="48" :src="user.avatar" />
                        <span>{{ user.last_name }}{{ user.first_name }}</span>
                        <el-icon>
                            <ArrowDown />
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user_center" :icon="User">个人信息</el-dropdown-item>
                            <el-dropdown-item command="change_pwd" :icon="Lock">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="Switch">退出登录</el-dropdown-item>
                            <el-dropdown-item command="about" :icon="InfoFilled">关于我们</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!-- <el-button link @click="onLogoutClicked">退出</el-button> -->
            </el-header>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
            <!-- <el-footer class="footer">Footer</el-footer> -->
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import MenuItem from '@/components/MenuItem.vue'
import { useRoute, useRouter } from 'vue-router';
import { computed } from '@vue/reactivity';
import { Api } from '@/request';
import { ArrowDown, Switch, User, Lock, InfoFilled, FullScreen } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import screenfull from "screenfull";
import { Info } from '@/info'

const route = useRoute()
const router = useRouter()
const info = new Info()

const user = reactive({ id: -1, avatar: '@/assets/vue.svg', first_name: '未登录', 'last_name': '' })

const activeIdx = computed(() => {
    return route.path;
})

const handleSelect = (key: string, keyPath: string[]) => {
    if (key == '/logout') {
        Api.clearUserInfo()
    }
}

const userInfoCommand = (command: string) => {
    if (command == 'user_center') {
        router.push('/userInfo')
    } else if (command == 'change_pwd') {

    } else if (command == 'logout') {
        Api.clearUserInfo()
        router.push('/login')
    } else if (command == 'home') {
        router.push('/home')
    } else if (command == 'about') {
        ElMessageBox.alert(`书山有路勤为径，学海无涯苦作舟<br/>version: ${info.version}`, '学海', {
            confirmButtonText: 'OK',
            closeOnClickModal: true,
            dangerouslyUseHTMLString: true
        }).then(() => {
            // 执行真正的删除事件
        }).catch(() => { }) // 添加错误捕获
    }
}

const filterMenu = (itemArray: any) => {
    var menu = itemArray.filter((v: { meta: { visible: Boolean; }; children: string | any[]; }) => { return (v.meta && v.meta.visible) })
    menu.forEach((m: { children: any[]; }) => {
        if (m.children && m.children.length > 0) {
            m.children = filterMenu(m.children)
        }
    })
    return menu
}

const menuList = computed(() => {
    return filterMenu(router.getRoutes())
})

onMounted(() => {
    var ui = Api.loadUserInfoFromStorage()
    if (ui == null) {
        return;
    }
    user.id = ui.id
    user.first_name = ui.first_name
    user.last_name = ui.last_name
    user.avatar = ui.avatar
})

</script>

<style lang="scss" scoped>
.layout {
    height: 100%;
    overflow-y: hidden;

    .header {
        padding: 0;
        height: 50px;
        display: flex;
        background-color: #545c64;

        .el-logo {
            display: flex;
            align-items: center;
            height: 50px;
            padding-left: 5px;
            cursor: pointer;

            img {
                width: 48px;
                height: 48px;
            }

            .title {
                color: yellow;
                font-size: 16px;
                font-weight: bold;
                margin-left: 8px;
                width: 32px
            }
        }

        .el-menu {
            width: 100%;
            height: 100%;
            padding-right: 10px;
            border: none;
            justify-content: flex-end
        }

        .header-user {
            height: 100%;
            width: 106px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            margin-right: 4px;
            cursor: pointer;
            color: #409eff;
        }
    }

    .main {
        background-color: #f5f7fa;
        color: darkblue;
        padding: 5px;
        height: calc(100vh - 50px);
    }
}
</style>