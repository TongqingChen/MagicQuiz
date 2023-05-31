<template>
    <template v-for="menu in menuList" : key="menu.path">
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
                <el-icon>
                    <component :is="menu.meta.icon" class="icon" />
                </el-icon>
                <span>{{ menu.meta.title }}</span>
            </template>
            <menu-item :menuList="menu.children"></menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path">
            <template #title>
                <el-icon>
                    <component :is="menu.meta.icon" class="icon" />
                </el-icon>
                <span>{{ menu.meta.title }}</span>
            </template>
        </el-menu-item>
        <template v-if="menu.meta.padding">
            <div class="flex-grow"></div>
            <el-button link :icon="FullScreen" type="primary" @click="screenfull.toggle()">全屏</el-button>
        </template>
        
    </template>
</template>

<script lang="ts" setup>
import { FullScreen } from "@element-plus/icons-vue";
import screenfull from "screenfull";
defineProps(['menuList'])
</script>

<style lang="scss" scoped>
.flex-grow {
    flex-grow: 1;
}

.el-menu-item {
    padding: 10px;
}
</style>