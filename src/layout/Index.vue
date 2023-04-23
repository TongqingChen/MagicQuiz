<template>
    <div>
        <el-container class="layout">
            <el-header class="header">
                <MenuBar></MenuBar>
            </el-header>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
            <!-- <el-footer class="footer">Footer</el-footer> -->
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import MenuBar from './menu/MenuBar.vue'
</script>

<style lang="scss" scoped>
.layout {
    height: 100%;

    .header {
        padding: 0;
        height: 48px;
    }

    .flex-grow {
        flex-grow: 1;

    }

    .main{
        background-color: #f5f7fa;
        color: black;
        padding: 10px;
    }

}
</style>