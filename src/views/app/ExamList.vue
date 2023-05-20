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
                        <el-button class="button" link type="success"
                            @click="onStartExamClicked(quiz.id, quiz.name, quiz.subject, quiz.subject_name, quiz.exam_minutes)">开始考试</el-button>
                    </div>
                </template>
                <div class="card-body">
                    <li>{{ quiz.subject == 3 ? "最大数" : "选择题数" }}：{{ quiz.choice_num }}</li>
                    <li>{{ quiz.subject == 3 ? "加数个数" : "判断题数" }}：{{ quiz.logic_num }}</li>
                    <li>{{ quiz.subject == 3 ? "题目数" : "编程题数" }}：{{ quiz.coding_num }}</li>
                    <li>考试时长：{{ quiz.exam_minutes }}分钟</li>
                </div>
            </el-card>
        </el-col>
    </el-row>

    <div class="pagination-block">
        <el-pagination background :page-size="quizPages.pageSize" :total="quizPages.quizNum" layout="prev, pager, next"
            @current-change="onPageChanged"></el-pagination>
    </div>        
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { QuizPages } from '@/types/quiz'
import { computed } from '@vue/reactivity';
import { Api } from '@/request/index'

import { SubjectList } from '@/types/subject'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import ExamDialog from './ExamDialog.vue';

const store = useStore()
const router = useRouter()

const currentSubjectId = ref(-1)

const subjectList = reactive(new SubjectList())
const quizPages = reactive(new QuizPages())



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
            q.subject_name = store.getters.getSubjectNameById(q.subject)
        })
        subjectList.data[0].count = quizPages.quizNum
        subjectList.data = subjectList.data.filter(s => s.count > 0)
    })
}

onMounted(() => {
    if (store.getters.isValid) {
        subjectList.data = store.getters.getSubjectList
        getQuizList()
    } else {
        Api.getSubjectList().then((res: { data: { results: [] }; }) => {
            subjectList.data = [{ id: -1, name: '全部', count: 0 }].concat(res.data.results)
            store.commit('setSubjectList', subjectList.data)
            getQuizList()
        })
    }
}
)
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

const onStartExamClicked = (quizId: number, quizName: string, subjectId: number, subjectName: string, exam_minutes: number) => {
    ElMessageBox.confirm(
        `开始【${subjectName}《${quizName}》】(${exam_minutes}分钟)考试吗？`,
        '请确认',
        {
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
        // width: 250px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0px;
        }

        .card-body {
            height: 80px;
            padding: 20px;
            color: darkcyan;
            // background-image: url('@/assets/python.svg');
            // background-size: 100% 100%;
        }
    }

    .el-card :deep(.el-card__header) {
        padding: 1px 8px;
        color: white;
        background-color: #3f94d0;
    }

    .el-card :deep(.el-card__body) {
        padding: 0px;
        background-color: powderblue;
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
    .dialog-content{
        max-height: calc(90vh - 20px)!important;
    }
    .el-dialog__body {
        padding: 10px;
        // min-height: 100px;
        overflow-y: auto;
    }
}


// :deep(.el-dialog) {
// position: relative;
// margin-top: 10px !important;
// background: #FFFFFF;
// border-radius: 2px;
// -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
// box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
// -webkit-box-sizing: border-box;
// box-sizing: border-box;
// width: 50%;
// height: 60%;
</style>