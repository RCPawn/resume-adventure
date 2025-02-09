<template>
  <button class="toggle-layout-btn" @click="toggle" :title="buttonTitle">
    <svg v-if="currentMode === 'masonry'" viewBox="0 0 24 24" width="24" height="24" fill="white">
      <!-- 简单的环形图标 -->
      <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" fill="none"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="white">
      <!-- 简单的网格图标 -->
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentMode: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['toggle']);

const toggle = () => {
  emit('toggle');
};

const buttonTitle = computed(() => {
  return props.currentMode === 'masonry' ? '切换为环形布局' : '切换为瀑布流布局';
});
</script>

<style scoped>
.toggle-layout-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ff9800;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.toggle-layout-btn:hover {
  background-color: #e68900;
  transform: scale(1.1);
}
</style>
