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
                        <el-button class="button" type="text"
                            @click="onStartExamClicked(quiz.id, quiz.name, quiz.subject, quiz.subject_name)">开始考试</el-button>
                    </div>
                </template>
                <div class="card-body">
                    <li>选择：{{ quiz.choice_num }}</li>
                    <li>判断：{{ quiz.logic_num }}</li>
                    <li>编程：{{ quiz.coding_num }}</li>
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
import { QuizPages } from '../type/quiz'
import { computed } from '@vue/reactivity';
import { Api } from '../request/api'

import { SubjectList } from '../type/subject'

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
    Api.getQuizList().then(res => {
        quizPages.quizList = res.data
        quizPages.quizNum = quizPages.quizList.length
        quizPages.quizDisplay = quizPages.quizList

        subjectList.data.forEach(s => { s.count = 0 })
        quizPages.quizList.forEach(q => {
            for (var i = 1; i < subjectList.data.length; i++) {
                if (q.subject == subjectList.data[i].id) {
                    subjectList.data[i].count++;
                }
            }
            q.subject_name = store.getters.getSubjectNameById(q.subject)
        })
        subjectList.data[0].count = quizPages.quizNum
    })
    // quizPages.quizList = [
    //     { id: 0, name: "2024.03", subject: { id: 0, name: "Python四级" }, choiceNum: 20, yesNoNum: 15, codingNum: 4 },
    //     { id: 1, name: "2022.06", subject: { id: 1, name: "Scratch" }, choiceNum: 10, yesNoNum: 20, codingNum: 4 },
    //     { id: 2, name: "2020.03", subject: { id: 0, name: "Python四级" }, choiceNum: 20, yesNoNum: 15, codingNum: 3 },
    //     { id: 3, name: "2022.03", subject: { id: 1, name: "Scrath" }, choiceNum: 20, yesNoNum: 25, codingNum: 12 },
    //     { id: 4, name: "2022.06", subject: { id: 0, name: "Python四级" }, choiceNum: 20, yesNoNum: 15, codingNum: 4 },
    //     { id: 5, name: "2022.12", subject: { id: 0, name: "Python四级" }, choiceNum: 10, yesNoNum: 25, codingNum: 7 },
    //     { id: 6, name: "2022.03", subject: { id: 0, name: "Python四级" }, choiceNum: 20, yesNoNum: 15, codingNum: 2 },
    //     { id: 7, name: "2023.09", subject: { id: 2, name: "C++" }, choiceNum: 20, yesNoNum: 15, codingNum: 4 },
    //     { id: 8, name: "2022.03", subject: { id: 0, name: "Python四级" }, choiceNum: 10, yesNoNum: 15, codingNum: 4 },
    //     { id: 9, name: "2021.03", subject: { id: 2, name: "C++" }, choiceNum: 20, yesNoNum: 15, codingNum: 4 },
    //     { id: 10, name: "2022.06", subject: { id: 0, name: "Python四级" }, choiceNum: 10, yesNoNum: 15, codingNum: 8 },
    //     { id: 11, name: "2021.03", subject: { id: 0, name: "Python四级" }, choiceNum: 20, yesNoNum: 35, codingNum: 4 },
    //     { id: 12, name: "2022.03", subject: { id: 3, name: "Math口算" }, choiceNum: 20, yesNoNum: 15, codingNum: 4 },
    //     { id: 13, name: "2023.06", subject: { id: 0, name: "Python四级" }, choiceNum: 10, yesNoNum: 15, codingNum: 4 },
    //     { id: 14, name: "2022.03", subject: { id: 3, name: "Math口算" }, choiceNum: 20, yesNoNum: 12, codingNum: 4 },
    //     { id: 15, name: "2022.12", subject: { id: 0, name: "Python四级" }, choiceNum: 10, yesNoNum: 15, codingNum: 9 },
    // ]
    // quizPages.quizNum = quizPages.quizList.length
    // quizPages.quizDisplay = quizPages.quizList

    // for (var i = 1; i < subjectList.length; i++) {
    //     subjectList[i].count = 0
    //     quizPages.quizList.forEach(q => {
    //         if (q.subject.id == subjectList[i].id) {
    //             subjectList[i].count++;
    //         }
    //     })
    //     console.log(subjectList[i].name, subjectList[i].count)
    // }
    // subjectList[0].count = quizPages.quizNum
}

onMounted(() => {
    if (store.getters.isValid) {
        subjectList.data = store.getters.getSubjectList
        getQuizList()
    } else {
        Api.getSubjectList().then(res => {
            console.log('getsubjectlist', res.data)
            subjectList.data = [{ id: -1, name: '全部', count: 0 }].concat(res.data)
            store.commit('setSubjectList', res.data)
            getQuizList()
        })
    }
}
)
const onSubjectSelected = () => {
    quizPages.quizDisplay = quizPages.quizList.filter(value => {
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

const onStartExamClicked = (quizId: number, quizName: string, subjectId: number, subjectName: string) => {
    router.push({
        path: '/exam',
        query: { id: quizId, name: quizName, subjectId: subjectId, subjectName: subjectName }
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
        }

        .card-body {
            height: 60px;
            padding: 20px;
        }

        // flex-wrap: wrap;
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