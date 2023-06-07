<template>
    <el-container>
        <el-header>
            <span>【{{ math_info.name }}】</span>
            <!-- <Timer style="color: red;" :start_flag="math_info.state == ExamState.ONGOING"
                :duration_secs="math_info.exam_seconds" :blink="blink" start_text='【已用时间】' :count_down="false"
                @end_event="uploadExamResults">
            </Timer> -->
            <FlipCounter :seconds="math_info.exam_seconds" :type="2" :split="blink" :timeUnit="[':', ':', ':']"
                :stop="math_info.state == ExamState.FINISHED" @timeUp="uploadExamResults" />
            <el-button link type="primary" :disabled="math_info.state == ExamState.FINISHED"
                @click="submitQuiz">提交</el-button>
        </el-header>
        <el-main>
            <el-row :gutter="16" class="q-body">
                <el-col v-for="m in math_info.meta" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-card>
                        <span class="question">{{ m.title }}</span>
                        <el-input v-model="m.user_answer" :max="999" clearable type="number"
                            :disabled="math_info.state == ExamState.FINISHED"></el-input>
                        <span>{{ m.mark }}</span>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
// import Timer from '@/components/Timer.vue'
import FlipCounter from '@/components/FlipCounter.vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Api } from '@/request'
import { ExamState } from '@/types/question'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuizResult } from '@/types/http'
import { ISettings, SetID } from '@/types/settings'

const math_info = reactive({
    id: 0,
    name: '',
    digital_num: 2,
    max_digital: 30,
    que_num: 40,
    state: ExamState.IDLE,
    exam_seconds: 0,
    start_time: 0,
    meta: [{ title: '', answer: 0, user_answer: '', mark: '' }]
})

const blink = ref(true)
const route = useRoute()

onMounted(() => {
    math_info.id = Number(route.query.id)
    math_info.name = String(route.query.name)
    math_info.exam_seconds = Number(route.query.exam_seconds)
    math_info.digital_num = Number(route.query.digital_num)
    math_info.max_digital = Number(route.query.max_digital)
    math_info.que_num = Number(route.query.q_num)
    math_info.state = ExamState.ONGOING
    var s: ISettings = Api.loadSettings()
    s && (blink.value = s.data[SetID.EXAM_TIME_BLINK].value)
    Api.getOralMath(math_info.digital_num, math_info.max_digital, math_info.que_num).then((res) => {
        math_info.meta = []
        res.data.forEach((r: any[]) =>
            math_info.meta.push({ title: r[0], answer: r[1], user_answer: '', mark: '' })
        )
        math_info.start_time = Date.now()
    })
})

const uploadExamResults = async () => {
    math_info.state = ExamState.FINISHED
    var correct_count = 0
    var error_count = 0
    math_info.meta.forEach(m => {
        var flag = String(m.answer) == m.user_answer
        m.mark = flag ? '✅' : '❌'
        correct_count += flag ? 1 : 0
    })
    error_count = math_info.meta.length - correct_count
    var user_id = Api.loadUserIdFromStorage()
    var results = new QuizResult()
    results.meta.note = `加数:${math_info.digital_num}个, 最大: ${math_info.max_digital}; ${correct_count}/${math_info.meta.length}`
    results.meta.user = user_id
    results.meta.quiz = math_info.id
    results.meta.abs_score = Math.round(correct_count * 100 / math_info.meta.length) //correct_count
    results.meta.rel_score = Math.round(correct_count * 100 / math_info.meta.length)
    results.meta.use_minutes = Math.max(1, Math.round((Date.now() - math_info.start_time) / 1000 / 60))
    await Api.postQuizResult(results.meta)
    ElMessageBox.alert(`得分: ${results.meta.abs_score}/100<br/>` +
        (correct_count == math_info.meta.length ? "恭喜您获得满分💯" : `详情: ${correct_count} ✅, ${error_count} ❌<br/>`), '考试结果',
        { type: correct_count == math_info.meta.length ? 'success' : 'error', dangerouslyUseHTMLString: true })
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

onBeforeRouteLeave((to, from, next) => {
    if (math_info.state != ExamState.ONGOING) {
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
            // closeOnClickModal: false,//点击遮罩关闭弹窗
            distinguishCancelAndClose: true,//区分取消与关闭
        }
    ).then((action) => {
        next(false)
    }).catch((err) => {
        if (err == 'cancel') {
            next()
            math_info.state = ExamState.FINISHED
        } else {
            next(false)
        }
    })
})
</script>

<style scoped>
.q-body {
    display: flex;
    flex-wrap: wrap;
}

.el-header {
    height: 36px;
    position: relative;
    background-color: var(--el-color-primary-light-7);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: bold;
}

.el-card {
    background-color: honeydew;
    margin-bottom: 5px;
}

:deep(.el-card__body) {
    padding: 6px 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

}

.question {
    display: inline-flex;
    justify-content: center;
    width: 118px;
    font-size: 16px;
    color: darkcyan;
    font-weight: bold;
}

.el-input {
    width: 100px;
}
</style>