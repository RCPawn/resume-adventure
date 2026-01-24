<template>
  <div class="growth-container">
    <h2 class="title">{{ t('skills.skillTarget') }}</h2>
    <div class="chart-wrapper">
      <div ref="chartRef" class="growth-chart"></div>
      <div class="legend-panel">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts'

const { t, locale, tm } = useI18n();
const chartRef = ref(null);
let chart = null;

const skillsData = computed(() => tm('skills.items'));

const initChart = () => {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  updateChart();
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart && chart.resize();
};

const updateChart = () => {
  if (!chart) return;

  const skills = skillsData.value;
  const skillNames = skills.map(skill => skill.name);
  const currentLevels = skills.map(skill => skill.level);
  const targetLevels = skills.map(skill => skill.target || (skill.level + 20));

  const option = {
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
    legend: {
      data: [t('skills.current'), t('skills.target')],
      textStyle: {color: '#666'}
    },
    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
    xAxis: [{type: 'value', max: 100, axisLabel: {formatter: '{value}%'}}],
    yAxis: [{type: 'category', data: skillNames, axisTick: {alignWithLabel: true}}],
    series: [
      {
        name: t('skills.current'),
        type: 'bar',
        barWidth: 15,
        label: {show: true, position: 'right', formatter: '{c}%'},
        data: currentLevels,
        itemStyle: {color: '#85C1E9'}
      },
      {
        name: t('skills.target'),
        type: 'bar',
        barWidth: 15,
        label: {show: true, position: 'right', formatter: '{c}%'},
        data: targetLevels,
        itemStyle: {color: '#B3FFB3'}
      }
    ]
  };

  chart.setOption(option);
};

// 监听语言变化，动态更新图表
watch(locale, () => {
  updateChart();
});

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.growth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--modal-bg);
  border-radius: 12px;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid var(--border-color);
  box-shadow: var(--hover-shadow);
}

.title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  font-weight: 600;
  text-align: center;
}

.chart-wrapper {
  width: 100%;
  position: relative;
}

.growth-chart {
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
}

.legend-panel {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
</style>