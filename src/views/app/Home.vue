<template>
    <div class="dashboard-container">
        <!-- big day -->
        <el-row :gutter="8" class="mb-4">
            <el-col :xs="6" :sm="3" :lg="3" class="mb-2">
                <el-tooltip :content="meta.quotes[Math.floor(Math.random() * meta.quotes.length)]" placement="top-end">
                    <el-card class="w-full mb-2">
                        <div class="flex items-center">
                            <img class="user-avatar" :src="meta.user.avatar" />
                            <router-link style="color:#3f94d0; font-size: 12px; font-weight: bold;" to="/userInfo">{{
                                greetStr }}<br />{{ meta.user.last_name }}{{ meta.user.first_name }}</router-link>
                        </div>
                    </el-card>
                </el-tooltip>
            </el-col>
            <el-col v-for="d in meta.big_days" :xs="6" :sm="3" :lg="3" class="mb-2">
                <BigDay :title='d.name' :date='d.date' :description="d.description"></BigDay>
            </el-col>
        </el-row>

        <!-- habbit -->
        <el-row :gutter="8" class="mb-4">
            <el-col :xs="24" :lg="24" class="mb-2">
                <HabbitVue />
            </el-col>
        </el-row>

        <!-- 数据卡片 -->
        <el-row :gutter="8" class="mb-4">
            <el-col v-for="d in meta.statics" :xs="12" :sm="6" :lg="6" class="mb-2">
                <DataCard :title="d.title" :data="d.data" :icon="d.icon"></DataCard>
            </el-col>
        </el-row>

        <el-row :gutter="8">
            <!-- Echarts 图表 -->
            <el-col :sm="12" class="mb-4">
                <BarChart v-if="meta.data_loaded" id="barChart" :title="meta.chart_title" height="400px" width="100%"
                    :options="meta.exam_his_chart" class="bg-[var(--el-bg-color-overlay)]" />
            </el-col>

            <!-- 表格记录 -->
            <el-col :sm="12" class="mb-4">
                <el-card v-if="meta.data_loaded">
                    <div class="subject">
                        <el-radio-group v-model="meta.current_sub" size="small">
                            <el-radio-button v-for="(val, key) in meta.exam_his" :label="key"> {{ key }}({{ val.length
                            }})</el-radio-button>
                        </el-radio-group>
                    </div>
                    <el-table :data="meta.exam_his[meta.current_sub]" table-layout="auto" height="404px"
                        style="width: 100%; color:darkslategray; font-size: 12px;" stripe border>
                        <!-- <el-table-column fixed type='index' width="30" /> -->
                        <el-table-column prop="quiz_name" sortable label="试卷名" />
                        <el-table-column prop="rel_score" sortable label="得分" />
                        <el-table-column prop="use_minutes" sortable label="分钟" />
                        <el-table-column prop="date_time" sortable label="考试时间" />
                        <el-table-column prop="note" label="备注" />
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import DataCard from '@/components/DataCard.vue';
import BarChart from '@/components/BarChart.vue';
import BigDay from '@/components/BigDay.vue';
import { Api } from '@/request';
import { IOverviewInfo } from '@/types/http';
import { ElMessage } from 'element-plus';
import { ADate } from '@/utils/date';
import HabbitVue from './Habbit.vue';

const greetStr = computed(() => {
    var h = new Date().getHours()
    var q = "好"
    if (h >= 0 && h < 8) {
        q = "早上" + q;
    } else if (h >= 8 && h < 12) {
        q = "上午" + q;
    } else if (h >= 12 && h < 18) {
        q = "下午" + q;
    } else {
        q = "晚上" + q;
    }
    return q
})

const meta: any = reactive({
    user: { id: 0, avatar: '@/assets/vue.svg', first_name: '', 'last_name': '' },
    big_days: [],
    statics: [
        { title: '科目数', icon: 'Notebook', data: 0 },
        { title: '试卷数', icon: 'Document', data: 0 },
        { title: '题库数', icon: 'Collection', data: 0 },
        { title: '错题数', icon: 'FolderDelete', data: 0 },
    ],
    quotes: [
        "不积跬步无以至千里，不积小流无以成江海。——荀子",
        "一寸光阴一寸金，寸金难买寸光阴。——增广贤文",
        "欲穷千里目，更上一层楼。——王之涣",
        "丈夫志四海，万里犹比邻。——曹植",
        "千里之行，始于足下。——老子",
        "吾生也有涯，而知也无涯。——庄子",
        "博观约取，厚积薄发。——苏轼"
    ],
    current_sub: '',
    exam_his: {
    },
    data_loaded: false,
    chart_display_num: 20,
    chart_title: '',
    exam_his_chart: {
        grid: { left: '1%', right: '1%', bottom: '8%', containLabel: true },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            formatter: (params: any) => {
                var str: string = '<span style="font-size: 12px;">'
                params.forEach((p: {
                    marker: any; seriesName: any; data: {
                        quiz: string; date_time: string; use_mins: number; value: any; d: any;
                    };
                }) => {
                    if (p.data.use_mins > 0) {
                        str += p.marker + p.seriesName + `【${p.data.quiz}】<br/>`
                        str += '考试时间: ' + p.data.date_time + '<br/>'
                        str += '用时: ' + p.data.use_mins + '分钟<br/>'
                    } else {
                        str += p.marker + p.seriesName + '【暂无数据】<br/>'
                    }
                })
                str += '</span>'
                return str
            }
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: [],
            textStyle: {
                color: '#999'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '分数',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: []
    }
})

// const store = useStore()
onMounted(async () => {
    var ui = Api.loadUserInfoFromStorage()
    if (ui == null) {
        return;
    }
    meta.user.id = ui.id
    meta.user.first_name = ui.first_name
    meta.user.last_name = ui.last_name
    meta.user.avatar = ui.avatar
    meta.data_loaded = false
    await Api.getOverviewInfo().then(res => {
        let info: IOverviewInfo = res.data
        meta.statics[0].data = info.subject_num
        meta.statics[1].data = info.quiz_num
        meta.statics[2].data = info.question_num
        meta.statics[3].data = info.wrongset_num
        meta.exam_his = {}
        var keys = Object.keys(info.exam_record)
        keys.forEach(k => {
            if (info.exam_record[k].length > 0) {
                let scores = []
                meta.exam_his[k] = info.exam_record[k]
                for (var i = 0; i < meta.chart_display_num; i++) {
                    scores.push(i < info.exam_record[k].length ? {
                        'value': info.exam_record[k][i].rel_score, 'date_time': info.exam_record[k][i].date_time,
                        'quiz': info.exam_record[k][i].quiz_name, 'use_mins': info.exam_record[k][i].use_minutes
                    } : { 'value': 0, 'date_time': 'NA', 'quiz': 'NA', 'use_mins': 0 })
                }
                meta.exam_his_chart.series.push({
                    name: k,
                    type: 'line',
                    data: scores.reverse(),
                    smooth: true
                })
            }
        })
        keys = Object.keys(meta.exam_his)
        if (keys.length > 0) {
            meta.current_sub = keys[0]
        }
        meta.exam_his_chart.legend.data = keys
        for (var i = 0; i < meta.chart_display_num; i++) {
            meta.exam_his_chart.xAxis[0].data.push(`${i + 1}`)
        }
        meta.chart_title = `考试记录(近${meta.chart_display_num}次)`
    }
    ).catch(err => {
        ElMessage.error('统计数据加载失败', err.status)
        return
    })

    await Api.getBigDays().then(res => {
        var now_str = (new ADate()).toString()
        var afterdays: any[] = []
        var beforedays: any[] = []
        res.data.results.forEach((d: { date: string; }) => {
            if (d.date < now_str) {
                beforedays.push(d)
            } else {
                afterdays.push(d)
            }
        })
        meta.big_days = afterdays.concat(beforedays.reverse())
        var lack_num = (meta.big_days.length + 1) % 8
        if (lack_num > 0) {
            for (var i = 0; i < 8 - lack_num; i++) {
                meta.big_days.push({ name: 'TO BE ADDED', description: '待添加', date: '--' })
            }
        }
    }
    ).catch(err => {
        ElMessage.error('纪念日数据加载失败', err.status)
        return
    })
    meta.data_loaded = true
})

</script>

<style lang="scss" scoped>
.dashboard-container {
    position: relative;
    padding: 10px;

    .user-avatar {
        width: 81px;
        height: 81px;
        border-radius: 50%;
    }

    .subject {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .github-corner {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99;
        border: 0;
    }

    .el-row {
        margin-bottom: 0px;
    }

    .svg-icon {
        fill: currentcolor !important;
    }

    .el-card:deep(.el-card__body) {
        padding: 6px;
    }
}
</style>