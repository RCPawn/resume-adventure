<template>
  <section id="skills" class="skills-wrapper">
    <div class="cyber-container">

      <header class="cyber-header">
        <div class="header-left">
          <span class="glitch-title" data-text="SYSTEM_CAPABILITY">SYSTEM_CAPABILITY</span>
          <div class="path-info">// {{ t('skills.title') }}</div>
        </div>
        <div class="header-right">
          <div class="status-box">
            <span class="pulse-dot"></span>
            <span class="status-text">{{ t('skills.status') }}</span>
          </div>
        </div>
      </header>

      <div class="terminal-layout">

        <nav class="side-modules">
          <div
              v-for="(mod, key, index) in modules"
              :key="key"
              class="module-card"
              :class="{ active: activeKey === key }"
              @mouseenter="playTickSound"
              @click="switchModule(key)"
          >
            <div class="card-bg"></div>
            <div class="card-content">
              <span class="mod-no">0{{ index + 1 }}</span>
              <span class="mod-name">{{ mod.name }}</span>
            </div>
            <div class="active-glow"></div>
          </div>
        </nav>

        <main class="hologram-display">
          <div class="screen-grid"></div>
          <div class="screen-scanline"></div>

          <div class="display-top">
            <span class="stream-id">DATA_STREAM: {{ activeKey.toUpperCase() }}</span>
            <span class="real-time">{{ currentTime }}</span>
          </div>

          <div class="description-view">
            <p class="typewriter">
              <span class="prompt">></span> {{ displayedText }}<span class="cursor">_</span>
            </p>
          </div>

          <div class="skills-matrix">
            <div
                v-for="(item, idx) in currentData.items"
                :key="idx"
                class="skill-chip"
                @mouseenter="playTickSound"
            >
              <div class="chip-icon">{{ getIcon(activeKey, idx) }}</div>
              <div class="chip-info">
                <h4 class="chip-title">{{ item.name }}</h4>
                <div class="chip-tags">
                  <span v-for="tag in item.tags" :key="tag" class="tag">#{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm, locale } = useI18n();
const activeKey = ref('java');
const displayedText = ref('');
const currentTime = ref('');
let typeTimer = null;

const modules = computed(() => tm('skills.modules'));
const currentData = computed(() => tm(`skills.modules.${activeKey.value}`));

// 图标映射
const iconMap = {
  java: ['☕', '🧠', '🌱'],
  cloud: ['☁️', '🚦', '🌐'],
  data: ['💾', '⚡', '🐇'],
  frontend: ['🎨', '🛠️', '🖥️'],
  performance: ['🚀', '📈', '🛡️']
};
const getIcon = (key, idx) => iconMap[key]?.[idx] || '💎';

// --- 🔉 优化后的音效系统 ---
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
};

// 交互微声
const playTickSound = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
};

// 机械键盘打字音
const playTypeSound = () => {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.02;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

  noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  noise.start();
};

// --- ⌨️ 打字机逻辑 ---
const startTyping = (text) => {
  if (typeTimer) clearInterval(typeTimer);
  displayedText.value = '';
  let i = 0;
  typeTimer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text.charAt(i);
      playTypeSound(); // 每打一个字播放一次音效
      i++;
    } else {
      clearInterval(typeTimer);
    }
  }, 25);
};

const switchModule = (key) => {
  if (activeKey.value === key) return;
  activeKey.value = key;
  // 切换时播放一个稍重的点击声
  if (audioCtx) {
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  }
};

watch([activeKey, locale], () => startTyping(currentData.value.desc), { immediate: true });

onMounted(() => {
  setInterval(() => { currentTime.value = new Date().toTimeString().split(' ')[0]; }, 1000);
  document.addEventListener('mousedown', initAudio, { once: true });
});
onUnmounted(() => clearInterval(typeTimer));
</script>

<style scoped>
.skills-wrapper {
  padding: 100px 0;
  overflow: hidden;
}

.cyber-container {
  /* 优化：稍微调大宽度，并向右微调对齐 */
  max-width: 1100px;
  margin-left: calc(50% - 530px); /* 动态计算实现稍微靠右 */
  margin-right: auto;
  padding: 0 40px;
}

/* 头部样式 */
.cyber-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.glitch-title {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--text-color);
  position: relative;
}

.path-info {
  font-size: 0.8rem;
  color: var(--primary-color);
  margin-top: 5px;
  opacity: 0.8;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  padding: 5px 12px;
  background: var(--btn-bg);
  border-radius: 4px;
}

.pulse-dot {
  width: 8px; height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}

/* 布局结构 */
.terminal-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  height: 520px;
}

/* 左侧磁带导航 */
.side-modules {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-card {
  position: relative;
  height: 70px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.card-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--modal-bg);
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 15px;
}

.mod-no {
  font-size: 0.7rem;
  color: var(--primary-color);
  font-family: serif;
  font-style: italic;
}

.mod-name {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 1px;
}

.active-glow {
  position: absolute;
  right: -20px; top: 0; width: 40px; height: 100%;
  background: var(--primary-color);
  filter: blur(20px);
  opacity: 0;
  transition: 0.3s;
}

.module-card:hover {
  transform: translateX(10px);
  border-color: var(--text-color);
}

.module-card.active {
  background: var(--text-color);
  border-color: var(--text-color);
  transform: translateX(15px);
}

.module-card.active .card-bg { background: var(--text-color); }
.module-card.active .mod-name, .module-card.active .mod-no { color: var(--bg-color); }
.module-card.active .active-glow { opacity: 0.6; }

/* 右侧全息屏 */
.hologram-display {
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  position: relative;
  padding: 35px;
  display: flex;
  flex-direction: column;
}

.screen-grid {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(var(--grid-line) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

.display-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--secondary-color);
  margin-bottom: 25px;
  font-family: monospace;
}

.description-view {
  min-height: 80px;
  margin-bottom: 35px;
}

.typewriter {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-color);
  margin: 0;
}

.prompt { color: var(--primary-color); font-weight: bold; }

/* 技能矩阵：回归卡片式 */
.skills-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.skill-chip {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.3s;
}

.skill-chip:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: var(--hover-shadow);
}

.chip-icon { font-size: 1.8rem; }
.chip-title {
  margin: 0 0 5px 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.chip-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.65rem;
  color: var(--primary-color);
  background: var(--btn-bg);
  padding: 1px 5px;
  border-radius: 2px;
}

.cursor { animation: blink 1s step-end infinite; color: var(--primary-color); }

@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
@keyframes blink { 50% { opacity: 0; } }

@media (max-width: 900px) {
  .cyber-container { margin: 0 auto; padding: 0 20px; }
  .terminal-layout { grid-template-columns: 1fr; height: auto; }
  .side-modules { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
  .module-card { min-width: 160px; transform: none !important; }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .cyber-container { max-width: 1300px; margin-left: calc(50% - 630px); }
  .terminal-layout { height: 580px; }
  .glitch-title { font-size: 2.1rem; }
  .module-card { height: 80px; }
  .mod-name { font-size: 1.05rem; }
  .hologram-display { padding: 40px; }
  .typewriter { font-size: 1.15rem; }
  .skills-matrix { gap: 22px; }
  .skill-chip { padding: 18px; }
}
</style>