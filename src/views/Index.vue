<template>
    <div>
        <el-container class="layout">
            <el-header class="header">
                <el-menu :ellipsis="false" :default-active="activeIdx" class="menu" mode="horizontal"
                    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" router>
                    <MenuItem :menuList="menuList" />
                </el-menu>
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

const route = useRoute()
const router = useRouter()

const activeIdx = computed(() => {
    return route.path;
})

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
    console.log('router.currentRoute()', router.currentRoute)
    console.log('router.getRoutes()', router.getRoutes())
    console.log(menuList)
}

const menuList = router.getRoutes().filter(v => {return v.meta.visible && v.meta.is_child==false})

onMounted(()=>{
    console.log('router.getRoutes()', router.getRoutes())
    console.log('menuList', menuList)
})

</script>

<style lang="scss" scoped>
.layout {
    height: 100%;

    .header {
        padding: 0;
        height: 48px;

        .el-menu {
            height: 48px;
        }
    }

    .flex-grow {
        flex-grow: 1;
    }

    .main {
        background-color: #f5f7fa;
        color: black;
        padding: 10px;

    }
}
</style>