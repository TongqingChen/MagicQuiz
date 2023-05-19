<template>
    <el-tooltip :content="description" placement="top" :disabled="!(description && description.length > 0)">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ title }}</span>
                </div>
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
    return {
        days: isNaN(days) ? '--' : Math.abs(days),
        color: days >= 0 ? 'darkblue' : 'gray',
        label: isNaN(days) ? '' : (days == 0 ? '天' : (days > 0 ? '天后' : '天前'))
    }
})
const props = defineProps(["date", "title", "description"])
</script>

<style lang="scss" scoped>
.box-card {
    font-size: 12px;
    // font-weight: bold;
    // margin-bottom: 0px;
    // width: 250px;

    .card-header {
        display: flex;
        justify-content: center;
        color: white;
        align-items: center;
        padding: 5px 0px;
        font-weight: bold;
    }

    .card-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center
    }
}

.el-card :deep(.el-card__header) {
    padding: 0px 8px;
    background-color: #3f94d0;
}

.el-card :deep(.el-card__body) {
    padding: 8px 0px !important;
}
</style>