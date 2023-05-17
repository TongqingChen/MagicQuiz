<template>
    <el-card >
    <div class="data-box">
        <div class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-3 rounded">
            <el-icon style="width: 32px; height: 32px;">
                <component :is="props.icon" style="width: 100%; height: 100%;" />
            </el-icon>
            <!-- <svg-icon icon-class="uv" size="3em" /> -->
        </div>
        <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">{{ props.title }}</div>
            <div class="text-lg">{{ props.data }}</div>
        </div>
    </div>
</el-card>
</template>

<script lang="ts" setup>

const props = defineProps<{
    icon: string,
    title: string,
    data: number,
}>()

</script>

<style lang="scss" scoped>
.data-box {
    display: flex;
    justify-content: space-between;
    // padding: 16px;
    font-weight: bold;
    border-radius: 4px;
    // color: var(--el-text-color-regular);
    // background: var(--el-bg-color-overlay);
    // border-color: var(--el-border-color);
    // box-shadow: var(--el-box-shadow-dark);
}
</style>