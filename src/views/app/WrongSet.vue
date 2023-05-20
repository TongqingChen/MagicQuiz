<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="currentInfo.subject" size="small">
            <el-radio-button v-for="(val, key) in wrongSets" :label="key"> {{ key }}({{ val.length }})</el-radio-button>
        </el-radio-group>
    </div>
    <el-table :data="wrongSets[currentInfo.subject]" stripe border
        style="width: 100%; color:darkslategray; font-size: 13px;">
        <el-table-column fixed type='index' width="32px" />
        <el-table-column prop="quiz_name" label="试卷名" width="72px" sortable />
        <el-table-column prop="type" label="题型" width="60px" sortable />
        <el-table-column prop="title" label="题目" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="level" label="难度" width="60px" sortable />
        <el-table-column prop="record_times" label="次数" width="60px" sortable />
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button link type="primary" size="small" @click="onDetailsClicked(scope.$index)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-affix v-if="currentInfo.subject.length > 0" position="bottom" :offset="20">
        <el-tooltip placement="right" content="错题考试">
            <el-button type="primary" :icon="Edit" circle @click="startExamInWrongSet" />
        </el-tooltip>
    </el-affix>
    <el-drawer v-model="currentInfo.drawerVisible" :with-header="false" direction="ltr" size="64%"
        @open="showAnswer = false">
        <div class="question">
            <div style="color: darkblue;">【{{ currentInfo.subject }}】【{{ currentInfo.q.quiz_name }}】{{ currentInfo.q.title }}
            </div>
            <el-image v-if="currentInfo.q.image != ''" :src="currentInfo.q.image" fit="scale-down" />
            <div>{{ currentInfo.q.description }}</div>
            <el-button type="primary" @click="() => showAnswer = true">显示答案</el-button>
            <div v-if="showAnswer">
                <div>【考生答案】<el-tag type='error' size="large" effect="dark" round> {{ currentInfo.q.user_answer }}</el-tag>
                </div>
                <div>【正确答案】<el-tag type='success' size="large" effect="dark" round> {{ currentInfo.q.answer }}</el-tag>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>
import { Api } from '@/request/index';
import { onMounted, reactive, ref } from 'vue';
import { IWrongSet, WrongSet } from '@/types/http';
import { Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()
const showAnswer = ref(false)

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
    Api.getWrongSetsMixedBySubName().then(res => {
        var keys = Object.keys(res.data)
        keys.forEach(key => {
            if (res.data[key].length > 0) {
                wrongSets[key] = res.data[key]
                currentInfo.subject = key
            }
        })
    })
})
const startExamInWrongSet = () => {
    const exam_minutes = 60
    ElMessageBox.confirm(
        `开始【${currentInfo.subject}《错题集》】(${exam_minutes}分钟)考试吗？`,
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        router.push({
            path: '/exam',
            query: { id: -1, name: '错题集', sub_name: currentInfo.subject, exam_seconds: exam_minutes * 60 }
        })
    })
}
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