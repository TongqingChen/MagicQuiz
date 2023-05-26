<template>
    <el-timeline>
        <el-timeline-item v-for="(evt, index) in greatEvents" :key="index" type="success" size="large" :hollow="true"
            :timestamp="evt.date" placement="top">
            <el-card>
                <template #header>
                    <el-tag type="success" effect="dark" round>{{ evt.name }}</el-tag>
                    <el-divider direction="vertical" />
                    <el-text type="primary" size="small">{{ evt.description }}</el-text>
                </template>
                <img v-if="evt.image" :src="evt.image" class="image" />
                <el-text v-else type="info" size="small">{{ evt.description }}</el-text>
            </el-card>
        </el-timeline-item>
    </el-timeline>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { IGreatEvent } from '@/types/habbit'
import { Api } from '@/request'

let greatEvents: IGreatEvent[] = reactive([])

onMounted(() => {
    Api.getGreatEvents().then(res => {
        greatEvents.splice(0, greatEvents.length)
        res.data.results.forEach((r: { user: any; name: any; description: any; image: any; date: any; }) => greatEvents.push({
            user: r.user,
            name: r.name,
            description: r.description,
            image: r.image,
            date: r.date
        }))
    })
})
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