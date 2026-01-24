<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">
      <div class="footer-logo">
        <h2>{{ t('footer.appName') }}</h2>
        <p class="tagline">{{ t('footer.tagline') }}</p>
        <div class="social-links">
          <a
              v-for="(social, index) in tm('footer.socialLinks')"
              :key="index"
              :href="social.url"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
          >
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>

      <div class="footer-links">
        <div
            v-for="(group, index) in tm('footer.linkGroups')"
            :key="index"
            class="link-group"
        >
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <router-link
                  v-if="!isExternal(link.url)"
                  :to="link.url"
                  @click="handleLinkClick(link)"
              >
                {{ link.text }}
              </router-link>
              <a
                  v-else
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        {{ t('footer.copyright', {year: new Date().getFullYear()}) }}
      </p>
      <p class="made-with">
        {{ t('footer.madeWith') }} <span class="heart">❤</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const {t, tm} = useI18n();

// Emits
const emit = defineEmits(['linkClicked']);

// 判断链接是否为外部链接的方法
const isExternal = (url) => {
  // 判断链接是否以 "http://" 或 "https://" 开头
  return url.startsWith('http://') || url.startsWith('https://');
};

// 点击链接时触发事件
const handleLinkClick = (link) => {
  emit('linkClicked', link);
};
</script>

<style scoped>
.footer-section {
  padding: 3.5rem 2rem 1.5rem;
  background-color: var(--nav-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border-top: 1px solid var(--border-color);
}

.footer-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
}

.footer-logo {
  flex: 1;
  min-width: 220px;
}

.footer-logo h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.tagline {
  color: var(--secondary-color);
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--btn-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--icon-color);
  transition: all 0.2s ease;
  box-shadow: var(--hover-shadow);
}

.footer-links {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.link-group {
  flex: 1;
  min-width: 120px;
}

.link-group h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--text-color);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 0.7rem;
}

.link-group a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.social-link:hover {
  transform: translateY(-3px);
  background-color: var(--btn-bg);
  color: var(--primary-color);
}

.link-group a:hover {
  color: var(--primary-color);
  transform: translateX(2px);
}

.link-group a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.link-group a:hover::after {
  width: 100%;
}

.footer-bottom {
  max-width: 1100px;
  margin: 2.5rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: var(--secondary-color);
  font-size: 0.85rem;
  margin: 0;
}

.made-with {
  color: var(--secondary-color);
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.heart {
  color: var(--primary-color);
  display: inline-block;
  animation: heartbeat 1.5s ease infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .footer-section {
    padding: 2.5rem 1.5rem 1rem;
  }

  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
  }

  .footer-logo h2 {
    font-size: 1.5rem;
  }

  .tagline {
    font-size: 0.9rem;
  }

  .social-links {
    justify-content: center;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .link-group {
    margin-bottom: 1.5rem;
  }

  .link-group h3 {
    font-size: 1rem;
  }

  .link-group a {
    font-size: 0.95rem;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
