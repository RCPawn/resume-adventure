<template>
  <div class="skill-radar-container">
    <h2 class="title">{{ t('skills.title') }}</h2>
    <div class="content-wrapper">
      <div ref="chartRef" class="chart-container"></div>
      <div class="skill-details">
        <div
            v-for="(skill, index) in tm('skills.items')"
            :key="index"
            class="skill-card"
            @mouseenter="highlightSkill(index)"
            @mouseleave="resetHighlight()">
          <div class="skill-header">
            <i :class="skill.icon"></i>
            <h3>{{ skill.name }}</h3>
          </div>
          <div class="skill-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${skill.level}%` }"></div>
            </div>
            <span class="progress-text">{{ skill.level }}%</span>
          </div>
          <p class="skill-description">{{ skill.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import * as echarts from 'echarts';

const {t, tm} = useI18n();
const chartRef = ref(null);
let chart = null;

// Calculate max level for scale reference
computed(() => {
  const skills = tm('skills.items');
  return Math.max(...skills.map(skill => skill.level));
});
// Create the chart
const initChart = () => {
  if (!chartRef.value) return;

  chart = echarts.init(chartRef.value);
  updateChart();

  // Handle resize events
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart && chart.resize();
};

const updateChart = () => {
  if (!chart) return;

  const skills = tm('skills.items');
  const skillNames = skills.map(skill => skill.name);
  const skillLevels = skills.map(skill => skill.level);

  const option = {
    backgroundColor: 'transparent',
    color: ['rgba(64, 158, 255, 0.7)'],
    radar: {
      indicator: skillNames.map(name => ({name, max: 100})),
      shape: 'polygon',
      splitNumber: 5,
      // TODO: 优化配色（黑色主题下不好看）
      axisName: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'normal'
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.3)', 'rgba(245, 245, 245, 0.5)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(200, 200, 200, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(200, 200, 200, 0.5)'
        }
      }
    },
    series: [
      {
        name: t('skills.title'),
        type: 'radar',
        data: [
          {
            value: skillLevels,
            name: t('skills.title'),
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                {
                  color: 'rgba(64, 158, 255, 0.7)',
                  offset: 0
                },
                {
                  color: 'rgba(64, 158, 255, 0.2)',
                  offset: 1
                }
              ])
            },
            lineStyle: {
              width: 2,
              color: '#409EFF'
            },
            symbolSize: 6,
            symbol: 'circle'
          }
        ]
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    textStyle: {
      fontFamily: "'Poppins', 'PingFang SC', sans-serif"
    },
    animation: true
  };

  chart.setOption(option);
};

// Highlight specific skill in the chart
const highlightSkill = (index) => {
  if (!chart) return;

  const skills = tm('skills.items');
  const values = skills.map((_, i) => i === index ? skills[i].level : skills[i].level * 0.3);

  chart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 0
  });

  chart.setOption({
    series: [
      {
        data: [
          {
            value: values,
            itemStyle: {
              color: i => i === index ? '#F56C6C' : 'rgba(64, 158, 255, 0.7)'
            },
            lineStyle: {
              width: 2,
              color: '#409EFF'
            }
          }
        ]
      }
    ]
  });
};

// Reset highlight
const resetHighlight = () => {
  if (!chart) return;

  const skills = tm('skills.items');
  const values = skills.map(skill => skill.level);

  chart.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: 0
  });

  chart.setOption({
    series: [
      {
        data: [
          {
            value: values,
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                {
                  color: 'rgba(64, 158, 255, 0.7)',
                  offset: 0
                },
                {
                  color: 'rgba(64, 158, 255, 0.2)',
                  offset: 1
                }
              ])
            }
          }
        ]
      }
    ]
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
.skill-radar-container {
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

.content-wrapper {
  display: flex;
  width: 100%;
  gap: 2rem;
  align-items: flex-start;
}

.chart-container {
  flex: 1;
  height: 500px;
  min-width: 400px;
}

.skill-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.skill-card {
  padding: 1.25rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
  cursor: pointer;
}

.skill-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  background-color: #f5f7fa;
  border-color: #dcdfe6;
}

.skill-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.skill-header i {
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

.skill-header h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.skill-progress {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: rgba(200, 200, 200, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-right: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #59c2ff);
  border-radius: 3px;
  transition: width 1s ease-in-out;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #409EFF;
  width: 50px;
  text-align: right;
}

.skill-description {
  font-size: 0.875rem;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }

  .skill-details {
    width: 100%;
    max-height: none;
    padding-right: 0;
  }

  .skill-card:hover {
    transform: translateY(-5px);
  }
}
</style>