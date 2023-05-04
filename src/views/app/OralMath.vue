<template>
    <el-container>
        <el-header>
            <span>【{{ math_info.name }}】</span>
            <CountDown style="color: red;" :start_flag="true" :duration_secs="10" :blink="true" start_text='【考试剩余】'
                @end_event="">
            </CountDown>
            <el-button link type="primary" :disabled="math_info.state == ExamState.FINISHED"
                @click="onSubmit">提交</el-button>
        </el-header>
        <el-main>
            <el-row :gutter="16" class="q-body">
                <el-col v-for="m in math_info.meta" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-card>
                        <span class="question">{{ m.title }}</span>
                        <el-input v-model="m.user_answer" :max="999" clearable type="number" size="small"
                            :disabled="math_info.state == ExamState.FINISHED"></el-input>
                        <span>{{ m.mark }}</span>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import CountDown from '@/components/CountDown.vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Api } from '@/request'
import { ExamState } from '@/types/question'
import { ElMessageBox } from 'element-plus'

const math_info = reactive({
    id: 0,
    name: '',
    state: ExamState.IDLE,
    meta: [{ title: '', answer: 0, user_answer: 0, mark: '' }]
})
const route = useRoute()

onMounted(() => {
    math_info.id = Number(route.query.id)
    math_info.name = String(route.query.name)
    math_info.state = ExamState.ONGOING
    Api.getOralMath(math_info.id).then((res) => {
        math_info.meta = []
        res.data.forEach((r: any[]) =>
            math_info.meta.push({ title: r[0], answer: r[1], user_answer: 0, mark: '' })
        )
    })
})

const onSubmit = () => {
    math_info.meta.forEach(m => m.mark = m.answer == m.user_answer ? '✅' : '❌')
    math_info.state = ExamState.FINISHED
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
    font-size: 14px;
    color: darkcyan;
    font-weight: bold;
}

.el-input {
    width: 100px;
}</style>