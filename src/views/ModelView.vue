<template>
  <div class="model-container">
    <!-- 返回按钮 -->
    <div class="control-top">
      <GoBackButton class="back-button"/>
    </div>

    <!-- 画布容器 -->
    <div ref="container" class="canvas-wrapper"></div>

    <!-- 简化后的加载提示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-text">
          正在加载，请稍候
          <span class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </div>

    <!-- 操作指引 -->
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
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import GoBackButton from '@/components/GoBackButton.vue'

const container = ref(null)
const loading = ref(true)  // 加载状态标识

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

const loadModel = async () => {
  const loader = new GLTFLoader()

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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

/* 简化后的加载提示样式 */
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
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

/* 三点加载动画 */
.loading-dots {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #333;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
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
</style>