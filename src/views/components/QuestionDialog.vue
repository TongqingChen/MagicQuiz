<template>
    <el-dialog
        :model-value="dialogVisible"
        destroy-on-close
        draggable
        :before-close="closes"
    >
        <template #header>
            <div>
                {{ header }}
                <el-button
                    type="success"
                    :icon="
                        is_favourited || props.is_favourited ? StarFilled : Star
                    "
                    round
                    :disabled="is_favourited || props.is_favourited"
                    size="small"
                    @click="onFavouriteClicked"
                    >{{
                        is_favourited || props.is_favourited ? '已收藏' : '收藏'
                    }}</el-button
                >
            </div>
        </template>
        <div class="question">
            <div style="color: darkblue">{{ title }}</div>
            <el-image
                v-if="image && image.length > 0"
                :src="image"
                fit="scale-down"
            />
            <div>{{ description }}</div>
        </div>

        <div v-if="showAnswer">
            <div
                :style="
                    'color:' +
                    (wrong_times > 0 ? 'darkred' : 'darkgreen') +
                    '; font-weight: bold'
                "
            >
                <el-tag
                    :type="wrong_times > 0 ? 'danger' : 'success'"
                    size="small"
                    effect="dark"
                    >错误次数</el-tag
                >
                {{ wrong_times }}
            </div>
            <div v-if="userAnswer" style="color: darkred; font-weight: bold">
                <el-tag type="danger" size="small" effect="dark"
                    >考生答案</el-tag
                >
                {{ userAnswer }}
            </div>
            <div style="color: darkgreen; font-weight: bold">
                <el-tag type="success" size="small" effect="dark"
                    >正确答案</el-tag
                >
                {{ answer }}
            </div>
            <div style="color: darkgreen; white-space: pre-wrap">
                <el-tag type="success" size="small" effect="dark"
                    >题目解析</el-tag
                >
                {{ analysis }}
            </div>
        </div>
        <template #footer>
            <el-button
                v-if="!showAnswer"
                type="primary"
                @click="() => (showAnswer = true)"
                >显示答案</el-button
            >
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Star, StarFilled } from '@element-plus/icons-vue';
import { Api } from '@/request';
import { ElMessage } from 'element-plus';
const showAnswer = ref(false);
const dialogVisible = computed(() => {
    return props.visible;
});

const props = defineProps<{
    id: number;
    visible: boolean;
    header: string;
    title: string;
    image: string | null;
    description: string;
    answer: string;
    analysis: string;
    userAnswer: string | null;
    is_favourited: boolean;
    wrong_times: number;
}>();

const is_favourited = ref(false);

const emit = defineEmits(['close']);

const closes = () => {
    showAnswer.value = false;
    var tmp = props.is_favourited || is_favourited.value;
    is_favourited.value = false;
    emit('close', tmp);
};

const onFavouriteClicked = async () => {
    await Api.postFavouriteQuestion(props.id).then(() => {
        is_favourited.value = true;
        ElMessage.success('操作成功');
    });
};
</script>

<style lang="scss" scoped>
.question {
    font-size: 14px;
    white-space: pre-wrap;
    // color: darkcyan;
    border-style: dashed;
    border-width: 2px;
    border-color: grey;
    padding: 6px;
    margin-bottom: 4px;
}
</style>
