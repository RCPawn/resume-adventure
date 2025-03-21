<template>
  <div
      class="ai-assistant-button"
      :style="{ top: adjustedPosition.y + 'px', left: adjustedPosition.x + 'px' }"
      @mousedown="handleStartDrag"
      @click="handleClick"
  >
    <div class="button-inner">
      <div class="icon">{{ isOpen ? '✕' : '🤖' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  position: { type: Object, required: true }, // Button position (x, y)
  isOpen: { type: Boolean, required: true }   // Chat window open state
});
const emit = defineEmits(['startDrag', 'toggleChatWindow', 'updatePosition']);

let hasDragged = false;
const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });

// Keep button within viewport boundaries
const adjustedPosition = computed(() => {
  const maxX = windowSize.value.width - 60; // 60 is button width
  const maxY = windowSize.value.height - 60; // 60 is button height

  return {
    x: Math.min(Math.max(0, props.position.x), maxX),
    y: Math.min(Math.max(0, props.position.y), maxY)
  };
});

// Update window size on resize
const handleResize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // If position is outside viewport after resize, update parent component
  if (props.position.x > windowSize.value.width - 60 ||
      props.position.y > windowSize.value.height - 60) {
    emit('updatePosition', adjustedPosition.value);
  }
};

const handleStartDrag = (e) => {
  hasDragged = false;
  emit('startDrag', e); // Emit drag start event to parent
  e.preventDefault();   // Prevent default behavior
};

const handleClick = () => {
  if (!hasDragged) {
    emit('toggleChatWindow'); // Emit toggle event only if not dragged
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.ai-assistant-button {
  position: fixed;
  width: 60px;
  height: 60px;
  cursor: grab;
  z-index: 9999;
  user-select: none;
}

.button-inner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid #333;
  box-shadow: 3px 3px 0 #0005;
  transform: rotate(-2deg);
  transition: transform 0.2s;
}

.button-inner:hover {
  transform: rotate(2deg) scale(1.05);
}

.button-inner:active {
  transform: scale(0.95);
}

.icon {
  transform: rotate(2deg);
}
</style>