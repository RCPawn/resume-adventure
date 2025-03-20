<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">
      <div class="footer-logo">
        <h2>{{ t('footer.appName') }}</h2>
        <p class="tagline">{{ t('footer.tagline') }}</p>
        <div class="social-links">
          <a v-for="(social, index) in tm('footer.socialLinks')" :key="index" :href="social.url" class="social-link"
             target="_blank" rel="noopener noreferrer">
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>

      <div class="footer-links">
        <div v-for="(group, index) in tm('footer.linkGroups')" :key="index" class="link-group">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <router-link :to="link.url" @click="handleLinkClick(link)">
                {{ link.text }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">{{ t('footer.copyright', {year: new Date().getFullYear()}) }}</p>
      <p class="made-with">{{ t('footer.madeWith') }} <span class="heart">❤</span></p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

// Emits
const emit = defineEmits(['linkClicked']);

// Methods
const handleLinkClick = (link) => {
  emit('linkClicked', link);
};
</script>

<style scoped>
.footer-section {
  padding: 3.5rem 2rem 1.5rem;
  background-color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border-top: 1px solid #f0f0f0;
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
  color: #333;
}

.tagline {
  color: #666;
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
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.social-link:hover {
  transform: translateY(-3px);
  background-color: #4087DC;
  color: white;
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
  color: #444;
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
  color: #666;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.link-group a:hover {
  color: #4087DC;
  transform: translateX(2px);
}

.link-group a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #4087DC;
  transition: width 0.3s ease;
}

.link-group a:hover::after {
  width: 100%;
}

.footer-bottom {
  max-width: 1100px;
  margin: 2.5rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #999;
  font-size: 0.85rem;
  margin: 0;
}

.made-with {
  color: #999;
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.heart {
  color: #FF6B6B;
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

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-links {
    gap: 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>