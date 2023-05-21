<template>
    <el-card v-if="dataLoaded">
        <template #header>
            <div class="card-header">
                <el-tag effect="dark" type="success"> <el-icon>
                        <List />
                    </el-icon>【小习惯，大成就】</el-tag>
                <!-- <el-tag round type="warning">天道酬勤，厚积薄发</el-tag> -->
                <el-button-group>
                    <el-button type="success" :icon="ArrowLeft" size="small" @click="onWeekButtonClicked(-1)">上周</el-button>
                    <el-button type="success" size="small" @click="onWeekButtonClicked(0)">今天</el-button>
                    <el-button :disabled="habbits.start_day >= habbits.first_day_this_week" type="success" size="small"
                        @click="onWeekButtonClicked(1)">下周<el-icon class="el-icon--right">
                            <ArrowRight />
                        </el-icon>
                    </el-button>
                </el-button-group>
            </div>
        </template>
        <el-table :data="habbits.data" border style="width: 100%; font-size:12px" table-layout="auto" stripe
            :row-style="{ height: 0 + 'px' }" :cell-style="{ padding: '0px' }" :header-cell-style="{ padding: '0px' }">
            <el-table-column label="名称" fixed align="center">
                <template #default="scope">{{ scope.row.name }}<span v-if="scope.row.description.length > 0">({{
                    scope.row.description }})</span></template>
            </el-table-column>
            <el-table-column v-for="(d, col) in dateTitles" align="center" :label="d.substring(5)">
                <el-table-column align="center" :label="habbits.week_titles[col]"
                    :class-name="d == habbits.today ? 'bg-gray' : 'default_cell'">
                    <template #default="scope">
                        <el-switch size="small" style="--el-switch-on-color: #13ce66;" v-model="scope.row.checks[col]"
                            inline-prompt :active-icon="Check" @change="onSwitchChanged(scope.row, col)" />
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="进度" align="center">
                <template #default="scope">
                    <el-progress :percentage=checkedNums(scope.row).percentage :status=checkedNums(scope.row).status>
                        <el-tag round :type=checkedNums(scope.row).status>{{ checkedNums(scope.row).text }}</el-tag>
                    </el-progress>
                    <!-- {{ scope.row.checked_num }}/{{ scope.row.times_per_week }}{{ scope.row.checked_num<scope.row.times_per_week?'❌':'✅'}} -->
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Habbits, IHabbit } from '@/types/habbit';
import { Check, ArrowLeft, ArrowRight, List, Location } from '@element-plus/icons-vue';
import { ADate } from '@/utils/date'
import { Api } from '@/request';
import { ElMessageBox } from 'element-plus';

const dataLoaded = ref(false)
var habbits = reactive(new Habbits())

const dateTitles = computed(() => {
    var titles = []
    var date = new ADate(habbits.start_day)
    for (var i = 0; i < 7; i++) {
        titles.push(date.toString())
        date.goToDaysLater(1)
    }
    return titles
})

const onWeekButtonClicked = (id: number) => {
    if (id == 0) {
        var date = new ADate()
        date.goToFirstDayOfThisWeek()
    } else {
        var date = new ADate(habbits.start_day)
        date.goToDaysLater(id > 0 ? 7 : -7)
    }
    if (date.toString() == habbits.start_day) {
        return
    }
    habbits.start_day = date.toString()
    date.goToDaysLater(6)
    habbits.end_day = date.toString()
    getHabbitRecord()
}

const getHabbitRecord = () => {
    Api.getHabbitRecordByDateRange(habbits.start_day, habbits.end_day).then(res => {
        habbits.data.forEach(h => {
            h.checks = [false, false, false, false, false, false, false]
            for (var i = 0; i < h.checks.length; i++) {
                h.checks[i] = res.data.results.some((d: { habbit: number; date: string; }) => (d.habbit == h.id && dateTitles.value[i] == d.date))
            }
        })
        return true
    }).catch(err => {
        return false
    })
    return true
}

const checkedNums = computed(() => (row: IHabbit) => {
    var num = 0;
    row.checks.forEach(c => num += c ? 1 : 0)
    return {
        percentage: Math.min(100, Math.round(num * 100 / row.times_per_week)),
        status: num < row.times_per_week ? 'warning' : 'success',
        text: `${num}/${row.times_per_week}`
    }
})

onMounted(() => {
    dataLoaded.value = false
    var date = new ADate()
    habbits.today = date.toString()
    date.goToFirstDayOfThisWeek()
    habbits.start_day = date.toString()
    habbits.first_day_this_week = habbits.start_day
    date.goToDaysLater(6)
    habbits.end_day = date.toString()
    Api.getHabbits().then(res => {
        habbits.data = res.data.results
        habbits.data.forEach(h => h.checks = [false, false, false, false, false, false, false])
        return
    }).catch(err => {
        return
    })
    if (!getHabbitRecord()) {
        return
    }
    dataLoaded.value = true
})

const onSwitchChanged = async (row: any, col: number) => {
    var success = false
    await ElMessageBox.confirm(
        `【${row.name}】` + (row.checks[col] ? '确定打卡吗？' : '确定取消打卡吗？'),
        '请确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await Api.postHabbitRecord(row.id, dateTitles.value[col], row.checks[col]
        ).then(res => success = true
        ).catch(err => success = false)
    }).catch(err => success = false)

    if (!success) {
        row.checks[col] = !row.checks[col]
    }
}

</script>

<style lang="scss">
.bg-gray {
    background-color: lightgoldenrodyellow;

    .cell {
        background-color: lightgoldenrodyellow;
        padding: 0px, 0px;
        height: 22px;
    }
}

.default_cell {
    .cell {
        height: 22px;
        padding: 0px, 0px;
    }
}
</style>

<style lang="scss" scoped>
.card-header {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    padding: 5px 0px;
}

.el-card :deep(.el-card__header) {
    padding: 0px 8px !important;
    background-color: #3f94d0;
}
</style>