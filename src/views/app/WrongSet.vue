<template>
    <QuizCascader
        :options="options"
        @clicked="onSelectionChanged"
    ></QuizCascader>
    <el-table
        :data="wrongDisplays"
        :row-class-name="tableRowClassName"
        border
        v-loading="loading"
        style="width: 100%; color: darkslategray; font-size: 12px"
    >
        <el-table-column fixed type="index" width="32px" />
        <el-table-column
            prop="qz_name"
            label="试卷名"
            width="88px"
            sortable
            show-overflow-tooltip
        />
        <el-table-column prop="type" label="题型" width="60px" sortable />
        <el-table-column prop="title" label="题目" show-overflow-tooltip />
        <el-table-column
            prop="description"
            label="描述"
            show-overflow-tooltip
        />
        <el-table-column prop="level" label="难度" width="60px" sortable />
        <el-table-column
            prop="wrong_times"
            label="次数"
            width="60px"
            sortable
        />
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button
                    link
                    type="primary"
                    size="small"
                    @click="onDetailsClicked(scope.$index)"
                    >详情</el-button
                >
            </template>
        </el-table-column>
    </el-table>
    <el-affix v-if="wrongDisplays.length > 0" position="bottom" :offset="20">
        <el-tooltip placement="right" content="错题考试">
            <el-button
                type="primary"
                :icon="Edit"
                circle
                @click="startExamInWrongSet"
            />
        </el-tooltip>
    </el-affix>
    <QuestionDialog
        :visible="crtInfo.drawerVisible"
        :id="crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].qid : 0"
        :wrong_times="
            crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].wrong_times : 0
        "
        :is_favourited="
            crtInfo.qidx >= 0
                ? wrongDisplays[crtInfo.qidx].is_favourited
                : false
        "
        :header="
            crtInfo.qidx >= 0
                ? `${wrongDisplays[crtInfo.qidx].qid}.【${
                      crtInfo.subject.name
                  } | ${crtInfo.grade.name} | ${crtInfo.volume.name}】${
                      wrongDisplays[crtInfo.qidx].qz_name
                  }`
                : ''
        "
        :title="crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].title : ''"
        :image="crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].image : ''"
        :description="
            crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].description : ''
        "
        :analysis="
            crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].analysis : ''
        "
        :answer="crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].answer : ''"
        :userAnswer="
            crtInfo.qidx >= 0 ? wrongDisplays[crtInfo.qidx].user_answer : ''
        "
        @close="
            (fav: boolean) => {
                wrongDisplays[crtInfo.qidx].is_favourited = fav;
                crtInfo.drawerVisible = false;
            }
        "
    >
    </QuestionDialog>
</template>

<script lang="ts" setup>
import { Api } from '@/request/index';
import { onMounted, reactive, ref } from 'vue';
import { IWrongSet } from '@/types/http';
import { Edit } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import QuestionDialog from '@/views/components/QuestionDialog.vue';
import QuizCascader from '@/views/components/QuizCascader.vue';
import { IQuizInfo, ISubjectInfo, IBaseInfo } from '@/types/quiz_cascader';

const router = useRouter();
let loading = ref(true);

var quizs: IQuizInfo[] = reactive([]);
var wrongs: IWrongSet[] = reactive([]);
var wrongDisplays: IWrongSet[] = reactive([]);

const options: ISubjectInfo[] = reactive([]);

let crtInfo = reactive({
    drawerVisible: false,
    subject: { id: 0, name: '' },
    grade: { id: 0, name: '' },
    volume: { id: 0, name: '' },
    qidx: -1,
});

const onSelectionChanged = (
    sub: IBaseInfo,
    grade: IBaseInfo,
    volume: IBaseInfo
) => {
    crtInfo.subject = sub;
    crtInfo.grade = grade;
    crtInfo.volume = volume;
    loading.value = true;

    crtInfo.qidx = -1;
    wrongDisplays.splice(0);
    var qzs = quizs.filter((qz) => {
        return (
            qz.subject.id == sub.id &&
            qz.grade.id == grade.id &&
            qz.volume.id == volume.id
        );
    });
    wrongDisplays = wrongs.filter((w) => {
        return qzs.some((qz) => qz.quiz.id == w.qz_id);
    });
    loading.value = false;
    // num.value = Math.random();
};

const onDetailsClicked = (index: number) => {
    crtInfo.qidx = index;
    crtInfo.drawerVisible = true;
};
onMounted(() => {
    Api.getWrongSetsMixedBySubInfos().then((res) => {
        quizs = res.data['quizs'];
        quizs.forEach((qz) => {
            var sidx = options.findIndex((opt) => {
                return opt.v.id == qz.subject.id;
            });
            if (sidx < 0) {
                sidx = options.length;
                options.push({
                    v: qz.subject,
                    children: [],
                });
            }
            var gidx = options[sidx].children.findIndex((g) => {
                return g.v.id == qz.grade.id;
            });
            if (gidx < 0) {
                gidx = options[sidx].children.length;
                options[sidx].children.push({
                    v: qz.grade,
                    children: [],
                });
            }
            var vidx = options[sidx].children[gidx].children.findIndex((v) => {
                return v.id == qz.volume.id;
            });
            if (vidx < 0) {
                vidx = options[sidx].children[gidx].children.length;
                options[sidx].children[gidx].children.push(qz.volume);
            }
        });
        wrongs = res.data['questions'];
        loading.value = false;
    });
});
const startExamInWrongSet = () => {
    const exam_minutes = 60;
    ElMessageBox.confirm(
        `开始【${crtInfo.subject.name}⭐${crtInfo.grade.name}⭐${crtInfo.volume.name}《错题集》】(${exam_minutes}分钟)考试吗？`,
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        router.push({
            path: '/exam',
            query: {
                id: -1,
                name: '错题集',
                subject: crtInfo.subject.name,
                grade: crtInfo.grade.name,
                volume: crtInfo.volume.name,
                exam_seconds: exam_minutes * 60,
            },
        });
    });
};

const tableRowClassName = ({
    row,
    rowIndex,
}: {
    row: any;
    rowIndex: number;
}) => {
    if (rowIndex % 2 == 0) {
        return 'success-row';
    }
    return '';
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

.question {
    font-size: 14px;
    white-space: pre-wrap;
    color: darkblue;
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
