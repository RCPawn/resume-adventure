<template>
  <div id="skills" class="tech-stack-container">
    <!-- 标题区域 -->
    <div class="header-section" data-aos="fade-up">
      <!-- 新增一个 wrapper 让图标和标题横向排列 -->
      <div class="title-wrapper">
        <span class="emoji-icon">⚡</span>
        <h2 class="section-title">专业 <span class="highlight">技能</span></h2>
      </div>
<!--      <p class="section-subtitle">核心技术栈</p>-->
    </div>

    <!-- 技能卡片网格 -->
    <div class="bento-grid">

      <!-- 卡片 1: Java与核心框架 (只留最硬核的) -->
      <div class="tech-card core-backend" @mousemove="handleMouseMove" @mouseleave="resetCard">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-header">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" class="tech-logo" alt="Java" />
            <h3>Java & Spring</h3>
          </div>
          <p class="card-desc">后端开发的基石与核心框架。</p>
          <div class="tag-container">
            <!-- ThreadLocal 是你项目的亮点，必须留 -->
            <span class="tech-tag highlight-tag">🧵 ThreadLocal</span>
            <span class="tech-tag">☕ Java 17</span>
            <span class="tech-tag">🧠 JVM</span>
            <span class="tech-tag">🍃 Spring Boot 3</span>
          </div>
        </div>
      </div>

      <!-- 卡片 2: 微服务架构 (这是你的杀手锏，竖长条展示) -->
      <div class="tech-card microservices" @mousemove="handleMouseMove" @mouseleave="resetCard">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-header">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" class="tech-logo" alt="Spring Cloud" />
            <h3>Cloud Native</h3>
          </div>
          <p class="card-desc">基于 Spring Cloud Alibaba 的并发治理方案。</p>
          <div class="tag-container">
            <span class="tech-tag">☁️ Spring Cloud Alibaba</span>
            <span class="tech-tag highlight-tag">☸️ Nacos</span>
            <span class="tech-tag">🛡️ Sentinel</span>
            <span class="tech-tag">🚪 Gateway</span>
            <span class="tech-tag">⚡ OpenFeign</span>
            <!-- Netty 是网关底层，写在这里很显深度 -->
            <span class="tech-tag">🚀 Netty</span>
          </div>
        </div>
      </div>

      <!-- 卡片 3: 数据存储与中间件 (去掉了冗余描述) -->
      <div class="tech-card data-infra" @mousemove="handleMouseMove" @mouseleave="resetCard">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="multi-logos">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" class="mini-logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" class="mini-logo" />
            </div>
            <h3>Data & Middleware</h3>
          </div>
          <div class="tag-container">
            <span class="tech-tag">🐬 MySQL</span>
            <!-- 简历里写了MVCC/锁，这里用一个词概括，显得懂底层 -->
            <span class="tech-tag">🔒 MVCC & Lock</span>
            <span class="tech-tag">⚡ Redis</span>
            <span class="tech-tag">🐰 RabbitMQ</span>
          </div>
        </div>
      </div>

      <!-- 卡片 4: 全栈能力 (只展示你能落地的) -->
      <div class="tech-card fullstack" @mousemove="handleMouseMove" @mouseleave="resetCard">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-header">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="tech-logo" alt="Vue" />
            <h3>Frontend</h3>
          </div>
          <div class="tag-container">
            <span class="tech-tag">Vue 3</span>
            <span class="tech-tag">Element Plus</span>
            <!-- 加上 WebGL 呼应你的3D主页 -->
            <span class="tech-tag highlight-tag">🧊 WebGL</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// 3D 倾斜逻辑保持不变
const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  // 减小旋转角度，让交互更微小精致
  const rotateX = ((y - centerY) / centerY) * -5;
  const rotateY = ((x - centerX) / centerX) * 5;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;

  const bg = card.querySelector('.card-bg');
  bg.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`;
};

const resetCard = (e) => {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  const bg = card.querySelector('.card-bg');
  bg.style.background = 'transparent';
};
</script>

<style scoped>
/* 新增：让图标和标题在同一行居中 */
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px; /* 图标和文字之间的间距 */
  margin-bottom: 0.5rem;
}

/* 核心布局与上一版一致，微调间距 */
.tech-stack-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: transparent;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem; /* 间距调小一点 */
}

.emoji-icon {
  font-size: 2.8rem;
  display: block;
  animation: bounce 2s infinite;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -1px;
}

.highlight {
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1.5rem;
}

.tech-card {
  background: white;
  border-radius: 20px;
  padding: 1.8rem; /* 内边距稍微调小 */
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: default;
  backdrop-filter: blur(10px);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  transition: background 0.2s;
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 布局分配 */
.core-backend {
  grid-column: span 2;
  background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%);
}

.microservices {
  grid-row: span 2;
  background: linear-gradient(145deg, #ffffff 0%, #f3fff3 100%);
}

.data-infra {
  background: linear-gradient(145deg, #ffffff 0%, #fffbf0 100%);
}

.fullstack {
  background: linear-gradient(145deg, #ffffff 0%, #fcf0ff 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.card-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.tech-logo {
  width: 36px;
  height: 36px;
}

.multi-logos {
  display: flex;
  gap: -8px;
}
.mini-logo {
  width: 32px;
  height: 32px;
}

.card-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  opacity: 0.8; /* 描述文字稍微淡一点，突出标签 */
}

/* 标签容器 */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: auto;
}

/* 标签样式优化 */
.tech-tag {
  padding: 0.4rem 0.8rem;
  background: rgba(0,0,0,0.03);
  color: #475569;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600; /* 字体加粗一点 */
  transition: all 0.3s;
  border: 1px solid rgba(0,0,0,0.02);
}

.tech-tag:hover {
  background: white;
  border-color: rgba(0,0,0,0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: #000;
}

.highlight-tag {
  background: #e0f2fe;
  color: #0284c7; /* 颜色加深一点，更醒目 */
}

@media (max-width: 992px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .core-backend {
    grid-column: span 2;
  }
  .microservices {
    grid-row: auto;
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .bento-grid {
    display: flex;
    flex-direction: column;
  }
  .section-title {
    font-size: 2rem;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>