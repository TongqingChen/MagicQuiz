<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="quizPages.subject.id" @change="onSubjectSelected" size="small">
            <el-radio-button v-for="sub in subjectList" :label="sub.id">
                {{ sub.name }}({{ sub.count }})</el-radio-button>
        </el-radio-group>
    </div>

    <el-row :gutter="20" class="home-card">
        <el-col v-for="quiz in quizShown" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-card shadow="hover" class="box-card"
                @click.native="onStartExamClicked(quiz.id, quiz.name, quiz.exam_minutes)">
                <template #header>
                    <div class="card-header">
                        <span>【{{ quizPages.subject.name }}】{{ quiz.name }}</span>
                    </div>
                </template>
                <div class="card-body" :style="cardBodyStyle()">
                    <ol>
                        <li v-if="!isOralMath">{{ "选择题数" }}：{{ quiz.choice_num }}</li>
                        <li v-if="!isOralMath">{{ "判断题数" }}：{{ quiz.logic_num }}</li>
                        <li v-if="!isOralMath">{{ "编程题数" }}：{{ quiz.coding_num }}</li>
                        <li v-if="!isOralMath">考试时长：{{ quiz.exam_minutes }}分钟</li>
                        <li v-else>点击【开始考试】配置</li>
                        <li>最近考试：{{ quiz.last_exam_time }}</li>
                    </ol>
                </div>
            </el-card>
        </el-col>
    </el-row>

    <div class="pagination-block" v-if="quizPages.subject.count > quizPages.pageSize">
        <el-pagination background :page-size="quizPages.pageSize" :total="quizPages.quizNum" layout="prev, pager, next"
            @current-change="onPageChanged"></el-pagination>
    </div>
    <el-dialog v-model="showDialog" title="选择题目数量" width="80%" center>
        <el-form label-position="right" :label-width="200">
            <el-form-item v-for="q in (isOralMath ? oralMathConfig : randomQuiz)" :label="q.label">
                <el-slider v-model="q.val" show-input size="small" show-stops :min="q.min" :max="q.max" :step="q.step" />
            </el-form-item>
            <el-form-item label="操作">
                <el-button type="primary" @click="onRandomQuiz">开始考试</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-affix v-if="quizPages.subject.id >= 0" position="bottom" :offset="20">
        <el-tooltip placement="right" content="随机考试">
            <el-button type="success" :icon="Edit" circle @click="showDialog = true" />
        </el-tooltip>
    </el-affix>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { QuizPages } from '@/types/quiz'
import { Api } from '@/request/index'

import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { ISubject } from '@/types/subject';

const router = useRouter()

const isOralMath = computed(() => {
    return (quizPages.subject.id == 3)
})
const currentQuizId = ref(-1)

let subjectList: ISubject[] = reactive([])
const quizPages = reactive(new QuizPages())
const showDialog = ref(false)
const randomQuiz = reactive([
    { label: '选择', val: 15, min: 5, max: 100, step: 5 },
    { label: '判断', val: 10, min: 5, max: 100, step: 5 },
    { label: '编程', val: 2, min: 0, max: 20, step: 1 },
    { label: '时长(分钟)', val: 60, min: 10, max: 120, step: 10 }
])
const oralMathConfig = reactive([
    { label: '加数个数', val: 3, min: 2, max: 5, step: 1 },
    { label: '加数最大值', val: 30, min: 10, max: 100, step: 10 },
    { label: '题目个数', val: 50, min: 20, max: 100, step: 10 },
    { label: '时长(分钟)', val: 10, min: 5, max: 30, step: 5 }
])

const getQuizList = () => {
    quizPages.currentPage = 1
    Api.getQuizList().then((res: { data: [] }) => {
        quizPages.quizList = res.data
        quizPages.quizNum = quizPages.quizList.length
        quizPages.quizList.forEach(q => {
            var s = subjectList.find(s => s.id == q.subject)
            s && s.count++
        })
        quizPages.quizDisplay = quizPages.quizList
        subjectList = subjectList.filter(s => s.count > 0)
        subjectList.length > 0 && (quizPages.subject.id = subjectList[0].id)
        onSubjectSelected()
    })
}

const cardBodyStyle = () => {
    const colors = ['#c6e2ff', 'wheat', '#48F4DB']
    var idx = subjectList.findIndex(v => v.id == quizPages.subject.id)
    return {
        'background-color': colors[idx % colors.length],
    }
}

onMounted(async () => {
    await Api.getSubjectList().then(async (res: { data: ISubject[] }) => {
        subjectList = res.data
        subjectList.forEach(s => s.count = 0)
        getQuizList()
    })
})

const onSubjectSelected = () => {
    quizPages.quizDisplay = quizPages.quizList.filter(q => {
        return q.subject == quizPages.subject.id
    })
    quizPages.quizNum = quizPages.quizDisplay.length
    var s = subjectList.find(s => s.id == quizPages.subject.id)
    if (s) {
        quizPages.subject.name = s.name
        quizPages.subject.logo = s.logo
        quizPages.subject.count = s.count
    }
}
const quizShown = computed(() => {
    return quizPages.quizDisplay.slice((quizPages.currentPage - 1) * quizPages.pageSize, quizPages.currentPage * quizPages.pageSize)
})
const onPageChanged = (page: number) => (
    quizPages.currentPage = page
)

const onRandomQuiz = () => {
    showDialog.value = false
    if (isOralMath.value) {
        router.push({
            path: '/oral_math',
            query: {
                id: currentQuizId.value, name: '数学口算', digital_num: oralMathConfig[0].val,
                max_digital: oralMathConfig[1].val, q_num: oralMathConfig[2].val,
                exam_seconds: oralMathConfig[3].val * 60
            }
        })
        return
    }
    router.push({
        path: '/exam',
        query: {
            id: -2, name: '随机测试', sub_name: quizPages.subject.name,
            choice_num: randomQuiz[0].val, logic_num: randomQuiz[1].val,
            coding_num: randomQuiz[2].val, exam_seconds: randomQuiz[3].val * 60
        }
    })
}

const onStartExamClicked = (quizId: number, quizName: string, exam_minutes: number) => {
    if (isOralMath.value) {
        currentQuizId.value = quizId
        showDialog.value = true
        return
    }
    ElMessageBox.confirm(
        `开始【${quizPages.subject.name}《${quizName}》】(${exam_minutes}分钟)考试吗？`,
        '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }
    ).then(() => {
        router.push({
            path: '/exam',
            query: {
                id: quizId, name: quizName, sub_name: quizPages.subject.name,
                exam_seconds: exam_minutes * 60
            }
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

.home-card {
    display: flex;
    flex-wrap: wrap;

    .button {
        font-size: 12px;
        font-weight: bold;
    }

    .box-card {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0px;
        }

        .card-body {
            height: 90px;
            padding: 20px;
            color: darkcyan;
        }
    }

    .el-card :deep(.el-card__header) {
        padding: 1px 8px;
        color: white;
        background-color: #3f94d0;
    }

    .el-card :deep(.el-card__body) {
        padding: 0px;
    }

    .el-card:hover {
        margin-top: -2px;
        margin-bottom: 2px;
        cursor: pointer;
    }
}

.pagination-block {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 10px;
    justify-content: center;
}
</style>

<style lang="scss">
.roll-dialog {
    margin-top: 5vh;
    margin-bottom: 5vh;
    height: 90vh;

    .el-dialog__header {
        display: none;
    }

    .dialog-content {
        max-height: calc(90vh - 20px) !important;
    }

    .el-dialog__body {
        padding: 10px;
        overflow-y: auto;
    }
}
</style>