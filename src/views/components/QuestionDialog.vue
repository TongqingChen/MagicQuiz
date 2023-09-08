<template>
    <el-dialog :model-value="dialogVisible" destroy-on-close draggable :before-close="closes">
        <template #header>
            <div>{{ header }}</div>
        </template>
        <div class="question">
            <div class="question">{{ title }}</div>
            <el-image v-if="image && image.length > 0" :src="image" fit="scale-down" />
            <div>{{ description }}</div>
            <div v-if="showAnswer">
                <div v-if="userAnswer" style="color: darkred; font-weight: bold;"><el-tag type='danger' size='small'
                        effect="dark">考生答案</el-tag> {{ userAnswer }}</div>
                <div style="color: darkgreen; font-weight: bold;"><el-tag type='success' size='small'
                        effect="dark">正确答案</el-tag> {{ answer }}</div>
                <div style="color: darkgreen;"><el-tag type='success' size='small' effect="dark">题目解析</el-tag> {{
                    analysis }}</div>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" @click="() => showAnswer = true">显示答案</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
const showAnswer = ref(false)
const dialogVisible = computed(() => {
    return props.visible
})

const props = defineProps<{
    visible: boolean,
    header: string,
    title: string,
    image: string | null,
    description: string,
    answer: string,
    analysis: string,
    userAnswer: string | null
}
>()

const emit = defineEmits(['close'])


const closes = () => {
    showAnswer.value = false
    emit('close')
}
</script>

<style lang="scss" scoped>
.question {
    font-size: 14px;
    white-space: pre-wrap;
    color: darkblue;
}
</style>