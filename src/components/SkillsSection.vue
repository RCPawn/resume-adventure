<template>
  <div class="skills-section" id="skills">
    <div class="section-title-container">
      <div class="title-wrapper">
        <span class="title-icon">⚡</span>
        <h2 class="gradient-text">{{ t('skills.title') }}</h2>
        <div class="title-decoration"></div>
      </div>
      <p v-if="t('skills.subtitle')" class="subtitle">{{ t('skills.subtitle') }}</p>
      <div class="napkin-energy-overlay"></div>
    </div>
    <div class="content-wrapper">
      <div ref="chartRef" class="chart-container">
        <div class="chart-decoration">
          <div class="napkin-shape napkin-circle"></div>
          <div class="napkin-shape napkin-square"></div>
          <div class="napkin-dot napkin-dot-1"></div>
          <div class="napkin-dot napkin-dot-2"></div>
        </div>
      </div>
      <div class="skill-details">
        <div
          v-for="(skill, index) in tm('skills.items')"
          :key="index"
          class="skill-card"
          @mouseenter="highlightSkill(index)"
          @mouseleave="resetHighlight()">
          <div class="skill-header">
            <div class="icon-container">
              <i :class="skill.icon"></i>
            </div>
            <h3>{{ skill.name }}</h3>
          </div>
          <p class="skill-description">{{ skill.desc }}</p>
          <div class="skill-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${skill.level}%` }"></div>
            </div>
            <span class="progress-text">{{ skill.level }}%</span>
          </div>
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
.skills-section {
  position: relative;
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.chart-container {
  flex: 1;
  height: 500px;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.chart-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.skill-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(100, 180, 255, 0.05));
  border-radius: 10px;
}

.skill-header i {
  font-size: 1.25rem;
  color: #409EFF;
}

.skill-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.skill-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #59c2ff);
  border-radius: 3px;
  transition: width 1s ease;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #409EFF;
  min-width: 45px;
  text-align: right;
}

/* 添加装饰性元素 */
.napkin-shape {
  position: absolute;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 50%;
}

.napkin-circle {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
}

.napkin-square {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  border-radius: 30px;
  transform: rotate(45deg);
}

.napkin-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
}

.napkin-dot-1 {
  top: 20%;
  left: 10%;
  animation: float 3s ease-in-out infinite;
}

.napkin-dot-2 {
  bottom: 30%;
  right: 15%;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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

.section-title-container {
  position: relative;
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 3rem;
}

.title-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #333 0%, #666 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
  padding: 0.5rem 0;
  position: relative;
  z-index: 2;
}

.title-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #333 0%, #666 100%);
  border-radius: 2px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

.napkin-energy-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, 
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  opacity: 0.6;
  pointer-events: none;
  z-index: 1;
}
</style>