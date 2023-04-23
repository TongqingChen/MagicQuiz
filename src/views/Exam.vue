<template>
    <el-container class="layout-container-exam" style="height:600px">
        <el-header
            style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: bold;">
            <span>【{{ examInfo.subjectName }}】{{ examInfo.name }}</span>
            <CountDown style="color: red;" :duration_secs="5" :blink="true" end_text="考试结束" @end_event="onCountDownEnd"></CountDown>
            <el-button type="text" @click="submitQuiz">提交</el-button>
        </el-header>
        <el-container>      
            <el-aside width="170px">
                <el-scrollbar style="height:100%">
                    <div v-for="(qs, idx1) in examInfo.meta" style="margin: 5px;">
                        <el-divider>{{ qs.typeName }}</el-divider>
                        <div class="question-zone">
                            <el-button v-for="(q, idx2) in qs.qList" :type="q.displayType" class="question-button"
                                @click="onQuestionClicked(idx1, idx2)">{{ q.index }}</el-button>
                        </div>
                    </div>
                    <!-- <el-menu @select="onQuestionSelected" collapse-transition>
                    <el-sub-menu v-for="(qs, index1)  in examInfo.meta" :index="qs.typeName">
                        <template #title>
                            <el-icon>
                                <component :is="qs.icon" class="icon" />
                            </el-icon>
                            {{ qs.typeName }}
                        </template>
                        <el-menu-item v-for="(q, index2) in qs.qList" :index="index1 + '_' + index2">
                            第{{q.index}}题[{{ q.id }}]
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu> -->
                </el-scrollbar>
            </el-aside>

            <el-main>
                <!-- <div>
                    <el-radio-group v-model="radio1">
                        <el-radio label="1" size="large">Option A</el-radio>
                        <el-radio label="2" size="large">Option B</el-radio>
                    </el-radio-group>
                </div> -->
                <div style="padding-left: 10px;">
                    <div class="answer" v-if="activeQ.meta.index > 0">【考生答案】{{ activeQ.meta.userAnswer }}</div>
                    <div class="answer" v-if="examInfo.state == 1 && activeQ.meta.index > 0">
                        【正确答案】{{ activeQ.meta.answer }}
                    </div>
                    <el-radio-group v-model="activeQ.answers[0]" v-if="activeQ.meta.type == 0 && examInfo.state == 0"
                        @change="onAnswerSelected">
                        <el-radio label="A" size="large">A</el-radio>
                        <el-radio label="B" size="large">B</el-radio>
                        <el-radio label="C" size="large">C</el-radio>
                        <el-radio label="D" size="large">D</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="activeQ.answers[1]" v-if="activeQ.meta.type == 1 && examInfo.state == 0"
                        @change="onAnswerSelected">
                        <el-radio label="T" size="large">正确</el-radio>
                        <el-radio label="F" size="large">错误</el-radio>
                    </el-radio-group>
                </div>
                <div class="question">
                    <div v-if="activeQ.meta.index > 0" class="title">{{ activeQ.meta.index }}. {{
                        activeQ.meta.title }}</div>
                    <div>{{ activeQ.meta.description }}</div>
                    <el-image v-if="activeQ.meta.image != null" :src="activeQ.meta.image" fit="scale-down" />
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>


<script lang='ts' setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Question, ExamInfo } from '../type/question'
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { Api } from '../request/api';
import CountDown from '../components/CountDown.vue'

const route = useRoute()
const examInfo = reactive(new ExamInfo())

const getQuestionList = () => {
    examInfo.id = Number(route.query.id)
    examInfo.state = 0
    examInfo.name = String(route.query.name)
    examInfo.subjectId = Number(route.query.subjectId)
    examInfo.subjectName = String(route.query.subjectName)

    // examInfo.title = '【Python四级】2022.03'
    Api.getQuestionListByQuizId(examInfo.id).then(res => {
        let questions: Question[] = res.data
        console.log('res.data', res.data)
        examInfo.meta = [{ typeId: 0, typeName: "选择", icon: "Message", qList: [] },
        { typeId: 1, typeName: "判断", icon: "Setttings", qList: [] },
        { typeId: 2, typeName: "编程", icon: "Menu", qList: [] }]
        var i = 0
        questions.forEach(q => {
            examInfo.meta[q.type].qList.push(
                {
                    index: ++i, id: q.id, type: q.type, title: q.title, description: q.description,
                    image: q.image, answer: q.answer, displayType: 'default', userAnswer: '未作答'
                })
        })
    })
}

const onCountDownEnd = ()=>{
    console.log('onCountDownEnd')
}

onMounted(() => {
    getQuestionList()
    console.log(route.query.id)
})

onBeforeRouteLeave((to, from, next) => {
    ElMessageBox.confirm(
        '正在考试中，离开页面数据将会丢失，考试中断！',
        '确认离开吗？',
        {
            confirmButtonText: '继续考试',
            cancelButtonText: '确认离开',
            type: 'warning',
            closeOnPressEscape: false,//按下 ESC 键关闭弹窗
            // closeOnClickModal: false,//点击遮罩关闭弹窗
            distinguishCancelAndClose: true,//区分取消与关闭
        }
    ).then((action) => {
        next(false)
        console.log('action', action)
    }).catch((err) => {
        if (err == 'cancel') {
            next()
        }else{
            next(false)
        }
        
        console.log('err', err)
    })
})

const activeQ = reactive(
    { key: [-1, -1], meta: new Question(), answers: ["", "", ""] }
)
const onQuestionClicked = (i: number, j: number) => {
    let q = examInfo.meta[i].qList[j]
    activeQ.meta = q
    activeQ.key = [i, j];
    activeQ.answers[activeQ.meta.type] = q.userAnswer
}
const onAnswerSelected = () => {
    if (activeQ.key[0] >= 0 && activeQ.key[1] >= 0 && examInfo.state == 0) {
        examInfo.meta[activeQ.key[0]].qList[activeQ.key[1]].userAnswer = activeQ.answers[activeQ.meta.type]
        console.log('examInfo.state', examInfo.state)
        examInfo.meta[activeQ.key[0]].qList[activeQ.key[1]].displayType = 'primary'
    }
}
const submitQuiz = () => {
    ElMessageBox.confirm(
        '确定提交并结束考试吗？',
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        })
        examInfo.meta.forEach(qs => {
            qs.qList.forEach(q => { q.displayType = q.userAnswer == q.answer ? "success" : "danger" })
        })
        examInfo.state = 1
    })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
</script>

<style lang='scss' scoped>
.layout-container-exam {
    .el-divider:deep(.el-divider__text) {
        background-color: transparent;
    }

    .el-divider {
        padding: 0px;
        margin: 16px 0;
    }

    .question-zone {
        display: flex;
        flex-wrap: wrap;
        margin: 2px;
        padding: 0px;
        height: 100%;

        .el-button {
            margin-left: 0px;
            margin-right: 5px;
            margin-bottom: 5px;
            width: 45px;
        }
    }


    .question {
        padding-left: 10px;
        margin: 0px;
        font-size: 14px;
        white-space: pre-wrap;

        .title {
            font-weight: bold;
            // color: darkblue;
            font-size: 14px;
        }
    }

    .answer {
        font-weight: bold;
        color: darkblue;
        font-size: 14px;
    }

    .el-header {
        height: 36px;
        position: relative;
        background-color: var(--el-color-primary-light-7);
        // color: var(--el-text-color-primary);
    }

    .el-aside {
        // color: var(--el-text-color-primary);
        background-color: var(--el-color-primary-light-8);

    }

    .el-radio {
        margin-right: 21px;
        // color: darkblue;
        font-weight: bold;
    }

    .el-main {
        background-color: white;
        padding: 0;
    }
}
</style>