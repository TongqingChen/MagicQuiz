<template>
    <div>题库
    </div>
    <el-button type="text" @click="submitQuiz">提交</el-button>
</template>

<script lang='ts' setup>
import {ref, reactive} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const submitQuiz = () => {
    console.log('ssss')
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
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
        console.log('ss11ss')
}
</script>

<style lang='scss' scoped>
</style>