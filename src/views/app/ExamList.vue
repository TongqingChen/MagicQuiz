<template>
    <QuizCascader
        :options="options"
        @clicked="onSelectionChanged"
    ></QuizCascader>

    <el-empty
        v-if="quizList.length == 0"
        description="暂无数据"
        :image-size="200"
    />
    <el-row :gutter="20" class="home-card" :key="num">
        <el-col
            v-for="quiz in quizListDisplay"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
        >
            <el-tooltip placement="top" content="点击开始考试">
                <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="
                        onStartExamClicked(
                            quiz.id,
                            quiz.name,
                            quiz.exam_minutes
                        )
                    "
                >
                    <template #header>
                        <div class="card-header">
                            <span
                                >{{ currInfo.subject.name }} |
                                {{ currInfo.grade.name }} |
                                {{ currInfo.volume.name }} |
                                {{ quiz.name }}</span
                            >
                        </div>
                    </template>
                    <div class="card-body" :style="cardBodyStyle()">
                        <ol style="margin: 0; padding-left: 10px">
                            <li
                                v-for="q in quiz.question_counts.filter(
                                    (t) => t.count > 0
                                )"
                            >
                                {{ q.name }}题数: {{ q.count }}
                            </li>
                            <li v-if="!isOralMath">
                                考试时长: {{ quiz.exam_minutes }}分钟
                            </li>
                            <li v-else>点击卡片根据提示配置考试信息</li>
                            <li>最近考试: {{ quiz.last_exam_time }}</li>
                        </ol>
                    </div>
                </el-card>
            </el-tooltip>
        </el-col>
    </el-row>

    <el-dialog v-model="showDialog" title="选择题目数量" width="80%" center>
        <el-form label-position="right" :label-width="200">
            <el-form-item
                v-for="q in isOralMath ? oralMathConfig : randomQuiz"
                :label="q.label"
            >
                <el-slider
                    v-model="q.val"
                    show-input
                    size="small"
                    show-stops
                    :min="q.min"
                    :max="q.max"
                    :step="q.step"
                />
            </el-form-item>
            <el-form-item label="操作">
                <el-button type="primary" @click="onRandomQuiz"
                    >开始考试</el-button
                >
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-affix
        v-if="currInfo.subject.id >= 0 && quizListDisplay.length > 0"
        position="bottom"
        :offset="20"
    >
        <el-tooltip placement="right" content="随机考试">
            <el-button
                type="success"
                :icon="Edit"
                circle
                @click="showDialog = true"
            />
        </el-tooltip>
    </el-affix>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Api } from "@/request/index";

import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import { IBaseInfo, ISubjectInfo } from "@/types/quiz_cascader";
import { IQuiz } from "@/types/quiz";
import QuizCascader from "../components/QuizCascader.vue";

const router = useRouter();

const currInfo = reactive({
    quiz: { id: 0, name: "" },
    subject: { id: 0, name: "" },
    grade: { id: 0, name: "" },
    volume: { id: 0, name: "" },
    page: 0,
});
let num = ref(0);
const isOralMath = computed(() => {
    return currInfo.subject.id == 3;
});
let options: ISubjectInfo[] = reactive([]);
let quizList: IQuiz[] = reactive([]);

let quizListDisplay: IQuiz[] = reactive([]);

const showDialog = ref(false);
const randomQuiz = reactive([
    { label: "选择", val: 15, min: 5, max: 100, step: 5 },
    { label: "判断", val: 10, min: 5, max: 100, step: 5 },
    { label: "填空", val: 2, min: 0, max: 20, step: 1 },
    { label: "问答", val: 2, min: 0, max: 20, step: 1 },
    { label: "时长(分钟)", val: 60, min: 10, max: 120, step: 10 },
]);
const oralMathConfig = reactive([
    { label: "数字个数", val: 3, min: 2, max: 5, step: 1 },
    { label: "几以内运算", val: 30, min: 10, max: 100, step: 10 },
    { label: "题目个数", val: 50, min: 20, max: 100, step: 10 },
    { label: "时长(分钟)", val: 10, min: 5, max: 30, step: 5 },
]);

const onSelectionChanged = (
    sub: IBaseInfo,
    grade: IBaseInfo,
    volume: IBaseInfo
) => {
    currInfo.subject = sub;
    currInfo.grade = grade;
    currInfo.volume = volume;
    quizListDisplay = quizList.filter((qz) => {
        return (
            qz.subject == currInfo.subject.id &&
            qz.grade == currInfo.grade.id &&
            qz.volume == currInfo.volume.id
        );
    });
    console.log(quizListDisplay);
    num.value = Math.random();
};

const cardBodyStyle = () => {
    const colors = ["#c6e2ff", "wheat", "#48F4DB"];
    var idx = options.findIndex((v) => v.v.id == currInfo.subject.id);
    return {
        "background-color": colors[idx % colors.length],
    };
};

onMounted(async () => {
    await Api.getQuizList().then((res) => {
        quizList = res.data;
        quizList.forEach((qz) => {
            var sidx = options.findIndex((opt) => {
                return opt.v.id == qz.subject;
            });
            if (sidx < 0) {
                sidx = options.length;
                options.push({
                    v: { id: qz.subject, name: qz.subject_name },
                    children: [],
                });
            }
            var gidx = options[sidx].children.findIndex((g) => {
                return g.v.id == qz.grade;
            });
            if (gidx < 0) {
                gidx = options[sidx].children.length;
                options[sidx].children.push({
                    v: { id: qz.grade, name: qz.grade_name },
                    children: [],
                });
            }
            var vidx = options[sidx].children[gidx].children.findIndex((v) => {
                return v.id == qz.volume;
            });
            if (vidx < 0) {
                vidx = options[sidx].children[gidx].children.length;
                options[sidx].children[gidx].children.push({
                    id: qz.volume,
                    name: qz.volume_name,
                });
            }
        });
    });
});

const onRandomQuiz = () => {
    showDialog.value = false;
    if (isOralMath.value) {
        router.push({
            path: "/oral_math",
            query: {
                id: currInfo.quiz.id,
                name: "数学口算",
                digital_num: oralMathConfig[0].val,
                max_digital: oralMathConfig[1].val,
                q_num: oralMathConfig[2].val,
                exam_seconds: oralMathConfig[3].val * 60,
            },
        });
        return;
    }
    router.push({
        path: "/exam",
        query: {
            id: -2,
            name: "随机测试",
            subject: currInfo.subject.name,
            choice_num: randomQuiz[0].val,
            logic_num: randomQuiz[1].val,
            blank_num: randomQuiz[2].val,
            coding_num: randomQuiz[3].val,
            exam_seconds: randomQuiz[4].val * 60,
        },
    });
};

const onStartExamClicked = (
    quizId: number,
    quizName: string,
    exam_minutes: number
) => {
    if (isOralMath.value) {
        currInfo.quiz.id = quizId;
        showDialog.value = true;
        return;
    }
    ElMessageBox.confirm(
        `开始【${currInfo.subject.name} | ${currInfo.grade.name} | ${currInfo.volume.name}《${quizName}》】(${exam_minutes}分钟)考试吗？`,
        "请确认",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            router.push({
                path: "/exam",
                query: {
                    id: quizId,
                    name: quizName,
                    subject: currInfo.subject.name,
                    grade: currInfo.grade.name,
                    volume: currInfo.volume.name,
                    exam_seconds: exam_minutes * 60,
                },
            });
        })
        .catch(() => {});
};
</script>
<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 14px;
}

.home-card {
    display: flex;
    flex-wrap: wrap;
    margin: 0px !important;

    .button {
        font-size: 12px;
        font-weight: bold;
    }

    .box-card {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0px;
        }

        .card-body {
            height: 108px;
            padding: 10px 16px;
            color: darkcyan;
            display: flex;
            align-items: center;
        }
    }

    .el-card :deep(.el-card__header) {
        padding: 1px 8px;
        color: white;
        background-color: #3f94d0;
    }

    .el-card :deep(.el-card__body) {
        padding: 0px;
    }

    .el-card:hover {
        margin-top: -2px;
        margin-bottom: 2px;
        cursor: pointer;
    }
}

.pagination-block {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 10px;
    justify-content: center;
}
</style>

<style lang="scss">
.roll-dialog {
    margin-top: 5vh;
    margin-bottom: 5vh;
    height: 90vh;

    .el-dialog__header {
        display: none;
    }

    .dialog-content {
        max-height: calc(90vh - 20px) !important;
    }

    .el-dialog__body {
        padding: 10px;
        overflow-y: auto;
    }
}
</style>
