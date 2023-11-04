<template>
    <el-timeline>
        <el-timeline-item
            v-for="(evt, index) in greatEvents"
            :key="index"
            type="success"
            size="large"
            :hollow="true"
            :timestamp="evt.date"
            placement="top"
        >
            <el-card>
                <template #header>
                    <el-tag type="success" effect="dark" round>{{
                        evt.name
                    }}</el-tag>
                    <el-divider direction="vertical" />
                    <el-text type="primary" size="small">{{
                        evt.description
                    }}</el-text>
                </template>
                <el-image
                    v-if="evt.image"
                    :src="evt.image"
                    :preview-src-list="[evt.image]"
                    class="image"
                />
                <el-text v-else type="info" size="small">{{
                    evt.description
                }}</el-text>
            </el-card>
        </el-timeline-item>
    </el-timeline>
    <el-dialog v-model="showDialog" title="添加大事记" width="80%" center>
        <el-form label-position="right" :label-width="200">
            <el-form-item label="事件名称">
                <el-input
                    v-model="greatEvent.name"
                    placeholder="Please input"
                    clearable
                />
            </el-form-item>
            <el-form-item label="事件时间">
                <el-input
                    v-model="greatEvent.date"
                    type="date"
                    placeholder=""
                />
            </el-form-item>
            <el-form-item label="操作">
                <el-button type="primary" @click="">添加</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-affix position="bottom" :offset="20">
        <el-tooltip placement="right" content="添加大事件">
            <el-button type="success" :icon="Plus" circle @click="" />
        </el-tooltip>
    </el-affix>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { IGreatEvent, GreatEvent } from '@/types/habbit';
import { Api } from '@/request';
import { Plus } from '@element-plus/icons-vue';

let greatEvents: IGreatEvent[] = reactive([]);
// 未完成
let greatEvent = reactive(new GreatEvent());
const showDialog = ref(false);
onMounted(() => {
    Api.getGreatEvents().then((res) => {
        greatEvents.splice(0, greatEvents.length);
        res.data.results.forEach((r: IGreatEvent) =>
            greatEvents.push({
                user: r.user,
                name: r.name,
                description: r.description,
                image: r.image,
                date: r.date,
            })
        );
    });
});
</script>

<style lang="scss" scoped>
.image {
    height: 180px;
    width: fit-content;
    display: block;
}

.el-card :deep(.el-card__header) {
    padding: 4px 8px;
    // color: white;
    // background-color: #3f94d0;
    // background-color:lightcyan;
}

.el-card :deep(.el-card__body) {
    padding: 8px 8px;
    // color: white;
    // background-color: #3f94d0;
    // background-color:lightcyan;
}
</style>
