<template>
    <div class="subject">
        <span>科目：</span>
        <el-radio-group v-model="currentInfo.subject" size="small">
            <el-radio-button v-for="(val, key) in favouriteSets" :label="key"> {{ key }}({{ val.length }})</el-radio-button>
        </el-radio-group>
    </div>
    <el-table :data="favouriteSets[currentInfo.subject]" :row-class-name="tableRowClassName" border v-loading="loading"
        style="width: 100%; color:darkslategray; font-size: 13px;">
        <el-table-column fixed type='index' width="32px" />
        <el-table-column prop="quiz_name" label="试卷名" width="88px" sortable show-overflow-tooltip />
        <el-table-column prop="type" label="题型" width="60px" sortable />
        <el-table-column prop="title" label="题目" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="level" label="难度" width="60px" sortable />
        <el-table-column fixed="right" label="查看" width="40px">
            <template v-slot="scope">
                <el-button link type="primary" size="small" @click="onDetailsClicked(scope.$index)">详情</el-button>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="删除" width="40px">
            <template v-slot="scope">
                <el-button link type="primary" size="small" @click="onDeleteClicked(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-affix v-if="currentInfo.subject.length > 0" position="bottom" :offset="20">
        <el-tooltip placement="right" content="收藏题考试">
            <el-button type="primary" :icon="Edit" circle @click="startExamInFavouriteSet" />
        </el-tooltip>
    </el-affix>
    <QuestionDialog :visible="currentInfo.drawerVisible"
        :header="`${currentInfo.q.qid}.【${currentInfo.subject}】${currentInfo.q.quiz_name}`" :title="currentInfo.q.title"
        :image="currentInfo.q.image" :description="currentInfo.q.description" :analysis="currentInfo.q.analysis"
        :answer="currentInfo.q.answer" :userAnswer="currentInfo.q.user_answer" @close="currentInfo.drawerVisible = false">
    </QuestionDialog>
</template>

<script lang="ts" setup>
import { Api } from '@/request/index';
import { onMounted, reactive, ref } from 'vue';
import { IWrongSet, WrongSet } from '@/types/http';
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import QuestionDialog from '@/views/components/QuestionDialog.vue';

const router = useRouter()
let loading = ref(true)
var favouriteSets: { [key: string]: IWrongSet[] } = reactive(
    {}
)

const currentInfo: { subject: string, drawerVisible: boolean, q: IWrongSet } = reactive({
    subject: '',
    drawerVisible: false,
    q: new WrongSet()
})
const onDetailsClicked = (index: number) => {
    currentInfo.q = favouriteSets[currentInfo.subject][index]
    currentInfo.drawerVisible = true;
}
const onDeleteClicked = (index: number) => {
    currentInfo.q = favouriteSets[currentInfo.subject][index]
    ElMessageBox.confirm(
        `从收藏集里删除本题【${currentInfo.q.title.substring(0, 10)}...】吗？`,
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await Api.deleteFavouriteQuestion(currentInfo.q.qid).then(async (res)=>{
            console.log(res)
            ElMessage({
                message: '删除成功.',
                type: 'success',
            })
        })
    })
}
onMounted(() => {
    Api.getFavouriteSetsBySubName().then(res => {
        var keys = Object.keys(res.data)
        keys.forEach(key => {
            if (res.data[key].length > 0) {
                favouriteSets[key] = res.data[key]
            }
        })
        keys = Object.keys(favouriteSets)
        if (keys.length > 0) {
            currentInfo.subject = keys[0]
        }
        loading.value = false
    })
})
const startExamInFavouriteSet = () => {
    const exam_minutes = 60
    ElMessageBox.confirm(
        `开始【${currentInfo.subject}《收藏题集》】(${exam_minutes}分钟)考试吗？`,
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        router.push({
            path: '/exam',
            query: { id: -3, name: '收藏题集', sub_name: currentInfo.subject, exam_seconds: exam_minutes * 60 }
        })
    })
}

const tableRowClassName = ({ row, rowIndex }: { row: any, rowIndex: number }) => {
    if (rowIndex % 2 == 0) {
        return 'success-row'
    }
    return ''
}
</script>

<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
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