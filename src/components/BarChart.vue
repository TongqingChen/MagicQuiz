<!--  线 + 柱混合图 -->
<template>
  <el-card>
    <template #header>{{ title }}</template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts';

const props = defineProps({
  id: {
    type: String,
    default: 'barChart1'
  },
  className: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '柱状图'
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  },
  options: {
    default: {},
  }
});

onMounted(() => {
  // 图表初始化
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(props.options);
  // 大小自适应
  window.addEventListener('resize', () => {
    chart.resize();
  });
});
</script>

<style lang="scss" scoped>
.el-card:deep(.el-card__header) {
  padding: 8px 18px;
  font-size: 14px;
}
// .el-card:deep(.el-card__body) {
//         margin-top: -20px;
//     }
</style>
