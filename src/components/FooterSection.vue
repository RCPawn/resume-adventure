<template>
  <footer class="napkin-footer animation-fade-in">
    <div class="napkin-footer-content">
      <div class="napkin-footer-wave"></div>
      <div class="napkin-footer-info">
        <div class="napkin-logo footer-logo">RCPAWN</div>
        <p>&copy; {{ currentYear }} RCPAWN</p>
        <p>{{ t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.napkin-footer {
  padding: 5rem 2rem 2rem;
  position: relative;
  background-color: var(--color-background);
}

.napkin-footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.napkin-footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23f3f4f6' opacity='0.4'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  transform: rotate(180deg);
}

.footer-logo {
  margin-bottom: 1rem;
  font-size: 2rem;
}
</style>
