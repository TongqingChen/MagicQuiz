<template>
    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
            <el-icon>
                <component :is="item.meta.icon" class="icon" />
            </el-icon>
            <span>{{ item.name }}</span>
        </template>
        <menu-item v-for="inner in item.children" :key="inner.path" :item="inner"></menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
        <template #title>
            <el-icon>
                <component :is="item.meta.icon" class="icon" />
            </el-icon>
            <span>{{ item.name }}</span>
        </template>
    </el-menu-item>
    <!-- <template v-if="menu.meta.padding">
            <div class="flex-grow"></div>
            <el-tooltip content="全屏" place-ment="top" effect="dark">
                <el-button link :icon="FullScreen" type="primary" @click="screenfull.toggle()"></el-button>
            </el-tooltip>
        </template> -->
</template>

<script lang="ts" setup>
defineProps(['item'])
</script>

<style lang="scss" scoped>
.flex-grow {
    flex-grow: 1;
}

.el-menu-item {
    padding: 8px;
    color: #9fd3b0;
}
</style>