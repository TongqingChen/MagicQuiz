<template>
    <QuizCascader
        :options="options"
        @clicked="onSelectionChanged"
    ></QuizCascader>
    <div class="subject">
        试卷：
        <el-radio-group
            v-model="currQuizId"
            size="small"
            @change="onQuizChanged"
        >
            <el-radio-button v-for="qz in quizListDisplay" :label="qz.quiz.id">
                {{ qz.quiz.name }}</el-radio-button
            >
        </el-radio-group>
    </div>
    <div class="subject">
        题型：
        <el-radio-group v-model="currType" size="small">
            <el-radio-button v-for="(val, index) in qTypes" :label="index - 1">
                {{ val }}</el-radio-button
            >
        </el-radio-group>
    </div>
    <el-table
        :data="qListDisplay"
        style="width: 100%; font-size: 12px"
        :row-class-name="tableRowClassName"
        border
        v-loading="loading"
    >
        <el-table-column fixed type="index" width="32px" />
        <el-table-column label="题型" width="40px">
            <template #default="scope">{{
                qTypes[scope.row.type + 1]
            }}</template>
        </el-table-column>
        <el-table-column prop="title" label="题目" show-overflow-tooltip />
        <el-table-column
            prop="description"
            label="描述"
            show-overflow-tooltip
        />
        <el-table-column label="难度" width="40px">
            <template #default="scope">{{
                qDifficulty[scope.row.difficulty_level]
            }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button
                    link
                    type="primary"
                    size="small"
                    @click="questionSelected(scope.$index)"
                    >详情</el-button
                >
            </template>
        </el-table-column>
    </el-table>
    <QuestionDialog
        :visible="detailsVisible"
        :header="`${currQ.id}. ${currQuizInfo}`"
        :title="currQ.title"
        :image="currQ.image"
        :description="currQ.description"
        :analysis="currQ.analysis"
        :answer="currQ.answer"
        :userAnswer="null"
        @close="detailsVisible = false"
    >
    </QuestionDialog>
</template>

<script lang="ts" setup>
import { Api } from '@/request';
import { computed, onMounted, reactive, ref } from 'vue';
import { IQuestion, Question } from '@/types/question';
import QuestionDialog from '@/views/components/QuestionDialog.vue';
import QuizCascader from '../components/QuizCascader.vue';
import { IBaseInfo, IQuizInfo, ISubjectInfo } from '@/types/quiz_cascader';

const qTypes = ['全部', '单选', '判断', '填空', '问答'];
const qDifficulty = ['简单', '一般', '困难'];
let options: ISubjectInfo[] = reactive([]);
let quizList: IQuizInfo[] = reactive([]);

let currQuizId = ref(0);
let quizListDisplay: IQuizInfo[] = reactive([]);

const currType = ref(0);
let qList: IQuestion[] = reactive([]);
const qListDisplay = computed(() => {
    return qList.filter((q) => {
        return currType.value < 0 || q.type == currType.value;
    });
});

let currQ: IQuestion = reactive(new Question());
let currQuizInfo = ref('');

const detailsVisible = ref(false);
const loading = ref(false);
const questionSelected = (idx: number) => {
    currQ = qListDisplay.value[idx];
    detailsVisible.value = true;
};

const onSelectionChanged = (
    sub: IBaseInfo,
    grade: IBaseInfo,
    volume: IBaseInfo
) => {
    currQuizInfo.value = `【${sub.name} | ${grade.name} | ${volume.name}】`;
    quizListDisplay.splice(0);
    quizListDisplay = quizList.filter((qz) => {
        return (
            qz.subject.id == sub.id &&
            qz.grade.id == grade.id &&
            qz.volume.id == volume.id
        );
    });
    if (quizListDisplay.length > 0) {
        currQuizId.value = quizListDisplay[0].quiz.id;
        currQuizInfo.value += quizListDisplay[0].quiz.name;
        onQuizChanged();
    }
};

const onQuizChanged = () => {
    loading.value = true;
    qList.splice(0);
    Api.getQuestionListByQuizId(currQuizId.value).then((res) => {
        var i = 1;
        res.data.results.forEach((d: IQuestion) => {
            qList.push({
                index: i++,
                id: d.id,
                type: d.type,
                title: d.title,
                description: d.description,
                image: d.image,
                analysis: d.analysis,
                difficulty_level: d.difficulty_level,
                score: d.score,
                answer: d.answer,
            });
        });
        currType.value = -1;
        loading.value = false;
    });
};

const tableRowClassName = ({
    row,
    rowIndex,
}: {
    row: any;
    rowIndex: number;
}) => {
    return rowIndex % 2 ? '' : 'success-row';
};
onMounted(async () => {
    await Api.getQuizList().then((res) => {
        res.data.forEach(
            (qz: {
                id: number;
                name: string;
                subject: number;
                subject_name: string;
                grade: number;
                grade_name: string;
                volume: number;
                volume_name: string;
            }) => {
                if (qz.subject == 3) {
                    return;
                }
                var q: IQuizInfo = {
                    quiz: { id: qz.id, name: qz.name },
                    subject: { id: qz.subject, name: qz.subject_name },
                    grade: { id: qz.grade, name: qz.grade_name },
                    volume: { id: qz.volume, name: qz.volume_name },
                };
                quizList.push(q);
                var sidx = options.findIndex((opt) => {
                    return opt.v.id == q.subject.id;
                });
                if (sidx < 0) {
                    sidx = options.length;
                    options.push({
                        v: q.subject,
                        children: [],
                    });
                }
                var gidx = options[sidx].children.findIndex((g) => {
                    return g.v.id == q.grade.id;
                });
                if (gidx < 0) {
                    gidx = options[sidx].children.length;
                    options[sidx].children.push({
                        v: q.grade,
                        children: [],
                    });
                }
                var vidx = options[sidx].children[gidx].children.findIndex(
                    (v) => {
                        return v.id == q.volume.id;
                    }
                );
                if (vidx < 0) {
                    vidx = options[sidx].children[gidx].children.length;
                    options[sidx].children[gidx].children.push(q.volume);
                }
            }
        );
    });
});
</script>

<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    width: 100%;
    font-size: 14px;
}

.el-table:deep(.cell) {
    padding: 0 4px;
}
</style>
<style lang="scss">
.success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>
