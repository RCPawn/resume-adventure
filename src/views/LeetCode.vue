<script setup>
import {ref, onMounted, watch} from 'vue';
import * as echarts from 'echarts';
import {useI18n} from 'vue-i18n';
import GoBackButton from '@/components/GoBackButton.vue';

const {t} = useI18n();

const chartLineRef = ref(null);
const chartPieRef = ref(null);
const showCharts = ref(false);

// 模拟刷题数据（后续可对接API）
const stats = ref({
  easy: 150,
  medium: 120,
  hard: 50,
  total: 320,
  streak: 15, // 连续刷题天数
  tags: ['回溯', '动态规划', '贪心', '二分查找', '图算法', '搜索', '排序'],
  history: [
    {month: '2024-01', solved: 25},
    {month: '2024-02', solved: 50},
    {month: '2024-03', solved: 120},
    {month: '2024-04', solved: 180}
  ]
});

// 初始化折线图（刷题历程）
const initLineChart = () => {
  if (!chartLineRef.value) return;
  const chart = echarts.init(chartLineRef.value);
  const option = {
    title: {
      text: t('leetcode.lineChartTitle') || '刷题历程',
      left: 'center',
      textStyle: {fontSize: 18}
    },
    xAxis: {
      type: 'category',
      data: stats.value.history.map(item => item.month),
      axisLine: {lineStyle: {color: '#ccc'}}
    },
    yAxis: {type: 'value'},
    series: [{
      data: stats.value.history.map(item => item.solved),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#5DADE2'},
          {offset: 1, color: '#85C1E9'}
        ])
      },
      lineStyle: {width: 3},
      symbolSize: 8
    }],
    tooltip: {trigger: 'axis'}
  };
  chart.setOption(option);
};

// 初始化饼图（难度分布）
const initPieChart = () => {
  if (!chartPieRef.value) return;
  const chart = echarts.init(chartPieRef.value);
  const option = {
    title: {
      text: t('leetcode.pieChartTitle') || '难度分布',
      left: 'center',
      top: 10,
      textStyle: {fontSize: 18}
    },
    tooltip: {trigger: 'item'},
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: '难度',
      type: 'pie',
      radius: '50%',
      data: [
        {value: stats.value.easy, name: t('leetcode.easy') || '简单'},
        {value: stats.value.medium, name: t('leetcode.medium') || '中等'},
        {value: stats.value.hard, name: t('leetcode.hard') || '困难'}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  chart.setOption(option);
};

onMounted(() => {
  showCharts.value = true;
  initLineChart();
  initPieChart();
});

watch(showCharts, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      initLineChart();
      initPieChart();
    }, 200);
  }
});

// 标签点击事件（暂时只是打印标签）
const handleTagClick = (tag) => {
  console.log('Selected tag:', tag);
  // 未来可以在这里进行标签筛选逻辑
};
</script>

<template>
  <GoBackButton/>
  <div class="leetcode-page">
    <!-- 顶部Banner -->
    <header class="banner">
      <h1>{{ t('leetcode.overview') || '我的力扣刷题成果' }}</h1>
      <p>{{ t('leetcode.subOverview') || '累计解决题目：' }}{{ stats.total }} | {{
          t('leetcode.streak') || '连续刷题'
        }}：{{ stats.streak }} 天</p>
    </header>

    <!-- 数据概览卡 -->
    <section class="overview-cards">
      <div class="card easy" :title="`${stats.easy} ${t('leetcode.easy')}`">
        <div class="card-icon">💚</div>
        <div class="card-content">
          <h2>{{ stats.easy }}</h2>
          <p>{{ t('leetcode.easy') || '简单' }}</p>
        </div>
      </div>
      <div class="card medium" :title="`${stats.medium} ${t('leetcode.medium')}`">
        <div class="card-icon">💙</div>
        <div class="card-content">
          <h2>{{ stats.medium }}</h2>
          <p>{{ t('leetcode.medium') || '中等' }}</p>
        </div>
      </div>
      <div class="card hard" :title="`${stats.hard} ${t('leetcode.hard')}`">
        <div class="card-icon">❤️</div>
        <div class="card-content">
          <h2>{{ stats.hard }}</h2>
          <p>{{ t('leetcode.hard') || '困难' }}</p>
        </div>
      </div>
    </section>

    <!-- 标签云 -->
    <section class="tag-cloud">
      <h3>{{ t('leetcode.tags') || '标签云' }}</h3>
      <div class="tags">
        <span
            v-for="(tag, index) in stats.tags"
            :key="index"
            class="tag"
            @click="handleTagClick(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- 图表区 -->
    <section class="charts">
      <div class="chart-container" ref="chartLineRef"></div>
      <div class="chart-container" ref="chartPieRef"></div>
    </section>
  </div>
</template>

<style scoped>
.leetcode-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  background: #f8f8f8;
}

/* Banner 样式 */
.banner {
  text-align: center;
  background: #85C1E9;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.banner h1 {
  margin: 0;
  font-size: 28px;
}

.banner p {
  margin: 5px 0 0;
  font-size: 16px;
}

/* 数据概览卡 */
.overview-cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  width: 150px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 28px;
  margin-right: 10px;
}

.card-content h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.card-content p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.card.easy {
  border-left: 5px solid #67C23A;
}

.card.medium {
  border-left: 5px solid #409EFF;
}

.card.hard {
  border-left: 5px solid #F56C6C;
}

/* 标签云 */
.tag-cloud {
  text-align: center;
}

.tag-cloud h3 {
  margin-bottom: 10px;
}

.tags {
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
  transition: background 0.3s, color 0.3s;
}

.tag:hover {
  background: #409eff;
  color: #fff;
}

/* 图表容器 */
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  height: 300px;
  padding: 10px;
}
</style>
