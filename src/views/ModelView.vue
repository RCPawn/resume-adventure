<!--
<template>
  <div class="model-container">
    &lt;!&ndash; 返回按钮 &ndash;&gt;
    <div class="control-top">
      <GoBackButton class="back-button"/>
    </div>

    &lt;!&ndash; 画布容器 &ndash;&gt;
    <div ref="container" class="canvas-wrapper"></div>

    &lt;!&ndash; 修改加载提示部分 &ndash;&gt;
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-progress">
          <div class="loading-text">稍等一下 {{ loadProgress.toFixed(0) }}%</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: `${loadProgress}%`}"></div>
          </div>
        </div>
      </div>
    </div>

    &lt;!&ndash; 操作指引 &ndash;&gt;
    <div class="model-notice">
      <div class="notice-box">
        <div class="notice-header">
          ⚠️ 模型说明
        </div>
        <div class="notice-content">
          <p>当前模型导出存在问题，sprinkles装饰部分未能正常显示，暂用此简化版替代</p>
        </div>

        <div class="control-guide">
          <div class="guide-item">
            <span class="key-icon">🖱️</span>
            <div class="guide-text">
              <strong>视角旋转</strong><br>
              鼠标左键拖动
            </div>
          </div>

          <div class="guide-item">
            <span class="key-icon">⌨️</span>
            <div class="guide-text">
              <strong>视角平移</strong><br>
              Shift + 鼠标左键拖动
            </div>
          </div>

          <div class="guide-item">
            <span class="key-icon">🖱️</span>
            <div class="guide-text">
              <strong>缩放控制</strong><br>
              鼠标滚轮滑动
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import GoBackButton from '@/components/GoBackButton.vue'

const container = ref(null)
const loading = ref(true)  // 加载状态标识
// 添加进度状态
const loadProgress = ref(0)

let scene = null
let camera = null
let renderer = null
let controls = null
let mixer = null
let clock = new THREE.Clock()
let animationId = null

const initScene = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f2f5)

  // 调整相机初始参数
  camera = new THREE.PerspectiveCamera(
      50, // 更自然的视角
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // 优化光照系统
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(-3, 5, 3)
  directionalLight.castShadow = true
  scene.add(directionalLight)
}

// 1. 添加CDN配置 (示例使用变量来控制资源URL)
/*
const modelBasePath = import.meta.env.PROD
    ? 'https://cdn.jsdelivr.net/gh/RCPawn/large-file-resources@master/' // 生产环境使用CDN
    : 'models/' // 开发环境使用本地路径
*/

// 2. 实现模型加载器
const loadModel = async () => {
  const loader = new GLTFLoader()
  // 添加加载进度监听
  loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    loadProgress.value = (itemsLoaded / itemsTotal) * 100
  }

  try {
    // 使用GitHub Raw链接替换本地路径
    const gltf = await loader.loadAsync('models/donut.glb')
    const model = gltf.scene
    scene.add(model)

    // 精确居中计算
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    model.position.sub(center)

    // 动态视角调整
    const maxDim = Math.max(size.x, size.y, size.z)
    const cameraDistance = maxDim * 2.8

    camera.position.set(-cameraDistance, maxDim * 0.7, cameraDistance)
    camera.lookAt(0, maxDim * 0.25, 0)

    // 控制器参数优化
    controls.target.set(0, maxDim * 0.25, 0)
    controls.maxDistance = maxDim * 5
    controls.minDistance = maxDim * 0.6
    controls.update()

    // 动画系统
    if (gltf.animations?.length) {
      mixer = new THREE.AnimationMixer(model)
      gltf.animations.forEach(clip => {
        mixer.clipAction(clip).play()
      })
    }

    // 启用自然旋转
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8

  } catch (error) {
    console.error('模型加载失败:', error)
  } finally {
    loading.value = false  // 加载完成或出错后隐藏加载提示
  }
}

const initControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.screenSpacePanning = true
  controls.maxPolarAngle = Math.PI / 1.8
}

const animate = () => {
  mixer?.update(clock.getDelta())
  controls.update()
  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(async () => {
  initScene()
  initControls()
  await loadModel()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationId)
  controls?.dispose()
  renderer?.dispose()
  if (mixer) mixer.stopAllAction()
})
</script>

<style scoped>

.model-container {
  position: relative;
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

/* 优化加载提示样式 - 简约浅蓝色版本 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 400px;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4db8ff; /* 浅蓝色 */
  border-radius: 100px;
  transition: width 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .loading-text {
    font-size: 15px;
  }

  .progress-bar {
    height: 6px;
  }
}

/* 控制按钮及其他样式 */
.control-top {
  position: absolute;
  top: 40px;
  left: 20px;
  z-index: 10;
}

.back-button {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.back-button:hover {
  transform: translateY(-2px);
}

.model-notice {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 90%;
  max-width: 600px;
}

.notice-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  backdrop-filter: blur(4px);
}

canvas {
  display: block;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}

.notice-header {
  font-size: 16px;
  font-weight: 600;
  color: #f57c00;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.notice-content {
  margin: 12px 0;
  color: #666;
}

.control-guide {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.key-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-text {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
  color: #444;
}

.guide-text strong {
  color: #333;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .model-notice {
    bottom: 10px;
    width: 95%;
  }

  .notice-box {
    padding: 12px;
  }

  .guide-item {
    gap: 8px;
  }

  .key-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .guide-text {
    font-size: 12px;
  }

  .loading-text {
    font-size: 18px;
  }
}

/* 移动端适配增强 */
@media (max-width: 768px) {
  .control-top {
    top: 20px;
    left: 15px;
  }

  .model-notice {
    bottom: 20px;
    width: 95%;
  }

  .notice-box {
    padding: 12px;
  }

  .notice-header {
    font-size: 15px;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }

  .notice-content {
    margin: 8px 0;
    font-size: 13px;
  }

  .control-guide {
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
  }

  .guide-item {
    gap: 8px;
  }

  .key-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .guide-text {
    font-size: 12px;
  }

  .loading-text {
    font-size: 16px;
  }

  .progress-bar {
    height: 6px;
  }
}
</style>-->
<template>
  <div class="viewer-page">

    <!-- 1. 顶部返回区域 -->
    <div class="header-bar">
      <GoBackButton class="glass-btn" />
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
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        class="model-canvas"
        @progress="onProgress"
        @load="onLoad"
        @error="onError"
    >
      <!-- AR 按钮 (仅在支持AR的设备显示) -->
      <button slot="ar-button" class="ar-btn">
        📷 AR 实景查看
      </button>
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
// 引入 model-viewer 包，这会自动注册 <model-viewer> 标签
import '@google/model-viewer'
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
  background-color: #f5f7fa; /* 柔和背景色 */
  background-image: radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f2f5 100%);
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
.glass-btn {
  /* 假设 GoBackButton 内部有 button，这里给外层加样式或你需要穿透样式 */
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  background-color: #ff9800;
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.4);
}

.panel-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.panel-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.gesture-guide {
  display: flex;
  gap: 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 12px;
}

.guide-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #555;
  font-weight: 500;
}

.emoji {
  font-size: 16px;
  margin-right: 6px;
}

/* ------ 加载遮罩 ------ */
.loading-mask {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.loading-content {
  text-align: center;
  width: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-info h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s ease;
}

/* ------ AR 按钮 ------ */
.ar-btn {
  position: absolute;
  bottom: 200px; /* 位于信息卡片上方 */
  right: 20px;
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 8;
  transition: transform 0.2s;
}

.ar-btn:active {
  transform: scale(0.95);
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

  .ar-btn {
    bottom: auto;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>