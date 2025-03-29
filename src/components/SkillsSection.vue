<template>
  <!-- 保持原有模板结构不变 -->
  <div id="skills" class="skill-radar-container">
    <div class="section-title-container">
      <div class="title-wrapper">
        <span class="title-icon">🛠️</span>
        <h2 class="gradient-text">{{ t('skills.title') }}</h2>
      </div>
      <p v-if="t('skills.subtitle')" class="subtitle">{{ t('skills.subtitle') }}</p>
    </div>
    <div class="content-wrapper">
      <div class="chart-and-skills-container">
        <div ref="chartRef" class="chart-container"></div>
        <div class="skill-summary">
          <div
              v-for="(skill, index) in skills"
              :key="index"
              class="skill-summary-item"
              @mouseenter="highlightSkill(index)"
              @mouseleave="resetHighlight"
          >
            <!-- 保持原有技能展示结构 -->
            <div class="skill-summary-icon">
              <i :class="skill.icon"></i>
            </div>
            <div class="skill-summary-details">
              <div class="skill-summary-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-progress-bar">
                <div
                    class="skill-progress-fill"
                    :style="{ width: `${skill.level}%`, background: getSkillColor(index) }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue';
import {useI18n} from 'vue-i18n';
import * as echarts from 'echarts';

const {t, tm} = useI18n();
const chartRef = ref(null);
let chart = null;

// 响应式技能数据
const skills = computed(() => tm('skills.items') || []);

// 监听语言变化
watch(
    () => tm('skills.items'),
    () => {
      updateChart();
    }
);

const skillColors = [
  '#B3FFB3', // 清新绿色
  '#FFEB99', // 温暖黄色
  '#B3FFB3',
  '#FFB3B3', // 柔和红色
  '#FFB3B3',
  '#B3FFB3'
];


const getSkillColor = (index) => {
  return skillColors[index % skillColors.length];
};


// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  chart = echarts.init(chartRef.value);
  updateChart();
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart?.resize();
};

// 更新图表数据
const updateChart = () => {
  if (!chart || skills.value.length === 0) return;

  const skillNames = skills.value.map(skill => skill.name);
  const skillLevels = skills.value.map(skill => skill.level);

  const option = {
    // 保持原有图表配置
    backgroundColor: 'transparent',
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
                {color: 'rgba(64, 158, 255, 0.7)', offset: 0},
                {color: 'rgba(64, 158, 255, 0.2)', offset: 1}
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
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}: ${params.value}%`;
      }
    },
    textStyle: {
      fontFamily: "'Poppins', 'PingFang SC', sans-serif"
    },
    animation: true
  };

  chart.setOption(option);
};

// 高亮交互方法
const highlightSkill = (index) => {
  if (!chart || !skills.value.length) return;

  const values = skills.value.map((_, i) =>
      i === index ? skills.value[i].level : skills.value[i].level * 0.3
  );

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
              color: (params) => params.dataIndex === index
                  ? '#F56C6C'
                  : 'rgba(64, 158, 255, 0.7)'
            }
          }
        ]
      }
    ]
  });
};

const resetHighlight = () => {
  if (!chart || !skills.value.length) return;

  const values = skills.value.map(skill => skill.level);

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
                {color: 'rgba(64, 158, 255, 0.7)', offset: 0},
                {color: 'rgba(64, 158, 255, 0.2)', offset: 1}
              ])
            }
          }
        ]
      }
    ]
  });
};

// 生命周期管理
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
.section-title-container {
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
}

.title-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
}

.title-icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
  transform: translateZ(0);
  filter: drop-shadow(0 2px 5px rgba(255, 235, 100, 0.3));
  will-change: transform;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: 700;
  background: #333;
  -webkit-background-clip: text;
  background-clip: text;
  color: #333;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  position: relative;
  z-index: 2;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  font-weight: 400;
}

/* 下面为内容区域样式 */
.skill-radar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #F8F8F8;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
}

.chart-and-skills-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.chart-container {
  flex: 1;
  height: 500px;
  min-width: 400px;
}

.skill-summary {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-summary-item {
  display: flex;
  align-items: center;
  background-color: #F8F8F8;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.skill-summary-item:hover {
  transform: translateY(-5px);
}

.skill-summary-icon {
  margin-right: 1rem;
  background-color: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-summary-icon i {
  font-size: 1.5rem;
  color: #409EFF;
}

.skill-summary-details {
  flex-grow: 1;
}

.skill-summary-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: 600;
  color: #333;
}

.skill-level {
  font-weight: 600;
  color: #409EFF;
}

.skill-progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress-fill {
  height: 100%;
  transition: width 1s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .chart-and-skills-container {
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    height: 400px;
    min-width: auto;
  }
}
</style>
