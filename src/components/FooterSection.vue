<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">
      <div class="footer-logo">
        <h2>{{ appName }}</h2>
        <p class="tagline">{{ tagline }}</p>
      </div>

      <div class="footer-links">
        <div v-for="(group, index) in linkGroups" :key="index" class="link-group">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <a :href="link.url">{{ link.text }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">&copy; {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.</p>
      <div class="social-links">
        <a v-for="(social, index) in socialLinks" :key="index" :href="social.url" class="social-link">
          <i :class="social.icon"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

// Props definition with default values
const props = defineProps({
  appName: {
    type: String,
    default: 'YourApp'
  },
  tagline: {
    type: String,
    default: 'A simple but powerful solution'
  }
});

// Emits
const emit = defineEmits(['linkClicked']);

// Reactive data
const socialLinks = ref([
  { url: 'https://twitter.com/', icon: 'icon-twitter' },
  { url: 'https://github.com/', icon: 'icon-github' },
  { url: 'https://discord.com/', icon: 'icon-discord' }
]);

const linkGroups = ref([
  {
    title: 'Product',
    links: [
      { text: 'Features', url: '/features' },
      { text: 'Pricing', url: '/pricing' },
      { text: 'Docs', url: '/docs' }
    ]
  },
  {
    title: 'Company',
    links: [
      { text: 'About', url: '/about' },
      { text: 'Blog', url: '/blog' },
      { text: 'Careers', url: '/careers' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy', url: '/privacy' },
      { text: 'Terms', url: '/terms' }
    ]
  }
]);

// Methods
const handleLinkClick = (link) => {
  emit('linkClicked', link);
};
</script>

<style scoped>
.footer-section {
  padding: 4rem 2rem 2rem;
  background-color: #f8f8f8;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid #eaeaea;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-logo {
  flex: 1;
  min-width: 240px;
}

.footer-logo h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #333;
}

.tagline {
  color: #666;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
}

.footer-links {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.link-group {
  flex: 1;
  min-width: 140px;
}

.link-group h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #333;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 0.75rem;
}

.link-group a {
  text-decoration: none;
  color: #666;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.link-group a:hover {
  color: #333;
}

.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #999;
  font-size: 0.875rem;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: #333;
  color: white;
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
  }
}
</style>