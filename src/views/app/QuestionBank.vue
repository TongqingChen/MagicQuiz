<template>
    <div class="subject">
        试卷：
        <el-cascader v-model="qid" size="small" :options="options" @change="changeValue" style="width:220px" />
        题型：
        <el-radio-group v-model="currType" size="small">
            <el-radio-button v-for="(val, index) in qTypes" :label="index"> {{ val }}</el-radio-button>
        </el-radio-group>
    </div>
    <el-table :data="qListDisplay" style="width: 100%; font-size: 12px;" stripe border v-loading="loading">
        <el-table-column fixed type='index' width="32px" />
        <el-table-column label="题型" width="40px">
            <template #default="scope">{{ qTypes[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column prop="title" label="题目" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="难度" width="40px">
            <template #default="scope">{{ qDifficulty[scope.row.difficulty_level] }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button link type="primary" size="small" @click="questionSelected(scope.$index)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <QuestionDialog :visible="detailsVisible" :header="currQ.header" :title="currQ.title" :image="currQ.image"
        :description="currQ.description" :analysis="currQ.analysis" :answer="currQ.answer" :userAnswer="null"
        @close="detailsVisible = false">
    </QuestionDialog>
</template>

<script lang="ts" setup>
import { Api } from '@/request';
import { computed, onMounted, reactive, ref } from 'vue';
import { IQuestion } from '@/types/question';
import QuestionDialog from '@/views/app/QuestionDialog.vue'

interface IQuizTitle {
    value: number,
    label: string,
}
interface ISubjectTitle {
    value: number,
    label: string,
    children: IQuizTitle[]
}

const qTypes = ['单选', '判断', '编程']
const qDifficulty = ['简单', '一般', '困难']
let options: ISubjectTitle[] = reactive([])
const currType = ref(0)
let qList: IQuestion[] = reactive([])
const qListDisplay = computed(() => {
    return qList.filter(q => { return q.type == currType.value })
})
let currQ: { header: string, title: string, description: string, image: string | null, analysis: string, answer: string } = reactive({
    header: '',
    title: '',
    description: '',
    image: '',
    analysis: '',
    answer: ''
})
let qid = reactive([0, 0])
const detailsVisible = ref(false)
const loading = ref(false)
const questionSelected = (idx: number) => {
    currQ.title = qListDisplay.value[idx].title
    currQ.description = qListDisplay.value[idx].description
    currQ.image = qListDisplay.value[idx].image
    currQ.analysis = qListDisplay.value[idx].analysis
    currQ.answer = qListDisplay.value[idx].answer
    detailsVisible.value = true
}
const changeValue = (v: any) => {
    loading.value = true
    var sub = options.find(s => s.value == v[0])
    if (sub) {
        currQ.header = `【${sub.label}】`
        var quiz = sub.children.find(q => q.value == v[1])
        quiz && (currQ.header += quiz.label)
    }
    qList.splice(0, qList.length)
    Api.getQuestionListByQuizId(v[1]).then(res => {
        var i = 1
        res.data.results.forEach((d: IQuestion) => {
            qList.push({
                index: i++, id: d.id, type: d.type, title: d.title,
                description: d.description, image: d.image, analysis: d.analysis,
                difficulty_level: d.difficulty_level, score: d.score, answer: d.answer
            })
        })
        loading.value = false
    })
}

onMounted(async () => {
    await Api.getSubjectList().then(res => {
        res.data.forEach((d: { id: any; name: any; }) => {
            d.id != 3 && options.push({
                value: d.id, label: d.name, children: []
            })
        });
    })
    await Api.getQuizList().then(res => {
        res.data.forEach((d: { subject: number; id: number; name: any; }) => {
            var q = options.find(t => t.value == d.subject)
            q && q.children.push({ value: d.id, label: d.name })
        })
        options = options.filter(op=>op.children.length>0)
        if (options.length > 0 && options[0].children.length > 0) {
            qid[0] = options[0].value
            qid[1] = options[0].children[0].value
            changeValue(qid)
        }
    })
})
</script>

<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    width: 100%;
}

.el-table:deep(.cell) {
    padding: 0 4px;
}
</style>