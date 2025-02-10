<template>
  <div class="split-container">
    <!-- 左上角返回主页按钮 -->
    <GoBackButton />

    <!-- 左侧：游戏入口区 -->
    <div class="game-portal" @mousemove="handleGameHover" aria-label="Game Portal">
      <div class="portal-content" :style="gameTransform">
        <h2 class="portal-title">Resume Adventure</h2>
        <div class="planet-container">
          <div class="planet" @click="navigateToGame" tabindex="0" role="button" aria-label="Enter Resume Adventure"
            @keydown.enter="navigateToGame">
            <div class="crater crater-1"></div>
            <div class="crater crater-2"></div>
            <div class="crater crater-3"></div>
            <div class="glow"></div>
          </div>
        </div>
        <!-- 粒子效果 -->
        <div class="particle" v-for="(p, i) in particles" :key="i" :style="particleStyle(p)"></div>
      </div>
    </div>

    <!-- 右侧：Projects 入口区 -->
    <div class="projects-portal" @click="navigateToProjects" tabindex="0" role="button" aria-label="Enter Projects"
      @keydown.enter="navigateToProjects">
      <div class="portal-content projects-content">
        <h2 class="portal-title">Projects</h2>
        <p class="portal-description">Click to explore my projects</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GoBackButton from '@/components/GoBackButton.vue'

const router = useRouter()

// 鼠标位置（用于 3D 效果）
const mouseX = ref(0)
const mouseY = ref(0)
// 粒子数组
const particles = ref([])

// 计算 3D 效果及缩放、亮度调节（增强悬浮效果）
const gameTransform = computed(() => ({
  transform: `rotateY(${(mouseX.value - 0.5) * 20}deg) rotateX(${(mouseY.value - 0.5) * -20}deg) scale(1.05)`,
  filter: `brightness(${1 + (0.5 - Math.abs(mouseX.value - 0.5)) * 0.5})`
}))

// 防抖函数
const throttle = (func, delay) => {
  let lastCall = 0
  return (...args) => {
    const now = new Date().getTime()
    if (now - lastCall < delay) return
    lastCall = now
    return func(...args)
  }
}

const handleGameHover = throttle((e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width
  mouseY.value = (e.clientY - rect.top) / rect.height
}, 16) // 16ms 防抖，60fps

// 创建粒子效果，增加粒子数量，并自动清理旧粒子
const createParticles = () => {
  const createParticle = () => {
    if (particles.value.length < 50) {
      particles.value.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.02 + 0.01,
        delay: Math.random() * 2
      })
    }
  };

  const loop = () => {
    createParticle()
    requestAnimationFrame(loop)
  };

  loop() // 启动动画帧
}

// 返回粒子样式
const particleStyle = (p) => ({
  left: `${p.x * 100}%`,
  top: `${p.y * 100}%`,
  width: `${p.size}px`,
  height: `${p.size}px`,
  animation: `float ${5 / p.speed}s linear infinite`,
  animationDelay: `${p.delay}s`
})

// 导航逻辑
const navigateToGame = () => {
  router.push('/projects/adventure')
}

const navigateToProjects = () => {
  router.push('/gateway/projects')
}

onMounted(() => {
  createParticles()
})
</script>

<style scoped>
:root {
  --primary-color: #48cae4;
  --secondary-color: #0077b6;
  --bg-dark-start: #1a1a2e;
  --bg-dark-end: #16213e;
  --text-dark: #2d3436;
  --hover-glow: rgba(72, 202, 228, 0.6);
}

/* 整体分栏布局 */
.split-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 95vh;
  position: relative;
  background: url('/images/gateway.webp') no-repeat center center/cover;
  backdrop-filter: blur(10px);
  /* 背景模糊 */
}

/* ============ 左侧：游戏入口 ============ */
.game-portal {
  position: relative;
  background: rgba(26, 26, 46, 0.7);
  /* 背景透明度 */
  perspective: 1200px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s ease;
}

.game-portal:hover {
  background: rgba(22, 33, 62, 0.7);
}

.portal-content {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.portal-title {
  font-size: 3rem;
  background: linear-gradient(45deg, var(--primary-color), #90e0ef);
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  pointer-events: auto;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.planet-container {
  position: relative;
  width: 300px;
  height: 300px;
  pointer-events: auto;
  margin-bottom: 2rem;
}

.planet {
  position: relative;
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  outline: none;
  will-change: transform;
  /* 提升动画性能 */
}

.planet:hover,
.planet:focus {
  transform: scale(1.1);
  box-shadow: 0 0 20px var(--hover-glow);
}

.crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.crater-1 {
  width: 40px;
  height: 40px;
  top: 30%;
  left: 20%;
}

.crater-2 {
  width: 25px;
  height: 25px;
  top: 60%;
  left: 50%;
}

.crater-3 {
  width: 30px;
  height: 30px;
  top: 20%;
  left: 65%;
}

.glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 20px var(--primary-color);
  opacity: 0.8;
}

/* 粒子效果 */
.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  filter: blur(1px);
}

/* 动画 */
@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* ============ 右侧：Projects 入口 ============ */
.projects-portal {
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  /* 背景透明度 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.3s ease;
}

.projects-portal:hover {
  background: rgba(255, 255, 255, 0.9);
}

.portal-content.projects-content {
  pointer-events: auto;
  text-align: center;
}

.portal-content.projects-content .portal-title {
  font-size: 3rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  background: none;
  -webkit-text-fill-color: initial;
}

.portal-description {
  font-size: 1.2rem;
  color: var(--text-dark);
}

/* ============ 响应式设计 ============ */
@media (max-width: 768px) {
  .split-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
    /* 给分栏加点间隔 */
  }

  .planet-container {
    width: 80%;
    height: auto;
  }

  .planet {
    width: 100%;
    height: auto;
  }

  .projects-portal {
    padding: 10px;
  }
}
</style>
