<template>
    <div class="dashboard-container">
        <!-- github角标 -->
        <!-- <github-corner class="github-corner" /> -->

        <!-- 用户信息 -->
        <el-row class="mb-4">
            <el-card class="w-full mb-4">
                <div class="flex justify-between flex-wrap">
                    <div class="flex items-center">
                        <img class="user-avatar" :src="meta.user.avatar" />
                        <router-link style="color:dodgerblue;" to="/userInfo">{{ meta.user.last_name }}, {{
                            meta.user.first_name}}</router-link>
                    </div>
                    <div class="flex items-center">
                        <el-link type="danger" size="large" @click="onLinkClicked(0)">{{ meta.title.quote }}</el-link>
                    </div>
                    <div class="flex items-center">
                        <el-link type="success" size="large" @click="onLinkClicked(1)">{{ meta.title.greeting }}</el-link>
                    </div>
                </div>
            </el-card>
        </el-row>

        <!-- 数据卡片 -->
        <el-row :gutter="16" class="mb-4">
            <el-col v-for="d in meta.statics" :xs="12" :sm="6" :lg="6" class="mb-4">
                <DataCard :title="d.title" :data="d.data" :icon="d.icon"></DataCard>
            </el-col>
        </el-row>

        <!-- Echarts 图表 -->
        <el-row :gutter="16">
            <el-col :sm="12" class="mb-4">
                <BarChart id="barChart" title="历史记录" height="400px" width="100%" :options="meta.exam_his_chart"
                    class="bg-[var(--el-bg-color-overlay)]" />
            </el-col>

            <!-- 表格记录 -->
            <el-col :sm="12" class="mb-4">
                <el-card>
                    <div class="subject">
                        <el-radio-group v-model="meta.current_sub" size="small">
                            <el-radio-button v-for="(val, key) in meta.exam_his" :label="key"> {{ key }}({{
                                val.length }})</el-radio-button>
                        </el-radio-group>
                    </div>
                    <el-table :data="meta.exam_his[meta.current_sub]"
                        style="width: 100%; color:darkslategray; font-size: 12px;" stripe border>
                        <!-- <el-table-column fixed type='index' width="30" /> -->
                        <el-table-column prop="quiz_name" label="试卷名" width="72" />
                        <el-table-column prop="rel_score" label="得分" width="50" />
                        <el-table-column prop="use_minutes" label="分钟" width="50" />
                        <el-table-column prop="date_time" label="考试时间" width="144" />
                        <el-table-column prop="note" label="备注" />
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import DataCard from '@/components/DataCard.vue';
import BarChart from '@/components/BarChart.vue';
import { Api } from '@/request';
import * as echarts from 'echarts'
import { IOverviewInfo } from '@/types/http';
import { ElMessage } from 'element-plus';
import router from '@/router';


const meta: any = reactive({
    title: { greeting: '', quote: '' },
    user: { id: 0, avatar: '@/assets/vue.svg', first_name: '', 'last_name': '' },
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
    exam_his_chart: {
        grid: {
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['收入', '毛利润', '收入增长率', '利润增长率'],
            textStyle: {
                color: '#999'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: ['浙江', '北京', '上海', '广东', '深圳'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: 10000,
                interval: 2000,
                axisLabel: {
                    formatter: '{value} '
                }
            },
            {
                type: 'value',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '收入',
                type: 'bar',
                data: [7000, 7100, 7200, 7300, 7400],
                barWidth: 20,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                }
            },
            {
                name: '毛利润',
                type: 'bar',
                data: [8000, 8200, 8400, 8600, 8800],
                barWidth: 20,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#25d73c' },
                        { offset: 0.5, color: '#1bc23d' },
                        { offset: 1, color: '#179e61' }
                    ])
                }
            },
            {
                name: '收入增长率',
                type: 'line',
                yAxisIndex: 1,
                data: [60, 65, 70, 75, 80],
                itemStyle: {
                    color: '#67C23A'
                }
            },
            {
                name: '利润增长率',
                type: 'line',
                yAxisIndex: 1,
                data: [70, 75, 80, 85, 90],
                itemStyle: {
                    color: '#409EFF'
                }
            }
        ]
    }
})

const onLinkClicked = (index: number) => {
    switch (index) {
        case 0:
            meta.title.quote = meta.quotes[Math.floor(Math.random() * meta.quotes.length)]
            break
        case 1:
            var date = new Date()
            let h = date.getHours()
            if (h >= 6 && h < 8) {
                meta.title.greeting = "晨起披衣出草堂，轩窗已自喜微凉🌅！";
            } else if (h >= 8 && h < 12) {
                meta.title.greeting = "上午好🌞！";
            } else if (h >= 12 && h < 18) {
                meta.title.greeting = "下午好☕！";
            } else if (h >= 18 && h < 24) {
                meta.title.greeting = "晚上好🌃！";
            } else if (h >= 0 && h < 6) {
                meta.title.greeting = "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
            }
            ElMessage.success({
                message: `${date.toLocaleString('zh-CN')} ${meta.title.greeting}`,
                duration: 1000
            })
            break
    }
}

// const store = useStore()
onMounted(() => {
    onLinkClicked(0)
    onLinkClicked(1)
    var ui = Api.loadUserInfoFromStorage()
    if (ui == null) {
        return;
    }
    meta.user.id = ui.id
    meta.user.first_name = ui.first_name
    meta.user.last_name = ui.last_name
    meta.user.avatar = ui.avatar
    Api.getOverviewInfo(ui.id).then(res => {
        let info: IOverviewInfo = res.data
        meta.statics[0].data = info.subject_num
        meta.statics[1].data = info.quiz_num
        meta.statics[2].data = info.question_num
        meta.statics[3].data = info.wrongset_num
        meta.exam_his = info.exam_record
        meta.current_sub = Object.keys(meta.exam_his)[0]
    }
    ).catch(err=>{
        ElMessage.error('加載失敗')
    })
})

</script>

<style lang="scss" scoped>
.dashboard-container {
    position: relative;
    padding: 10px;

    .user-avatar {
        width: 48px;
        height: 48px;
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

    .data-box {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        font-weight: bold;
        color: var(--el-text-color-regular);
        background: var(--el-bg-color-overlay);
        border-color: var(--el-border-color);
        box-shadow: var(--el-box-shadow-dark);
    }

    .el-row {
        margin-bottom: 0px;
    }

    .svg-icon {
        fill: currentcolor !important;
    }

    .el-card:deep(.el-card__body) {
        padding: 10px;
    }
}
</style>