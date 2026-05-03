<template>
  <div
      class="ai-assistant-button"
      role="button"
      :aria-expanded="isOpen"
      :aria-label="t('chatbot.ariaFab')"
      tabindex="0"
      :style="{ top: adjustedPosition.y + 'px', left: adjustedPosition.x + 'px' }"
      @pointerdown="handlePointerDown"
      @click="handleClick"
      @keydown.enter.prevent="emit('toggleChatWindow', { source: 'keyboard' })"
      @keydown.space.prevent="emit('toggleChatWindow', { source: 'keyboard' })"
  >
    <div class="button-inner">
      <div class="icon" aria-hidden="true">{{ isOpen ? '✕' : '🤖' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { CHAT_FAB_SIZE } from './constants.js';

const { t } = useI18n();

const fabSizePx = `${CHAT_FAB_SIZE}px`;

const props = defineProps({
  position: { type: Object, required: true },
  isOpen: { type: Boolean, required: true }
});
const emit = defineEmits(['startDrag', 'toggleChatWindow', 'updatePosition']);

const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });

const adjustedPosition = computed(() => {
  const maxX = Math.max(0, windowSize.value.width - CHAT_FAB_SIZE);
  const maxY = Math.max(0, windowSize.value.height - CHAT_FAB_SIZE);

  return {
    x: Math.min(Math.max(0, props.position.x), maxX),
    y: Math.min(Math.max(0, props.position.y), maxY)
  };
});

const handleResize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  if (
    props.position.x > windowSize.value.width - CHAT_FAB_SIZE ||
    props.position.y > windowSize.value.height - CHAT_FAB_SIZE
  ) {
    emit('updatePosition', adjustedPosition.value);
  }
};

const handlePointerDown = (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) {
    return;
  }
  emit('startDrag', e);
  e.preventDefault();
};

/** 指针点击：由父级用 hasDragged 区分「点」与「拖」 */
const handleClick = () => {
  emit('toggleChatWindow', { source: 'pointer' });
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
  width: v-bind(fabSizePx);
  height: v-bind(fabSizePx);
  cursor: grab;
  z-index: 10002;
  user-select: none;
  touch-action: none;
}

.button-inner {
  width: 100%;
  height: 100%;
  background: var(--modal-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border: 1px solid var(--border-color);
  box-shadow: var(--hover-shadow);
  transform: rotate(-3deg);
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.2s ease,
    box-shadow 0.22s ease;
}

.button-inner:hover {
  transform: rotate(0deg) scale(1.05);
  border-color: rgba(var(--primary-color-rgb), 0.45);
  box-shadow: var(--hover-shadow);
}

.button-inner:active {
  transform: scale(0.96);
}

.icon {
  transform: rotate(3deg);
  filter: grayscale(0.15);
}

@media (prefers-reduced-motion: reduce) {
  .button-inner {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .button-inner:hover {
    transform: rotate(-3deg) scale(1.02);
  }

  .button-inner:active {
    transform: scale(0.98);
  }
}
</style>
