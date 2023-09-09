<template>
    <el-container class="layout-container-exam" style="height:100%">
        <el-header>
            <!-- <span>【{{ examInfo.subjectName }}】{{ examInfo.name }}【总分: {{ examInfo.scores }}】</span> -->
            <span>【{{ examInfo.subjectName }}】{{ examInfo.name }}</span>
            <!-- <Timer style="color: red;" :start_flag="examInfo.state == ExamState.ONGOING" :count_down="true"
                :duration_secs="examInfo.exam_seconds" :blink="blink" start_text='【考试剩余】' @end_event="uploadExamResults">
            </Timer> -->
            <FlipCounter :seconds="examInfo.exam_seconds" :type="3" :split="blink" :timeUnit="[':', ':', ':']"
                :stop="examInfo.state == ExamState.FINISHED" @timeUp="uploadExamResults" />
            <el-button link type="primary" :disabled="examInfo.state != ExamState.ONGOING"
                @click="submitQuiz">交卷</el-button>
        </el-header>
        <el-container>
            <el-aside width="164px">
                <el-scrollbar style="height:100%">
                    <div v-for="qs in examInfo.meta" style="margin: 5px;">
                        <el-divider v-if="qs.qList.length > 0">{{ qs.typeName }}</el-divider>
                        <div class="question-zone" v-if="qs.qList.length > 0">
                            <el-button v-for="q in qs.qList" :type="q.displayType" @click="onQuestionClicked(q.index)">{{
                                q.doubt ? '❓' : q.index + 1 }} </el-button>
                        </div>
                    </div>
                </el-scrollbar>
            </el-aside>
            <el-main v-if="activeQ.index >= 0">
                <div style="padding-left: 6px; padding-top: 5px;">
                    <div class="user-answer"><el-tag size="small" effect="dark">考生答案</el-tag>{{ activeQ.userAnswer }}
                    </div>
                    <div class="answer" v-if="examInfo.state == ExamState.FINISHED"><el-tag size="small" type="success"
                            effect="dark">正确答案</el-tag>{{ activeQ.answer }}</div>
                    <el-text :type="textType" size="small" style="padding-left: 6px;">自动下题</el-text>
                    <el-switch v-model="autoNext" inline-prompt :active-icon="Check" :inactive-icon="Close" />
                    <el-button-group style="padding-left: 6px;">
                        <el-button
                            :disabled="activeQ.index < 0 || activeQ.index >= ijPairs.length || examInfo.state != ExamState.ONGOING"
                            type="primary" size="small" @click="onDoubtBtnClicked">❓存疑</el-button>
                        <el-button :disabled="activeQ.index == 0" type="primary" :icon="ArrowLeft" size="small"
                            @click="onQuestionClicked(activeQ.index - 1)">上题</el-button>
                        <el-button :disabled="activeQ.index == ijPairs.length - 1" type="primary" size="small"
                            @click="onQuestionClicked(activeQ.index + 1)">下题<el-icon class="el-icon--right">
                                <ArrowRight />
                            </el-icon></el-button>
                    </el-button-group>
                    <el-button v-if="examInfo.state == ExamState.FINISHED" type="success"
                        :icon="activeQ.favourite ? StarFilled : Star" round size="small" @click="onFavouriteClicked"
                        :disabled="activeQ.favourite">收藏</el-button>
                    <div v-if="examInfo.state == ExamState.ONGOING">
                        <el-radio-group v-model="activeQ.userAnswer" v-if="activeQ.type == QueType.CHOICE"
                            @change="onAnswerSelected">
                            <el-radio label="A">A</el-radio>
                            <el-radio label="B">B</el-radio>
                            <el-radio label="C">C</el-radio>
                            <el-radio label="D">D</el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="activeQ.userAnswer" v-if="activeQ.type == QueType.LOGIC"
                            @change="onAnswerSelected">
                            <el-radio label="T">正确</el-radio>
                            <el-radio label="F">错误</el-radio>
                        </el-radio-group>
                        <el-input v-model="activeQ.userAnswer" placeholder="请填入答案，多个答案以英文分号隔开，如: 134;2;abc"
                            v-if="activeQ.type == QueType.BLANK" clearable @blur="onAnswerSelected">
                        </el-input>
                    </div>
                </div>
                <div class="question">
                    <div class="title">{{ activeQ.index + 1 }}. ({{ activeQ.score
                    }}分){{ activeQ.title }}</div>
                    <el-image v-if="activeQ.image" :src="activeQ.image" fit="scale-down" />
                    <div>{{ activeQ.description }}</div>
                </div>
                <div style="padding-left: 6px; padding-top: 5px;" class="answer"
                    v-if="examInfo.state == ExamState.FINISHED"><el-tag size="small" type="success"
                        effect="dark">题目解析</el-tag>{{ activeQ.analysis }}</div>
            </el-main>
        </el-container>
    </el-container>
</template>


<script lang='ts' setup>
import { reactive, onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Question, ExamInfo, ExamState, QueType } from '@/types/question'
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { Api } from '@/request';
import { IWrongSet, QuizResult } from '@/types/http'
// import Timer from '@/components/Timer.vue'
import { ArrowLeft, ArrowRight, Check, Close, Star, StarFilled } from '@element-plus/icons-vue'
import { ISettings, SetID } from '@/types/settings';
import FlipCounter from '@/components/FlipCounter.vue'

const route = useRoute()
const blink = ref(true)
const examInfo = reactive(new ExamInfo())
let qTypes = reactive([])

let ijPairs = reactive([[0, 0]])

const autoNext = ref(true)
const textType = computed(() => { return autoNext.value ? "primary" : "info" })

const getQuestionList = async () => {
    examInfo.id = Number(route.query.id)
    examInfo.state = ExamState.IDLE
    examInfo.start_time = Date.now()
    examInfo.name = String(route.query.name)
    examInfo.subjectName = String(route.query.sub_name)
    examInfo.exam_seconds = Number(route.query.exam_seconds)
    examInfo.question_num = 0

    await Api.getQuestionTypes().then(res => {
        qTypes = res.data
    }).catch(err => {
        ElMessage.error(`获取题型失败!${err}`)
        return
    })
    qTypes.forEach(q => {
        examInfo.meta.push({ typeId: q[0], typeName: q[1], icon: 'Message', qList: [] })
    })
    examInfo.scores = 0
    var i = 0
    ijPairs = []
    if (examInfo.id >= 0) {
        await Api.getQuestionListByQuizId(examInfo.id).then(res => {
            let questions: Question[] = res.data.results
            questions.sort((q1, q2) => { return q1.type - q2.type })
            questions.forEach(q => {
                var t_id = qTypes.findIndex(qt => qt[0] == q.type)
                ijPairs.push([t_id, examInfo.meta[q.type].qList.length])
                examInfo.meta[t_id].qList.push({
                    index: i++, id: q.id, type: q.type, title: q.title, description: q.description,
                    image: q.image, difficulty_level: q.difficulty_level, answer: q.answer, doubt: false,
                    analysis: q.analysis, displayType: 'default', userAnswer: '', score: q.score, favourite: false, copyFrom: () => { }
                })
                examInfo.scores += q.score
            })
            examInfo.question_num = questions.length
            examInfo.state = ExamState.ONGOING
        })
    } else if (examInfo.id == -1) { //-1表示错题集
        await Api.getWrongSetsMixedBySubName(examInfo.subjectName).then(res => {
            const wrong_set: IWrongSet[] = res.data[examInfo.subjectName]
            wrong_set.sort((w1, w2) => { return w1.type_id - w2.type_id })
            wrong_set.forEach(w => {
                var t_id = qTypes.findIndex(qt => qt[0] == w.type_id)
                ijPairs.push([t_id, examInfo.meta[w.type_id].qList.length])
                examInfo.meta[t_id].qList.push({
                    index: i++, id: w.qid, type: w.type_id, title: w.title, description: w.description,
                    image: w.image, difficulty_level: 0, answer: w.answer, doubt: false, analysis: w.analysis,
                    displayType: 'default', userAnswer: '未作答', score: w.score, favourite: false, copyFrom: () => { }
                })
                examInfo.scores += w.score
            })
            examInfo.question_num = wrong_set.length
            examInfo.state = ExamState.ONGOING
        })
    } else if (examInfo.id == -2) { // -2 表示随机考试
        var choice_num = Number(route.query.choice_num)
        var logic_num = Number(route.query.logic_num)
        var blank_num = Number(route.query.blank_num)
        var coding_num = Number(route.query.coding_num)
        await Api.getQuestionListRandom(examInfo.subjectName, [choice_num, logic_num, blank_num, coding_num]).then(res => {
            let questions: Question[] = res.data
            questions.sort((q1, q2) => { return q1.type - q2.type })
            questions.forEach(q => {
                var t_id = qTypes.findIndex(qt => qt[0] == q.type)
                ijPairs.push([t_id, examInfo.meta[q.type].qList.length])
                examInfo.meta[t_id].qList.push({
                    index: i++, id: q.id, type: q.type, title: q.title, description: q.description,
                    image: q.image, difficulty_level: q.difficulty_level, answer: q.answer, doubt: false,
                    analysis: q.analysis, displayType: 'default', userAnswer: '', score: q.score, favourite: false, copyFrom: () => { }
                })
                examInfo.scores += q.score
            })
            examInfo.question_num = questions.length
            examInfo.state = ExamState.ONGOING
        })
    } else if (examInfo.id == -3) { // -3 表示收藏题集
        await Api.getFavouriteSetsBySubName(examInfo.subjectName).then(res => {
            const wrong_set: IWrongSet[] = res.data[examInfo.subjectName]
            wrong_set.sort((w1, w2) => { return w1.type_id - w2.type_id })
            wrong_set.forEach(w => {
                var t_id = qTypes.findIndex(qt => qt[0] == w.type_id)
                ijPairs.push([t_id, examInfo.meta[w.type_id].qList.length])
                examInfo.meta[t_id].qList.push({
                    index: i++, id: w.qid, type: w.type_id, title: w.title, description: w.description,
                    image: w.image, difficulty_level: 0, answer: w.answer, doubt: false, analysis: w.analysis,
                    displayType: 'default', userAnswer: '未作答', score: w.score, favourite: false, copyFrom: () => { }
                })
                examInfo.scores += w.score
            })
            examInfo.question_num = wrong_set.length
            examInfo.state = ExamState.ONGOING
        })
    }
}

onMounted(async () => {
    var s: ISettings = Api.loadSettings()
    if (s) {
        blink.value = s.data[SetID.EXAM_TIME_BLINK].value
    }
    await getQuestionList()
    if (examInfo.question_num > 0) {
        onQuestionClicked(0)
    }
})

onBeforeUnmount(() => {
    examInfo.state = ExamState.FINISHED
})

onBeforeRouteLeave((to, from, next) => {
    if (examInfo.state != ExamState.ONGOING) {
        next()
        return
    }
    ElMessageBox.confirm(
        '正在考试中，离开页面数据将会丢失，考试中断！',
        '确认离开吗？', {
        confirmButtonText: '继续考试',
        cancelButtonText: '确认离开',
        type: 'warning',
        closeOnPressEscape: false,//按下 ESC 键关闭弹窗
        distinguishCancelAndClose: true,//区分取消与关闭
    }
    ).then(() => {
        next(false)
    }).catch((err) => {
        if (err == 'cancel') {
            next()
        } else {
            next(false)
        }
    })
})

let activeQ = reactive(new Question())
const onQuestionClicked = (index: number) => {
    activeQ.copyFrom(examInfo.meta[ijPairs[index][0]].qList[ijPairs[index][1]])
}

const onDoubtBtnClicked = (() => {
    var i = ijPairs[activeQ.index][0]
    var j = ijPairs[activeQ.index][1]
    examInfo.meta[i].qList[j].doubt = !examInfo.meta[i].qList[j].doubt
})
const onAnswerSelected = () => {
    if (activeQ.index >= 0 && examInfo.state == ExamState.ONGOING) {
        var i = ijPairs[activeQ.index][0]
        var j = ijPairs[activeQ.index][1]
        examInfo.meta[i].qList[j].userAnswer = activeQ.userAnswer
        examInfo.meta[i].qList[j].displayType = activeQ.userAnswer.length > 0 ? 'primary' : 'default'
        if (autoNext.value && activeQ.index < examInfo.question_num - 1 && activeQ.userAnswer.length > 0) {
            onQuestionClicked(activeQ.index + 1)
        }
    }
}

const uploadExamResults = async () => {
    examInfo.state = ExamState.FINISHED
    var user_id = Api.loadUserIdFromStorage()
    var results = new QuizResult()
    var total_score = 0
    var correct_count: number[] = []
    var error_count: number[] = []
    qTypes.forEach(q => {
        correct_count.push(0)
        error_count.push(0)
    })
    var i = 0
    examInfo.meta.forEach(qs => {
        qs.qList.forEach(q => {
            q.displayType = q.userAnswer == q.answer ? "success" : "danger"
            if (q.userAnswer == q.answer) {
                results.meta.abs_score += q.score
                correct_count[i]++
            }
            if (q.type != QueType.CODING) {
                total_score += q.score
                results.questions.push({
                    "user": user_id, "question": q.id,
                    "user_answer": q.userAnswer, "is_correct": (q.userAnswer == q.answer)
                })
            }
        })
        error_count[i] = qs.qList.length - correct_count[i]
        i++
    })
    i = 0
    var rsl_str = ''
    qTypes.forEach(q => {
        results.meta.note += `${q[1]}:${correct_count[i]}/${examInfo.meta[i].qList.length},`
        rsl_str += `【${q[1]}】<b>${correct_count[i]}</b> ✅, <b>${error_count[i]}</b> ❌<br/>`
        i++
    })
    results.meta.user = user_id
    results.meta.quiz = examInfo.id
    results.meta.rel_score = Math.round(results.meta.abs_score * 100 / total_score)
    results.meta.use_minutes = Math.max(1, Math.round((Date.now() - examInfo.start_time) / 1000 / 60))
    await Api.postQuestionsResult(results.questions)
    if (examInfo.id >= 0) { //错题集、题库随机考试、收藏集不提交考试记录，仅提交错题记录
        await Api.postQuizResult(results.meta)
    }
    ElMessageBox.alert(`【得分】${results.meta.abs_score}/${total_score}<br/>` +
        (results.meta.abs_score == total_score ? '【信息】恭喜您获得满分💯<br/>' : rsl_str) +
        `【用时】<b>${((Date.now() - examInfo.start_time) / 1000 / 60).toFixed(2)}</b>分钟<br/>`, '考试结果',
        { type: results.meta.abs_score == total_score ? 'success' : 'error', dangerouslyUseHTMLString: true })
}

const submitQuiz = () => {
    ElMessageBox.confirm(
        '确定结束考试并交卷吗？', '请确认',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }
    ).then(() => {
        uploadExamResults()
    })
}

const onFavouriteClicked = async () => {
    await Api.postFavouriteQuestion(activeQ.id).then(() => {
        var i = ijPairs[activeQ.index][0]
        var j = ijPairs[activeQ.index][1]
        examInfo.meta[i].qList[j].favourite = true
        activeQ.favourite = true
        ElMessage.success('收藏成功')
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
        margin: 4px;
        padding: 6px;
        font-size: 14px;
        white-space: pre-wrap;
        border-style: dotted;
        border-color: darkgray;
        // background-color: #f5f5f5;
        border-width: 2px;

        .title {
            font-weight: bold;
            // color: darkblue;
            font-size: 14px;
        }
    }

    .answer {
        font-weight: bold;
        color: darkgreen;
        font-size: 14px;
        white-space: pre-wrap;

        :depp(.el-tag__content) {
            padding-right: 10px !important;
        }
    }

    .user-answer {
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

    .el-button--primary:focus {
        background-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
        // color: #fff;
    }

    .el-main {
        background-color: white;
        padding: 0;
        height: calc(100vh - 100px);
    }
}
</style>