<template>
  <div v-if="show" class="weather-modal-overlay" @click="closeModal">
    <div class="weather-modal-content" :class="{'mobile-modal': isMobile}" @click.stop>
      <button class="close-button" @click="closeModal">×</button>

      <div class="weather-app">
        <h1 class="app-title">天气预报</h1>

        <div class="search-container">
          <input
              v-model="city"
              placeholder="请输入城市名"
              class="city-input"
              @keyup.enter="getWeather"
          />
          <button @click="getWeather" class="search-button">
            <span class="search-icon">🔍</span>
            <span class="search-text">查询</span>
          </button>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在获取天气数据...</p>
        </div>

        <div v-else-if="weatherData && weatherData.status === '1' && weatherData.lives && weatherData.lives.length > 0" class="weather-result">
          <div class="location-info">
            <h2>{{ weatherData.lives[0].city }}</h2>
            <p class="date">{{ getCurrentDate() }}</p>
          </div>

          <div class="weather-main">
            <div class="temperature">
              <span class="temp-value">{{ weatherData.lives[0].temperature }}</span>
              <span class="temp-unit">°C</span>
            </div>

            <div class="weather-icon">
              {{ getWeatherEmoji(weatherData.lives[0].weather) }}
            </div>
          </div>

          <p class="weather-description">{{ weatherData.lives[0].weather }}</p>

          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">湿度</span>
              <span class="detail-value">{{ weatherData.lives[0].humidity }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">风向</span>
              <span class="detail-value">{{ weatherData.lives[0].winddirection }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">风力</span>
              <span class="detail-value">{{ weatherData.lives[0].windpower }}级</span>
            </div>
          </div>

          <div class="forecast-hint">
            <button @click="showForecast = !showForecast" class="forecast-button">
              {{ showForecast ? '隐藏预报' : '查看未来预报' }}
            </button>
          </div>

          <div v-if="showForecast" class="forecast-container">
            <p class="forecast-note">未来天气预报功能即将上线...</p>
          </div>
        </div>

        <div v-if="errorMessage" class="error">
          <p>{{ errorMessage }}</p>
          <button @click="resetInput" class="retry-button">重新输入</button>
        </div>

        <div v-if="!weatherData && !errorMessage && !loading" class="welcome-container">
          <p class="welcome-text">输入城市名称查询实时天气</p>
          <div class="suggestion-container">
            <p class="suggestion-title">热门城市:</p>
            <div class="suggestion-buttons">
              <button
                  v-for="(suggestedCity, index) in suggestedCities"
                  :key="index"
                  @click="selectCity(suggestedCity)"
                  class="suggestion-button"
              >
                {{ suggestedCity }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const city = ref('')
const weatherData = ref(null)
const errorMessage = ref('')
const loading = ref(false)
const showForecast = ref(false)
const suggestedCities = ['北京', '上海', '广州', '深圳', '杭州', '成都']

const closeModal = () => {
  emit('close')
}

const resetInput = () => {
  city.value = ''
  errorMessage.value = ''
}

const getWeather = async () => {
  if (!city.value.trim()) {
    errorMessage.value = '请输入城市名称'
    return
  }

  errorMessage.value = ''
  weatherData.value = null
  loading.value = true

  try {
    // 调用后端 Spring Boot 服务，通过中文城市名查询天气（后端会做 adcode 转换）
    const res = await axios.get(`http://localhost:8080/api/weather?cityName=${city.value}`)
    // 添加短暂延迟以展示加载效果
    setTimeout(() => {
      weatherData.value = res.data
      loading.value = false
    }, 600)
  } catch (error) {
    loading.value = false
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data
    } else {
      errorMessage.value = '获取天气信息失败，请稍后重试'
    }
  }
}

const selectCity = (selectedCity) => {
  city.value = selectedCity
  getWeather()
}

const getWeatherEmoji = (weatherDesc) => {
  if (!weatherDesc) return "❓"
  // 根据中文天气描述判断 Emoji 表情
  if (weatherDesc.includes("晴")) return "☀️"
  if (weatherDesc.includes("多云")) return "☁️"
  if (weatherDesc.includes("阴")) return "☁️"
  if (weatherDesc.includes("雨")) return "🌧️"
  if (weatherDesc.includes("雪")) return "❄️"
  if (weatherDesc.includes("风")) return "🌬️"
  if (weatherDesc.includes("雾")) return "🌫️"
  return "❓"
}

const getCurrentDate = () => {
  const now = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return now.toLocaleDateString('zh-CN', options)
}
</script>

<style scoped>
/* 弹窗遮罩层 */
.weather-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

/* 弹窗内容区域 - 增加了最大宽度 */
.weather-modal-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 90%;
  max-width: 550px; /* 增加最大宽度 */
  max-height: 90vh; /* 增加最大高度 */
  overflow-y: auto;
  animation: slideUp 0.4s ease-out;
  padding: 30px; /* 增加内边距 */
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 移动端样式 */
.mobile-modal {
  width: 95%;
  max-width: 400px; /* 增加移动端最大宽度 */
  padding: 20px;
}

/* 关闭按钮 - 调大 */
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 36px; /* 调大按钮 */
  height: 36px; /* 调大按钮 */
  font-size: 24px; /* 调大字体 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #444;
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

/* 天气应用样式 */
.weather-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.app-title {
  font-size: 30px; /* 调大标题字体 */
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

/* 搜索容器 */
.search-container {
  display: flex;
  width: 100%;
  margin-bottom: 24px;
}

.city-input {
  flex: 1;
  padding: 12px 16px; /* 调大输入框 */
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  font-size: 18px; /* 调大字体 */
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.city-input:focus {
  outline: none;
  border-color: #64b5f6;
  box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
}

.search-button {
  padding: 12px 20px; /* 调大按钮 */
  background: linear-gradient(135deg, #64b5f6 0%, #4299e1 100%);
  color: white;
  border: none;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-size: 18px; /* 调大字体 */
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.search-button:hover {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
}

.search-icon {
  margin-right: 8px;
  font-size: 20px; /* 调大图标 */
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 0;
}

.loading-spinner {
  border: 5px solid rgba(100, 181, 246, 0.3); /* 调大加载器 */
  border-radius: 50%;
  border-top: 5px solid #64b5f6;
  width: 50px; /* 调大加载器 */
  height: 50px; /* 调大加载器 */
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 18px; /* 调大字体 */
  color: #555;
}

/* 天气结果 */
.weather-result {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 25px; /* 增加内边距 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.location-info {
  text-align: center;
  margin-bottom: 24px;
}

.location-info h2 {
  font-size: 28px; /* 调大城市名称 */
  margin-bottom: 8px;
  color: #333;
}

.date {
  color: #666;
  font-size: 16px; /* 调大日期字体 */
}

.weather-main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.temperature {
  display: flex;
  align-items: baseline;
  margin-right: 25px;
}

.temp-value {
  font-size: 64px; /* 调大温度数字 */
  font-weight: 700;
  color: #333;
}

.temp-unit {
  font-size: 32px; /* 调大温度单位 */
  margin-left: 5px;
  color: #555;
}

.weather-icon {
  font-size: 64px; /* 调大天气图标 */
}

.weather-description {
  text-align: center;
  font-size: 24px; /* 调大天气描述 */
  color: #444;
  margin-bottom: 24px;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  min-width: 100px; /* 增加详情项宽度 */
}

.detail-label {
  font-size: 16px; /* 调大详情标签 */
  color: #666;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 20px; /* 调大详情值 */
  font-weight: 600;
  color: #333;
}

/* 预报提示和按钮 */
.forecast-hint {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.forecast-button {
  background-color: rgba(100, 181, 246, 0.2);
  color: #3182ce;
  border: 1px solid #3182ce;
  border-radius: 10px;
  padding: 10px 20px; /* 调大按钮 */
  font-size: 16px; /* 调大字体 */
  cursor: pointer;
  transition: all 0.3s;
}

.forecast-button:hover {
  background-color: rgba(100, 181, 246, 0.3);
}

.forecast-container {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.forecast-note {
  color: #666;
  font-style: italic;
  font-size: 16px; /* 调大字体 */
}

/* 错误信息 */
.error {
  width: 100%;
  padding: 20px;
  background-color: rgba(254, 226, 226, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.error p {
  color: #e53e3e;
  margin-bottom: 12px;
  text-align: center;
  font-size: 18px; /* 调大错误信息字体 */
}

.retry-button {
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px; /* 调大按钮 */
  font-size: 16px; /* 调大字体 */
  cursor: pointer;
  transition: all 0.3s;
}

.retry-button:hover {
  background-color: #c53030;
}

/* 欢迎页面 */
.welcome-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 0;
}

.welcome-text {
  font-size: 22px; /* 调大欢迎文字 */
  color: #444;
  margin-bottom: 24px;
  text-align: center;
}

.suggestion-container {
  width: 100%;
  text-align: center;
}

.suggestion-title {
  font-size: 18px; /* 调大标题 */
  color: #555;
  margin-bottom: 12px;
}

.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px; /* 增加按钮间距 */
}

.suggestion-button {
  background-color: rgba(100, 181, 246, 0.2);
  color: #3182ce;
  border: 1px solid #3182ce;
  border-radius: 8px;
  padding: 8px 16px; /* 调大按钮 */
  font-size: 16px; /* 调大字体 */
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-button:hover {
  background-color: rgba(100, 181, 246, 0.3);
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 自定义滚动条 */
.weather-modal-content::-webkit-scrollbar {
  width: 10px; /* 调大滚动条 */
}

.weather-modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.weather-modal-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.weather-modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
