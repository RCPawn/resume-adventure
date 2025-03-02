<template>
  <div class="screenshot-carousel">
    <button class="carousel-btn left" @click="prevSlide">❮</button>
    <transition name="fade" mode="out-in">
      <img
          :key="screenshots[currentSlide].src"
          :src="screenshots[currentSlide].src"
          :alt="screenshots[currentSlide].alt"
          class="screenshot"
          loading="lazy"
      />
    </transition>
    <button class="carousel-btn right" @click="nextSlide">❯</button>
    <div class="carousel-indicator">
      {{ currentSlide + 1 }} / {{ screenshots.length }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  screenshots: {
    type: Array,
    required: true
  }
});

const currentSlide = ref(0);
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.screenshots.length;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.screenshots.length) % props.screenshots.length;
};
</script>

<style scoped>
.screenshot-carousel {
  position: relative;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: 10px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.screenshot-carousel .screenshot {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;
}
.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}
.carousel-btn.left {
  left: 10px;
}
.carousel-btn.right {
  right: 10px;
}
.carousel-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
