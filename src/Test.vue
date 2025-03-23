<template>
  <div class="growth-container">
    <h2 class="title">{{ t('stuffs.growth', '技能成长与目标') }}</h2>
    <div class="chart-wrapper">
      <div ref="chartRef" class="growth-chart"></div>
      <div class="legend-panel">
        <div class="legend-item">
          <div class="legend-color current"></div>
          <span>{{ t('stuffs.current', '当前水平') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color target"></div>
          <span>{{ t('stuffs.target', '目标水平') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';

const { t, tm } = useI18n();
const chartRef = ref(null);
let chart = null;

// Combined data from skills with growth targets
// In a real app, you might want to get this from a dedicated i18n key
const growthData = ref([
  {
    name: '全栈开发',
    icon: 'fas fa-laptop-code',
    current: 60,
    target: 85,
    plan: '深入学习微服务架构，提升前端工程化水平，掌握DevOps实践'
  },
  {
    name: '数据库设计',
    icon: 'fas fa-database',
    current: 50,
    target: 75,
    plan: '学习数据库性能调优，掌握分布式数据库原理，实践NoSQL解决方案'
  },
  {
    name: '算法与数据结构',
    icon: 'fas fa-code',
    current: 55,
    target: 80,
    plan: '力扣刷题突破500道，深入学习高级算法，参与算法竞赛'
  },
  {
    name: '游戏与3D开发',
    icon: 'fas fa-gamepad',
    current: 30,
    target: 60,
    plan: '完成一个完整的3D游戏项目，学习游戏引擎架构，掌握着色器编程'
  },
  {
    name: '人工智能与机器学习',
    icon: 'fas fa-brain',
    current: 20,
    target: 70,
    plan: '系统学习机器学习基础理论，掌握PyTorch框架，完成2个实际AI项目'
  },
  {
    name: '版本控制与协作',
    icon: 'fab fa-github',
    current: 60,
    target: 80,
    plan: '贡献开源项目，建立个人技术博客，参与技术社区交流'
  }
]);

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

  const skills = growthData.value;
  const skillNames = skills.map(skill => skill.name);
  const currentLevels = skills.map(skill => skill.current);
  const targetLevels = skills.map(skill => skill.target);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [
        t('stuffs.current', '当前水平'),
        t('stuffs.target', '目标水平')
      ],
      textStyle: {
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: skillNames,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    series: [
      {
        name: t('stuffs.current', '当前水平'),
        type: 'bar',
        barWidth: 15,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%'
        },
        data: currentLevels,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: t('stuffs.target', '目标水平'),
        type: 'bar',
        barWidth: 15,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%'
        },
        data: targetLevels,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  };

  chart.setOption(option);
};

const highlightSkill = (index) => {
  if (!chart) return;

  chart.dispatchAction({
    type: 'highlight',
    seriesIndex: [0, 1],
    dataIndex: index
  });
};

const resetHighlight = () => {
  if (!chart) return;

  chart.dispatchAction({
    type: 'downplay',
    seriesIndex: [0, 1]
  });
};

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
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  color: #333;
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

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.current {
  background-color: #409EFF;
}

.legend-color.target {
  background-color: #67C23A;
}

.growth-header i {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  color: #409EFF;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
}

.growth-header h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

</style>