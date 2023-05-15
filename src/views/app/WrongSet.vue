<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="currentInfo.subject" size="small">
            <el-radio-button v-for="(val, key) in wrongSets" :label="key"> {{ key }}({{ val.length }})</el-radio-button>
        </el-radio-group>
    </div>
    <el-table :data="wrongSets[currentInfo.subject]" stripe border
    style="width: 100%; color:darkslategray; font-size: 13px;">
        <el-table-column fixed type='index' width="32px"/>
        <el-table-column prop="quiz_name" label="试卷名" width="72px" sortable/>
        <el-table-column prop="type" label="题型" width="60px" sortable/>
        <el-table-column prop="title" label="题目" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="level" label="难度" width="60px" sortable/>
        <el-table-column prop="record_times" label="次数" width="60px" sortable/>
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button link type="primary" size="small" @click="onDetailsClicked(scope.$index)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-drawer v-model="currentInfo.drawerVisible" :with-header="false" direction="ltr" size="75%">
        <div class="question">
            <div style="color: darkblue;">{{ currentInfo.q.title }}</div>
            <el-image v-if="currentInfo.q.image != ''" :src="currentInfo.q.image" fit="scale-down" />
            <div>{{ currentInfo.q.description }}</div>
            <div style="color: darkblue; font-weight: bold;">【正确答案】{{ currentInfo.q.answer }}</div>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>
import { Api } from '@/request/index';
import { onMounted, reactive } from 'vue';
import { IWrongSet, WrongSet } from '@/types/http';


var wrongSets: { [key: string]: IWrongSet[] } = reactive(
    {}
)

const currentInfo: { subject: string, drawerVisible: boolean, q: IWrongSet } = reactive({
    subject: '',
    drawerVisible: false,
    q: new WrongSet()
})
const onDetailsClicked = (index: number) => {
    currentInfo.q = wrongSets[currentInfo.subject][index]
    currentInfo.drawerVisible = true;
}
onMounted(() => {
    // Api.getSubjectList().then(res => {
    //     console.log('sssss', res.data.results)
    //     appInfo.subjectList = res.data.results
    // })
    Api.getWrongSetsMixed(2, -1).then(res => {
        var keys = Object.keys(res.data)
        keys.forEach(key => wrongSets[key] = res.data[key])
        currentInfo.subject = keys[0]
    })
})
</script>

<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
}

.question {
    font-size: 14px;
    white-space: pre-wrap;
}

.el-table:deep(.cell) {
    padding: 0 4px;
}
</style>