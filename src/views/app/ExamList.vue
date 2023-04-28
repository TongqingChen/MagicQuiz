<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="currentSubjectId" @change="onSubjectSelected" size="small">
            <el-radio-button v-for="sub in subjectList.data" :label="sub.id"> {{ sub.name }}({{ sub.count
            }})</el-radio-button>
        </el-radio-group>
    </div>
    <div class="home-card">
        <div v-for="quiz in quizShown.quizList" style="margin: 5px;">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <!-- <img src="../assets/python.svg" style="height:2em" /> -->
                        <span>【{{ quiz.subject_name }}】{{ quiz.name }}</span>
                        <el-button class="button" link type="primary"
                            @click="onStartExamClicked(quiz.id, quiz.name, quiz.subject, quiz.subject_name, quiz.exam_minutes)">开始考试</el-button>
                    </div>
                </template>
                <div class="card-body">
                    <li>选择：{{ quiz.choice_num }}</li>
                    <li>判断：{{ quiz.logic_num }}</li>
                    <li>编程：{{ quiz.coding_num }}</li>
                    <li>时长：{{ quiz.exam_minutes }}分钟</li>
                </div>
            </el-card>
        </div>

    </div>
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
    })
}

onMounted(() => {
    if (store.getters.isValid) {
        subjectList.data = store.getters.getSubjectList
        getQuizList()
    } else {
        Api.getSubjectList().then((res: { data: { results: ConcatArray<{ id: number; name: string; count: number; }>; }; }) => {
            subjectList.data = [{ id: -1, name: '全部', count: 0 }].concat(res.data.results)
            store.commit('setSubjectList', res.data.results)
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
    console.log(currentSubjectId.value)
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
    router.push({
        path: subjectId == 8 ? 'oral_math' : '/exam',
        query: { id: quizId, name: quizName, subjectId: subjectId, subjectName: subjectName, exam_seconds: exam_minutes * 60 }
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
        width: 250px;

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
        background-color: palegoldenrod;
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