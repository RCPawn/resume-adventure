<script setup>
import {ref, onMounted, watch} from 'vue';
import * as echarts from 'echarts';
import {useI18n} from 'vue-i18n';
import GoBackButton from '@/components/GoBackButton.vue'

const {t, tm} = useI18n();

const chartRef = ref(null);
const showChart = ref(false);

// 模拟刷题数据（后续可对接API）
const stats = ref({
  easy: 150,
  medium: 120,
  hard: 50,
  tags: ['回溯', '动态规划', '贪心', '二分查找', '图算法', '搜索', '排序'],
  history: [
    {month: '2024-01', solved: 25},
    {month: '2024-02', solved: 50},
    {month: '2024-03', solved: 120},
    {month: '2024-04', solved: 180}
  ]
});

// 初始化折线图
const initChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);

  const option = {
    title: {
      text: t('leetcode.title'),
      left: 'center',
      textStyle: {fontSize: 18}
    },
    xAxis: {
      type: 'category',
      data: stats.value.history.map(item => item.month),
      axisLine: {lineStyle: {color: '#ccc'}}
    },
    yAxis: {type: 'value'},
    series: [
      {
        data: stats.value.history.map(item => item.solved),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#67C23A'},
            {offset: 1, color: '#A7D3A6'}
          ])
        },
        lineStyle: {width: 3},
        symbolSize: 8
      }
    ],
    tooltip: {trigger: 'axis'}
  };

  chart.setOption(option);
};

onMounted(() => {
  showChart.value = true;
  initChart();
});

watch(showChart, (newVal) => {
  if (newVal) {
    setTimeout(() => initChart(), 200);
  }
});
</script>

<template>
  <GoBackButton/>
  <div class="leetcode-container">
    <!-- 成就徽章墙 -->
    <div class="badges">
      <div class="badge easy" :title="`${stats.easy} ${t('leetcode.easy')}`">💚 {{ t('leetcode.easy') }}</div>
      <div class="badge medium" :title="`${stats.medium} ${t('leetcode.medium')}`">💙 {{ t('leetcode.medium') }}</div>
      <div class="badge hard" :title="`${stats.hard} ${t('leetcode.hard')}`">❤️ {{ t('leetcode.hard') }}</div>
    </div>

    <!-- 标签云 -->
    <div class="tag-cloud">
      <span
          v-for="(tag, index) in stats.tags"
          :key="index"
          class="tag"
      >
        {{ tag }}
      </span>
    </div>

    <!-- 刷题历程折线图 -->
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.leetcode-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* 成就徽章墙 */
.badges {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.badge {
  padding: 10px 25px;
  font-size: 16px;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.badge:hover {
  transform: scale(1.1);
}

.easy {
  background: #67C23A;
}

.medium {
  background: #409EFF;
}

.hard {
  background: #F56C6C;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 16px;
  background: #f2f6fc;
  color: #409eff;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.tag:hover {
  background: #409eff;
  color: #fff;
}

/* 图表容器 */
.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
</style>
