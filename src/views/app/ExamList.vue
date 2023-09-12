<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group
            v-model="quizPages.subject.id"
            @change="onSubjectSelected"
            size="small"
        >
            <el-radio-button v-for="sub in subjectList" :label="sub.id">
                {{ sub.name }}({{ sub.count }})</el-radio-button
            >
        </el-radio-group>
    </div>
    <div class="subject">
        <span>年级：</span>
        <el-radio-group
            v-model="quizPages.grade.id"
            @change="onSubjectSelected"
            size="small"
        >
            <el-radio-button v-for="grade in gradeList" :label="grade.id">
                {{ grade.name }}({{ grade.count }})</el-radio-button
            >
        </el-radio-group>
    </div>
    <div class="subject">
        <span>分册：</span>
        <el-radio-group
            v-model="quizPages.volume.id"
            @change="onSubjectSelected"
            size="small"
        >
            <el-radio-button v-for="vol in volumeList" :label="vol.id">
                {{ vol.name }}({{ vol.count }})</el-radio-button
            >
        </el-radio-group>
    </div>

    <el-empty
        v-if="quizPages.quizNum == 0"
        description="暂无数据"
        :image-size="200"
    />
    <el-row :gutter="20" class="home-card">
        <el-col
            v-for="quiz in quizShown"
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
                            <span>{{ quiz.tag }}</span>
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

    <div
        class="pagination-block"
        v-if="quizPages.subject.count > quizPages.pageSize"
    >
        <el-pagination
            background
            :page-size="quizPages.pageSize"
            :total="quizPages.quizNum"
            layout="prev, pager, next"
            @current-change="onPageChanged"
        ></el-pagination>
    </div>
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
        v-if="quizPages.subject.id >= 0 && quizPages.quizNum > 0"
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
import { ref, reactive, onMounted, computed } from 'vue';
import { QuizPages } from '@/types/quiz';
import { Api } from '@/request/index';

import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { ISubject, IGrade, IVolume } from '@/types/subject';

const router = useRouter();

const isOralMath = computed(() => {
    return quizPages.subject.id == 3;
});
const currentQuizId = ref(-1);

let subjectList: ISubject[] = reactive([
    { id: 0, name: '全部', logo: '', count: 100 },
]);
let gradeList: IGrade[] = reactive([{ id: 0, name: '全部', count: 0 }]);
let volumeList: IVolume[] = reactive([{ id: 0, name: '全部', count: 0 }]);

const quizPages = reactive(new QuizPages());
const showDialog = ref(false);
const randomQuiz = reactive([
    { label: '选择', val: 15, min: 5, max: 100, step: 5 },
    { label: '判断', val: 10, min: 5, max: 100, step: 5 },
    { label: '填空', val: 2, min: 0, max: 20, step: 1 },
    { label: '问答', val: 2, min: 0, max: 20, step: 1 },
    { label: '时长(分钟)', val: 60, min: 10, max: 120, step: 10 },
]);
const oralMathConfig = reactive([
    { label: '数字个数', val: 3, min: 2, max: 5, step: 1 },
    { label: '几以内运算', val: 30, min: 10, max: 100, step: 10 },
    { label: '题目个数', val: 50, min: 20, max: 100, step: 10 },
    { label: '时长(分钟)', val: 10, min: 5, max: 30, step: 5 },
]);

const getQuizList = () => {
    quizPages.currentPage = 1;
    Api.getQuizList().then((res: { data: [] }) => {
        quizPages.quizList = res.data;
        quizPages.quizList = quizPages.quizList.filter(
            (s) => s.subject == 3 || s.question_counts.some((v) => v.count > 0)
        );
        quizPages.quizNum = quizPages.quizList.length;
        quizPages.quizList.forEach((q) => {
            q.tag = '';
            var sid = subjectList.findIndex((s) => s.id == q.subject);
            if (sid >= 0) {
                subjectList[sid].count++;
                // subjectList[0].count++
                q.tag += subjectList[sid].name + '⭐';
            }
            var gid = gradeList.findIndex((g) => g.id == q.grade);
            if (gid >= 0) {
                gradeList[gid].count++;
                gradeList[0].count++;
                q.tag += gradeList[gid].name + '⭐';
            }
            var vid = volumeList.findIndex((v) => v.id == q.volume);
            if (vid >= 0) {
                volumeList[vid].count++;
                volumeList[0].count++;
                q.tag += volumeList[vid].name + '⭐';
            }
            q.tag += q.name;
        });
        quizPages.quizDisplay = quizPages.quizList;
        subjectList = subjectList.filter((s) => s.count > 0);
        gradeList = gradeList.filter((g) => g.count > 0);
        volumeList = volumeList.filter((v) => v.count > 0);

        subjectList.length > 0 && (quizPages.subject.id = subjectList[0].id);
        gradeList.length > 0 && (quizPages.grade.id = gradeList[0].id);
        volumeList.length > 0 && (quizPages.volume.id = volumeList[0].id);
        onSubjectSelected();
    });
};

const cardBodyStyle = () => {
    const colors = ['#c6e2ff', 'wheat', '#48F4DB'];
    var idx = subjectList.findIndex((v) => v.id == quizPages.subject.id);
    return {
        'background-color': colors[idx % colors.length],
    };
};

onMounted(async () => {
    await Api.getSubjectList().then(async (res) => {
        // subjectList = subjectList.concat(res.data[0]); //科目默认必须有
        subjectList = res.data[0];
        gradeList = gradeList.concat(res.data[1]);
        volumeList = volumeList.concat(res.data[2]);
        subjectList.forEach((s) => (s.count = 0));
        gradeList.forEach((g) => (g.count = 0));
        volumeList.forEach((v) => (v.count = 0));
        getQuizList();
    });
});

const onSubjectSelected = () => {
    quizPages.quizDisplay = quizPages.quizList.filter((q) => {
        var flag = true;
        if (quizPages.subject.id > 0) {
            flag &&= q.subject == quizPages.subject.id;
        }
        if (quizPages.grade.id > 0) {
            flag &&= q.grade == quizPages.grade.id;
        }
        if (quizPages.volume.id > 0) {
            flag &&= q.volume == quizPages.volume.id;
        }
        return flag;
    });
    quizPages.quizNum = quizPages.quizDisplay.length;
    var s = subjectList.find((s) => s.id == quizPages.subject.id);
    if (s) {
        quizPages.subject.name = s.name;
        quizPages.subject.logo = s.logo;
        quizPages.subject.count = s.count;
    }
};
const quizShown = computed(() => {
    return quizPages.quizDisplay.slice(
        (quizPages.currentPage - 1) * quizPages.pageSize,
        quizPages.currentPage * quizPages.pageSize
    );
});
const onPageChanged = (page: number) => (quizPages.currentPage = page);

const onRandomQuiz = () => {
    showDialog.value = false;
    if (isOralMath.value) {
        router.push({
            path: '/oral_math',
            query: {
                id: currentQuizId.value,
                name: '数学口算',
                digital_num: oralMathConfig[0].val,
                max_digital: oralMathConfig[1].val,
                q_num: oralMathConfig[2].val,
                exam_seconds: oralMathConfig[3].val * 60,
            },
        });
        return;
    }
    router.push({
        path: '/exam',
        query: {
            id: -2,
            name: '随机测试',
            subject: quizPages.subject.name,
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
        currentQuizId.value = quizId;
        showDialog.value = true;
        return;
    }
    ElMessageBox.confirm(
        `开始【${quizPages.subject.name}《${quizName}》】(${exam_minutes}分钟)考试吗？`,
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            router.push({
                path: '/exam',
                query: {
                    id: quizId,
                    name: quizName,
                    sub_name: quizPages.subject.name,
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
