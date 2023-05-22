<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="currentSubjectId" @change="onSubjectSelected" size="small">
            <el-radio-button v-for="sub in subjectList.data" :label="sub.id"> {{ sub.name }}({{ sub.count
            }})</el-radio-button>
        </el-radio-group>
    </div>

    <el-row :gutter="20" class="home-card">
        <el-col v-for="quiz in quizShown.quizList" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>【{{ quiz.subject_name }}】{{ quiz.name }}</span>
                        <el-button class="button" :icon="Edit" link type="success"
                            @click="onStartExamClicked(quiz.id, quiz.name, quiz.subject, quiz.subject_name, quiz.exam_minutes)">开始考试</el-button>
                    </div>
                </template>
                <div class="card-body">
                    <li>{{ quiz.subject == 3 ? "最大数" : "选择题数" }}：{{ quiz.choice_num }}</li>
                    <li>{{ quiz.subject == 3 ? "加数个数" : "判断题数" }}：{{ quiz.logic_num }}</li>
                    <li>{{ quiz.subject == 3 ? "题目数" : "编程题数" }}：{{ quiz.coding_num }}</li>
                    <li>考试时长：{{ quiz.exam_minutes }}分钟</li>
                    <li>最新考试：{{ quiz.last_exam_time }}</li>
                </div>
            </el-card>
        </el-col>
    </el-row>

    <div class="pagination-block">
        <el-pagination background :page-size="quizPages.pageSize" :total="quizPages.quizNum" layout="prev, pager, next"
            @current-change="onPageChanged"></el-pagination>
    </div>
    <el-dialog v-model="showDialog" title="选择题目数量" width="80%" center>
        <el-form label-position="right" :label-width="200">
            <el-form-item v-for="q in randomQuiz" :label="q.label">
                <el-slider v-model="q.num" show-input size="small" />
            </el-form-item>
            <el-form-item label="操作">
                <el-button type="primary" @click="onRandomQuiz">开始考试</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-affix v-if="currentSubjectId != -1 && currentSubjectId != 3" position="bottom" :offset="20">
        <el-tooltip placement="right" content="随机考试">
            <el-button type="success" :icon="Edit" circle @click="showDialog = true" />
        </el-tooltip>
    </el-affix>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { QuizPages } from '@/types/quiz'
import { computed } from '@vue/reactivity';
import { Api } from '@/request/index'

import { SubjectList } from '@/types/subject'
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';

const router = useRouter()

const currentSubjectId = ref(-1)

const subjectList = reactive(new SubjectList())
const quizPages = reactive(new QuizPages())
const showDialog = ref(false)
const randomQuiz = reactive([
    { label: '选择', num: 15 },
    { label: '判断', num: 10 },
    { label: '编程', num: 2 },
    { label: '时长(分钟)', num: 60 }
])

const getSubjectNameById = (id: number) => {
    var sub = subjectList.data.find(s => { return s.id == id })
    if (!sub) {
        return null
    }
    return sub.name
}

const getQuizList = () => {
    quizPages.currentPage = 1
    quizPages.subject = { id: 0, name: "Python四级", count: 0 }
    Api.getQuizList().then((res: { data: { results: any; }; }) => {
        quizPages.quizList = res.data.results
        quizPages.quizNum = quizPages.quizList.length
        quizPages.quizDisplay = quizPages.quizList
        subjectList.data.forEach((s: { count: number; }) => { s.count = 0 })
        quizPages.quizList.forEach((q: { subject: any; subject_name: any; }) => {
            for (var i = 1; i < subjectList.data.length; i++) {
                if (q.subject == subjectList.data[i].id) {
                    subjectList.data[i].count++;
                }
            }
            q.subject_name = getSubjectNameById(q.subject)
        })
        subjectList.data[0].count = quizPages.quizNum
        subjectList.data = subjectList.data.filter(s => s.count > 0)
    })
}

onMounted(() => {
    Api.getSubjectList().then((res: { data: { results: [] }; }) => {
        subjectList.data = [{ id: -1, name: '全部', count: 0 }].concat(res.data.results)
        getQuizList()
    })
})

const onSubjectSelected = () => {
    quizPages.quizDisplay = quizPages.quizList.filter((value: { subject: number; }) => {
        return (currentSubjectId.value == -1) ? true : value.subject == currentSubjectId.value
    })
    quizPages.quizNum = quizPages.quizDisplay.length
}
const quizShown = reactive({
    quizList: computed(() => {
        return quizPages.quizDisplay.slice((quizPages.currentPage - 1) * quizPages.pageSize, quizPages.currentPage * quizPages.pageSize)
    })
})
const onPageChanged = (page: number) => (
    quizPages.currentPage = page
)

const onRandomQuiz = () => {
    showDialog.value = false
    var sub_name = getSubjectNameById(currentSubjectId.value)
    if (!sub_name) {
        return
    }
    router.push({
        path: '/exam',
        query: {
            id: -2, name: '随机测试', sub_name: sub_name,
            choice_num: randomQuiz[0].num, logic_num: randomQuiz[1].num,
            coding_num: randomQuiz[2].num, exam_seconds: randomQuiz[3].num * 60
        }
    })
}

const onStartExamClicked = (quizId: number, quizName: string, subjectId: number, subjectName: string, exam_minutes: number) => {
    ElMessageBox.confirm(
        `开始【${subjectName}《${quizName}》】(${exam_minutes}分钟)考试吗？`,
        '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }
    ).then(() => {
        router.push({
            path: subjectId == 3 ? 'oral_math' : '/exam',
            query: { id: quizId, name: quizName, sub_name: subjectName, exam_seconds: exam_minutes * 60 }
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
            height: 96px;
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
        background-color: #c6e2ff;
    }

    .el-card:hover {
        margin-top: -5px;
        margin-bottom: 5px;
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