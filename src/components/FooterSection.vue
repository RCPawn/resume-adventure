<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">

      <div class="footer-brand">
        <h2 class="brand-name">{{ t('footer.appName') }}</h2>
        <p class="brand-tagline">{{ t('footer.tagline') }}</p>

        <div class="social-actions">
          <div class="social-links">
            <a v-for="(social, index) in tm('footer.socialLinks')" :key="index" :href="social.url" class="social-btn" target="_blank">
              <i :class="social.icon"></i>
            </a>
          </div>
          <button class="email-btn" @click="copyEmail" :class="{ 'copied': emailCopied }">
            <span class="icon">✉️</span>
            {{ emailCopied ? t('footer.emailCopied') : t('footer.copyEmail') }}
          </button>
        </div>
      </div>

      <div class="footer-tech">
        <h3>{{ t('footer.techTitle') }}</h3>
        <div class="tech-grid">
          <span v-for="tech in techStack" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
      </div>

      <div class="footer-nav">
        <div v-for="(group, index) in tm('footer.linkGroups')" :key="index" class="nav-group">
          <h4>{{ group.title }}</h4>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <a :href="link.url" :target="isExternal(link.url) ? '_blank' : '_self'">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>
      <p class="made-with">
        {{ t('footer.madeWith') }} <span class="heart">❤</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, tm } = useI18n();
const emailCopied = ref(false);
const isExternal = (url) => url.startsWith('http');
const techStack = ['Vue3', 'Vite', 'I18n', 'Reveal.js', 'Markdown-it', '@google/model-viewer']

// 复制邮箱功能
const copyEmail = () => {
  const email = 'shangxi0275@163.com'; // 记得替换成你的真实邮箱
  navigator.clipboard.writeText(email).then(() => {
    emailCopied.value = true;
    setTimeout(() => {
      emailCopied.value = false;
    }, 2000);
  });
};
</script>

<style scoped>
.footer-section {
  padding: 4rem 2rem 1.5rem;
  background-color: var(--nav-bg); /* 跟随主题 */
  border-top: 1px solid var(--border-color);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr; /* 左中右比例 */
  gap: 4rem;
  margin-bottom: 3rem;
}

/* --- 左侧品牌区 --- */
.brand-name {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: var(--text-color);
  letter-spacing: -1px;
}

.brand-tagline {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  max-width: 300px;
}

/* 状态胶囊 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981; /* 绿色在线状态 */
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  animation: pulse 2s infinite;
}

/* 社交与邮箱 */
.social-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-links {
  display: flex;
  gap: 0.8rem;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  transition: all 0.2s;
  box-shadow: var(--hover-shadow);
}

.social-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.email-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--modal-bg);
  color: var(--text-color);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: var(--hover-shadow);
}

.email-btn:hover {
  background: var(--btn-bg);
}

.email-btn.copied {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

/* --- 中间技术栈区 --- */
.footer-tech h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 10px;
  background: var(--btn-bg);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--text-color);
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: default;
}

.tech-tag:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--modal-bg);
}

/* --- 右侧导航区 --- */
.footer-nav {
  display: flex;
  gap: 3rem;
}

.nav-group h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.nav-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-group li {
  margin-bottom: 0.6rem;
}

.nav-group a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-group a:hover {
  color: var(--primary-color);
}

/* --- 底部版权 --- */
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright, .made-with {
  font-size: 0.85rem;
  color: var(--secondary-color);
  margin: 0;
}

.heart {
  color: #e63946;
  animation: heartbeat 1.5s ease infinite;
  display: inline-block;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr; /* 变成单列 */
    gap: 3rem;
    text-align: center;
  }

  .brand-tagline, .status-badge {
    margin-left: auto;
    margin-right: auto;
  }

  .social-actions {
    justify-content: center;
  }

  .tech-grid {
    justify-content: center;
  }

  .footer-nav {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>