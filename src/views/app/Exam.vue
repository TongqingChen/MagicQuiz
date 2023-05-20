<template>
    <el-container class="layout-container-exam" style="height:100%">
        <el-header>
            <!-- <span>【{{ examInfo.subjectName }}】{{ examInfo.name }}【总分: {{ examInfo.scores }}】</span> -->
            <span>【{{ examInfo.subjectName }}】{{ examInfo.name }}</span>
            <Timer style="color: red;" :start_flag="examInfo.state == ExamState.ONGOING"
                :duration_secs="examInfo.exam_seconds" :blink="blink" 
                start_text='【考试剩余】' @end_event="uploadExamResults">
            </Timer>
            <el-button link type="primary" :disabled="examInfo.state != ExamState.ONGOING"
                @click="submitQuiz">提交</el-button>
        </el-header>
        <el-container>
            <el-aside width="164px">
                <el-scrollbar style="height:100%">
                    <div v-for="qs in examInfo.meta" style="margin: 5px;">
                        <el-divider>{{ qs.typeName }}</el-divider>
                        <div class="question-zone">
                            <el-button v-for="q in qs.qList" :type="q.displayType" class="question-button"
                                @click="onQuestionClicked(q.index)">{{ q.index + 1 }}</el-button>
                        </div>
                    </div>
                </el-scrollbar>
            </el-aside>
            <el-main v-if="activeQ.meta.index >= 0">
                <div style="padding-left: 6px; padding-top: 5px;">
                    <div class="answer">【考生答案】{{ activeQ.meta.userAnswer }} </div>
                    <div class="answer" v-if="examInfo.state == ExamState.FINISHED">
                        【正确答案】{{ activeQ.meta.answer }}
                    </div>
                    <el-text :type="textType" size="small" style="padding-left: 6px;">自动下一题</el-text>
                    <el-switch v-model="autoNext" inline-prompt :active-icon="Check" :inactive-icon="Close" />
                    <el-button-group style="padding-left: 6px;">
                        <el-button :disabled="activeQ.meta.index == 0" type="primary" :icon="ArrowLeft" size="small"
                            @click="onQuestionClicked(activeQ.meta.index - 1)">上一题</el-button>
                        <el-button :disabled="activeQ.meta.index == ijPairs.length - 1" type="primary" size="small"
                            @click="onQuestionClicked(activeQ.meta.index + 1)">下一题<el-icon class="el-icon--right">
                                <ArrowRight />
                            </el-icon></el-button>
                    </el-button-group>
                    <el-radio-group v-model="activeQ.answers[0]"
                        v-if="activeQ.meta.type == QueType.CHOICE && examInfo.state == ExamState.ONGOING"
                        @change="onAnswerSelected">
                        <el-radio label="A" size="small">A</el-radio>
                        <el-radio label="B" size="small">B</el-radio>
                        <el-radio label="C" size="small">C</el-radio>
                        <el-radio label="D" size="small">D</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="activeQ.answers[1]"
                        v-if="activeQ.meta.type == QueType.LOGIC && examInfo.state == ExamState.ONGOING"
                        @change="onAnswerSelected">
                        <el-radio label="T" size="small">正确</el-radio>
                        <el-radio label="F" size="small">错误</el-radio>
                    </el-radio-group>
                </div>
                <div class="question">
                    <div class="title">{{ activeQ.meta.index + 1 }}. ({{ activeQ.meta.score
                    }}分){{ activeQ.meta.title }}</div>
                    <el-image v-if="activeQ.meta.image" :src="activeQ.meta.image" fit="scale-down" />
                    <div>{{ activeQ.meta.description }}</div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>


<script lang='ts' setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Question, ExamInfo, ExamState, QueType } from '@/types/question'
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { Api } from '@/request';
import { IWrongSet, QuizResult } from '@/types/http'
import Timer from '@/components/Timer.vue'
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import { ISettings, SetID } from '@/types/settings';

const route = useRoute()
const blink = ref(true)
const examInfo = reactive(new ExamInfo())

let ijPairs = reactive([[0, 0]])

const autoNext = ref(false)
const textType = computed(() => { return autoNext.value ? "primary" : "default" })

const getQuestionList = () => {
    examInfo.id = Number(route.query.id)
    examInfo.state = ExamState.IDLE
    examInfo.start_time = Date.now()
    examInfo.name = String(route.query.name)
    examInfo.subjectName = String(route.query.sub_name)
    examInfo.exam_seconds = Number(route.query.exam_seconds)
    examInfo.question_num = 0

    if (examInfo.id >= 0) {
        // examInfo.title = '【Python四级】2022.03'
        Api.getQuestionListByQuizId(examInfo.id).then(res => {
            let questions: Question[] = res.data.results
            examInfo.meta = [{ typeId: QueType.CHOICE, typeName: "选择", icon: "Message", qList: [] },
            { typeId: QueType.LOGIC, typeName: "判断", icon: "Setttings", qList: [] },
            { typeId: QueType.CODING, typeName: "编程", icon: "Menu", qList: [] }]
            examInfo.scores = 0
            ijPairs = []
            var i = 0
            questions.forEach(q => {
                ijPairs.push([q.type, examInfo.meta[q.type].qList.length])
                examInfo.meta[q.type].qList.push(
                    {
                        index: i++, id: q.id, type: q.type, title: q.title, description: q.description,
                        image: q.image, answer: q.answer, displayType: 'default', userAnswer: '未作答', score: q.score
                    })
                examInfo.scores += q.score
            })
            examInfo.question_num = questions.length
            examInfo.state = ExamState.ONGOING
        })
    } else { //-1表示错题集
        Api.getWrongSetsMixedBySubName(examInfo.subjectName).then(res => {
            const wrong_set: IWrongSet[] = res.data[examInfo.subjectName]
            const types = ["选择", "判断", "编程"]
            examInfo.meta = [{ typeId: QueType.CHOICE, typeName: types[QueType.CHOICE], icon: "Message", qList: [] },
            { typeId: QueType.LOGIC, typeName: types[QueType.LOGIC], icon: "Setttings", qList: [] },
            { typeId: QueType.CODING, typeName: types[QueType.CODING], icon: "Menu", qList: [] }]
            examInfo.scores = 0
            ijPairs = []
            var i = 0
            wrong_set.forEach(w => {
                var t_id = types.indexOf(w.type)
                ijPairs.push([t_id, examInfo.meta[t_id].qList.length])
                examInfo.meta[t_id].qList.push(
                    {
                        index: i++, id: w.qid, type: t_id, title: w.title, description: w.description,
                        image: w.image, answer: w.answer, displayType: 'default', userAnswer: '未作答', score: w.score
                    })
                examInfo.scores += w.score
            })
            examInfo.question_num = wrong_set.length
            examInfo.state = ExamState.ONGOING
        })
    }
}

onMounted(() => {
    getQuestionList()
    var s: ISettings = Api.loadSettings()
    if (s) {
        blink.value = s.data[SetID.EXAM_TIME_BLINK].value
    }
})

onBeforeRouteLeave((to, from, next) => {
    if (examInfo.state != ExamState.ONGOING) {
        next()
        return
    }
    ElMessageBox.confirm(
        '正在考试中，离开页面数据将会丢失，考试中断！',
        '确认离开吗？',
        {
            confirmButtonText: '继续考试',
            cancelButtonText: '确认离开',
            type: 'warning',
            closeOnPressEscape: false,//按下 ESC 键关闭弹窗
            distinguishCancelAndClose: true,//区分取消与关闭
        }
    ).then((action) => {
        next(false)
    }).catch((err) => {
        if (err == 'cancel') {
            next()
        } else {
            next(false)
        }
    })
})

const activeQ = reactive({ meta: new Question(), answers: ["", "", ""] })
const onQuestionClicked = (index: number) => {
    activeQ.meta = examInfo.meta[ijPairs[index][0]].qList[ijPairs[index][1]]
    activeQ.answers[activeQ.meta.type] = activeQ.meta.userAnswer
}
const onAnswerSelected = () => {
    if (activeQ.meta.index >= 0 && examInfo.state == ExamState.ONGOING) {
        var i = ijPairs[activeQ.meta.index][0]
        var j = ijPairs[activeQ.meta.index][1]
        examInfo.meta[i].qList[j].userAnswer = activeQ.answers[activeQ.meta.type]
        examInfo.meta[i].qList[j].displayType = 'primary'
        if (autoNext.value && activeQ.meta.index < examInfo.question_num - 1) {
            onQuestionClicked(activeQ.meta.index + 1)
        }
    }
}

const uploadExamResults = async () => {
    examInfo.state = ExamState.FINISHED
    var user_id = Api.loadUserIdFromStorage()
    var results = new QuizResult()
    var total_score = 0
    var correct_count = [0, 0, 0]
    examInfo.meta.forEach(qs => {
        qs.qList.forEach(q => {
            q.displayType = q.userAnswer == q.answer ? "success" : "danger"
            if (q.userAnswer == q.answer) {
                results.meta.abs_score += q.score
                correct_count[q.type]++
            }
            if (q.type != QueType.CODING) {
                total_score += q.score
                results.questions.push({
                    "user": user_id, "question": q.id,
                    "user_answer": q.userAnswer, "is_correct": (q.userAnswer == q.answer)
                })
            }
        })
    })
    results.meta.note = `选择: ${correct_count[QueType.CHOICE]}/${examInfo.meta[QueType.CHOICE].qList.length}, 判断: ${correct_count[QueType.LOGIC]}/${examInfo.meta[QueType.LOGIC].qList.length}`
    results.meta.user = user_id
    results.meta.quiz = examInfo.id
    results.meta.rel_score = Math.round(results.meta.abs_score * 100 / total_score)
    results.meta.use_minutes = Math.round((Date.now() - examInfo.start_time) / 1000 / 60)
    await Api.postQuestionsResult(results.questions)
    if (examInfo.id >= 0) { //错题集不提交考试记录
        await Api.postQuizResult(results.meta)
    }
    ElMessage.success('考试提交成功!')
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
        uploadExamResults()
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
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: bold;
    }

    .el-aside {
        // color: var(--el-text-color-primary);
        background-color: var(--el-color-primary-light-8);
    }

    .el-radio {
        margin-left: 16px;
        margin-right: 0px;
        margin-top: 0%;
        // color: darkblue;
        font-weight: bold;
    }

    // .el-button--primary.is-active,
    // .el-button--primary:active {
    //     background: rgb(230, 162, 60);
    //     border-color: rgb(230, 162, 60);
    //     color: #fff;
    // }

    .el-button--primary:focus {
        background-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
        // color: #fff;
    }

    // .el-button--primary:hover {
    //     background-color:chocolate;
    //     // border-color: rgb(230, 162, 60);
    //     color: #fff;
    // }

    .el-main {
        background-color: white;
        padding: 0;
        height: calc(100vh - 100px);
    }
}
</style>