<template>
  <div class="viewer-page">

    <!-- 1. 顶部返回区域 -->
    <div class="header-bar">
      <GoBackButton />
    </div>

    <!-- 2. Google Model Viewer 核心组件 -->
    <!--
      load: 模型加载完成触发
      progress: 加载进度触发
      error: 加载失败触发
    -->
    <model-viewer
        id="main-viewer"
        src="models/donut.glb"
        camera-controls
        auto-rotate
        auto-rotate-delay="3000"
        interaction-prompt="auto"
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        class="model-canvas"
        @progress="onProgress"
        @load="onLoad"
        @error="onError"
    >
    </model-viewer>

    <!-- 3. 自定义加载遮罩 (比 model-viewer 自带的 poster 更灵活) -->
    <transition name="fade">
      <div v-if="loading" class="loading-mask">
        <div class="loading-content">
          <div class="spinner"></div>
          <div class="loading-info">
            <h3>模型加载中</h3>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: `${loadPercent}%` }"></div>
            </div>
            <span>{{ loadPercent }}%</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 4. 底部悬浮信息卡片 -->
    <div class="info-panel glass-card">
      <div class="panel-header">
        <span class="status-indicator warning"></span>
        <span class="panel-title">预览模式</span>
      </div>
      <p class="panel-desc">
        由于 WebGL 渲染限制，部分复杂装饰细节（Sprinkles）可能显示为简化材质。
      </p>

      <div class="gesture-guide">
        <div class="guide-item">
          <span class="emoji">👆</span>
          <span>拖动旋转</span>
        </div>
        <div class="guide-item">
          <span class="emoji">✌️</span>
          <span>双指缩放</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
// <model-viewer> 已在 main.js 注册
import GoBackButton from '@/components/GoBackButton.vue'

const loading = ref(true)
const loadPercent = ref(0)

// 监听加载进度
const onProgress = (event) => {
  // event.detail.totalProgress 是 0 到 1 之间的小数
  const progress = event.detail.totalProgress || 0
  loadPercent.value = Math.floor(progress * 100)
}

// 加载完成
const onLoad = () => {
  loadPercent.value = 100
  // 延迟 500ms 消失，保证用户看到 100%
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 错误处理
const onError = (error) => {
  console.error('模型加载出错:', error)
  loading.value = false
  alert('模型加载失败，请检查网络或文件路径')
}
</script>

<style scoped>
/* 全局容器 */
.viewer-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--nav-bg); /* 柔和背景色 */
  background-image: radial-gradient(circle at 50% 50%, var(--bg-color) 0%, var(--nav-bg) 100%);
  overflow: hidden;
}

/* 顶部栏 */
.header-bar {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

/* 3D 画布 */
.model-canvas {
  width: 100%;
  height: 100%;
  /* 移除点击时的蓝色高亮框 */
  outline: none;
  --poster-color: transparent;
}

/* ------ 样式优化核心：毛玻璃卡片 ------ */
.glass-card {
  background: var(--modal-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  box-shadow: var(--hover-shadow);
  border-radius: 20px;
}

/* ------ 底部信息面板 ------ */
.info-panel {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  padding: 20px;
  z-index: 5;
  transition: transform 0.3s ease;
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
.status-indicator.warning {
  background-color: var(--primary-color);
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
}

.panel-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-color);
}

.panel-desc {
  font-size: 13px;
  color: var(--secondary-color);
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.gesture-guide {
  display: flex;
  gap: 20px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

.guide-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--secondary-color);
  font-weight: 500;
}

.emoji {
  font-size: 16px;
  margin-right: 6px;
  color: var(--icon-color);
}

/* ------ 加载遮罩 ------ */
.loading-mask {
  position: absolute;
  inset: 0;
  background: var(--modal-bg);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  border: 1px solid var(--border-color);
}

.loading-content {
  text-align: center;
  width: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-info h3 {
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 10px;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.2s ease;
}

/* 动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 600px) {
  .info-panel {
    bottom: 20px;
    padding: 16px;
  }
}
</style>