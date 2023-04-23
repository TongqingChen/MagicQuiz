<template>
    <el-menu :ellipsis="false" :default-active="activeIdx" class="menu" mode="horizontal" background-color="#545c64"
        text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" router>
        <MenuItem :menuList="menuList">
        </MenuItem>
    </el-menu>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import MenuItem from './MenuItem.vue'
import { useRoute } from 'vue-router';
import { computed } from '@vue/reactivity';

const route = useRoute()

const activeIdx = computed(()=>{
    return route.path;
})

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
let menuList = reactive([
    { path: '/home', component: 'Layout', meta: { title: "首页", icon: "HomeFilled", roles: ["sys:manage"] }, grow: true },
    { path: '/examList', component: 'Layout', meta: { title: "试卷", icon: "EditPen", roles: ["sys:manage"] } },
    { path: '/questionBank', component: 'Layout', meta: { title: "题库", icon: "Memo", roles: [] } },
    {
        path: '/user', component: 'Layout', meta: { title: "个人中心", icon: "UserFilled", roles: [] }, children: [
            { path: '/userInfo', component: 'Layout', meta: { title: "修改资料", icon: "el-icon-s-home", roles: [] } },
            { path: '/logout', component: 'Layout', meta: { title: "退出", icon: "el-icon-s-home", roles: [] } }
        ]
    }
])

</script>

<style lang="scss" scoped>
.el-menu {
    height: 100%;
}
</style>