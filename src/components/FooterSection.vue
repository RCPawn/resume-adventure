<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">

      <div class="footer-brand">
        <h2 class="brand-name">{{ t('footer.appName') }}</h2>
        <p class="brand-tagline">{{ t('footer.tagline') }}</p>

        <div class="social-actions">
          <div class="social-links">
            <a v-for="(social, index) in tm('footer.socialLinks')" :key="index" :href="social.url" class="social-btn" target="_blank" :title="social.icon">
              <i :class="social.icon"></i>
            </a>
          </div>
          <button class="email-btn" @click="copyEmail" :class="{ 'copied': emailCopied }">
            <span class="btn-icon">
              <svg v-if="!emailCopied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
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
  padding: 5rem 2rem 2rem;
  background-color: var(--nav-bg);
  border-top: 1px solid var(--border-color);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.footer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  opacity: 0.3;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

/* --- 左侧品牌区 --- */
.brand-name {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.6rem;
  color: var(--text-color);
  letter-spacing: -1px;
  background: linear-gradient(135deg, var(--text-color), var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  color: var(--secondary-color);
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 300px;
}

/* 社交与邮箱 */
.social-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.social-links {
  display: flex;
  gap: 0.8rem;
}

.social-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--modal-bg), var(--btn-bg));
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.social-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light, var(--primary-color)));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn:hover::before {
  opacity: 1;
}

.social-btn:hover {
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--primary-color-rgb, 96, 165, 250), 0.3);
}

.social-btn i {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
}

.email-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--modal-bg), var(--btn-bg));
  color: var(--text-color);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.email-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light, var(--primary-color)));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.email-btn:hover::before {
  opacity: 1;
}

.email-btn:hover {
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--primary-color-rgb, 96, 165, 250), 0.25);
}

.email-btn .btn-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.email-btn span:not(.btn-icon) {
  position: relative;
  z-index: 1;
}

.email-btn.copied::before {
  opacity: 1;
  background: linear-gradient(135deg, #10b981, #059669);
}

.email-btn.copied {
  color: white;
  border-color: #10b981;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

/* --- 中间技术栈区 --- */
.footer-tech h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--secondary-color);
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  padding: 6px 14px;
  background: var(--btn-bg);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
  cursor: default;
  font-weight: 500;
}

.tech-tag:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--modal-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 96, 165, 250), 0.2);
}

/* --- 右侧导航区 --- */
.footer-nav {
  display: flex;
  gap: 3rem;
}

.nav-group h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: var(--text-color);
}

.nav-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-group li {
  margin-bottom: 0.8rem;
}

.nav-group a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.nav-group a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-group a:hover {
  color: var(--primary-color);
}

.nav-group a:hover::after {
  width: 100%;
}

/* --- 底部版权 --- */
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
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

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .brand-tagline {
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

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .footer-section {
    padding: 6rem 2rem 2.5rem;
  }
  
  .footer-container {
    max-width: 1400px;
    gap: 5rem;
  }
  
  .brand-name {
    font-size: 2.2rem;
  }
  
  .brand-tagline {
    font-size: 1.1rem;
    max-width: 350px;
  }
  
  .social-btn {
    width: 46px;
    height: 46px;
  }
  
  .email-btn {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
  
  .footer-tech h3 {
    font-size: 0.95rem;
  }
  
  .tech-tag {
    font-size: 0.9rem;
    padding: 7px 16px;
  }
  
  .nav-group h4 {
    font-size: 1rem;
  }
  
  .nav-group a {
    font-size: 0.95rem;
  }
}
</style>