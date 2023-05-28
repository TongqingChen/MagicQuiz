<template>
    <el-tooltip :content="description" placement="top" :disabled="!(description && description.length > 0)">
        <el-card class="box-card">
            <template #header>
                <el-text size="small" style="color:white" truncated>{{ title }}</el-text>
                <!-- <div class="card-header">
                    <span>{{ title }}</span>
                </div> -->
            </template>
            <div class="card-body" :style="`color: ${meta.color}`">
                <div>
                    <span style="font-size: 20px; font-weight: bold;">{{ meta.days }}</span>
                    <span style="font-size: 12px;">{{ meta.label }}</span>
                </div>
                <span style="font-size: 12px;">{{ date }}</span>
            </div>
        </el-card>
    </el-tooltip>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const meta = computed(() => {
    var now = new Date()
    var obj = new Date(props.date)
    var days = Math.ceil((obj.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    const tags = ['前', '昨', '今', '明', '后']
    return {
        days: isNaN(days) ? '--' : (days > -3 && days < 3 ? tags[days + 2] : Math.abs(days)),
        color: days >= 0 ? (days <= 3 ? 'red' : 'darkblue') : 'gray',
        label: isNaN(days) ? '' : (days > -3 && days < 3 ? '天' : (days > 0 ? '天后' : '天前'))
    }
})
const props = defineProps(["date", "title", "description"])
</script>

<style lang="scss" scoped>
.box-card {
    font-size: 12px;

    // .card-header {
    //     display: flex;
    //     justify-content: center;
    //     color: white;
    //     align-items: center;
    //     padding: 5px 0px;
    //     font-weight: bold;
    // }
    .card-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center
    }
}

.el-card :deep(.el-card__header) {
    padding: 4px 4px 0px 4px;
    background-color: #3f94d0;
}

.el-card :deep(.el-card__body) {
    padding: 8px 0px !important;
}
</style>