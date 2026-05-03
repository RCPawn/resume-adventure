<template>
  <div class="chatbot-root">
    <ChatbotButton
        :position="buttonPosition"
        :is-open="isOpen"
        @start-drag="onFabPointerDown"
        @toggle-chat-window="togglePanel"
        @update-position="syncFabFromChild"
    />

    <transition name="chat-panel">
      <div
          v-if="isOpen"
          class="chat-window"
          role="dialog"
          aria-modal="true"
          :aria-label="t('chatbot.ariaDialog')"
          :class="{ maximized: isMaximized }"
          :style="panelWindowStyle">
        <header
            class="chat-header"
            aria-label="拖拽移动窗口"
            title="拖拽移动 · 双击最大化"
            @pointerdown="onPanelHeaderPointerDown"
            @dblclick="toggleMaximize">
          <div class="chat-header-inner">
            <h2 class="chat-header-title">{{ t('chatbot.title') }}</h2>
          </div>
        </header>

        <div ref="chatBodyRef" class="chat-body">
          <div v-if="messages.length === 0" class="chat-empty">
            <span class="chat-empty-mark" aria-hidden="true">✎</span>
            <p class="chat-empty-text">{{ t('chatbot.emptyHint') }}</p>
          </div>
          <div
              v-for="msg in messages"
              :key="msg.id"
              :class="['message', msg.type === 'user' ? 'user-message' : 'ai-message']">
            <div v-if="msg.type === 'ai'" class="message-avatar" aria-hidden="true">
              <span class="message-avatar-face">🤖</span>
            </div>
            <div class="message-stack">
              <div class="message-bubble">
                <div class="message-content">{{ msg.content }}</div>
                <div v-if="msg.timestamp != null" class="message-time">
                  {{ formatChatTime(msg.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="chat-footer">
          <div class="chat-composer">
            <textarea
                ref="composerRef"
                v-model="userInput"
                class="chat-composer-input"
                :placeholder="t('chatbot.placeholder')"
                rows="1"
                @keydown.enter.exact.prevent="sendMessage"
            />
            <button
                type="button"
                class="chat-composer-send"
                :disabled="!userInput.trim()"
                :aria-label="t('chatbot.send')"
                @click="sendMessage">
              <svg class="chat-send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 2 11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ChatbotButton from './ChatbotButton.vue';
import {
  CHAT_DRAG_THRESHOLD_PX,
  CHAT_FAB_SIZE,
  CHAT_PERSIST_DEBOUNCE_MS,
  CHAT_WINDOW_DEFAULT_HEIGHT,
  CHAT_WINDOW_DEFAULT_WIDTH
} from './constants.js';
import { loadChatHistory, saveChatHistory, newId } from './chatHistory.js';
import { clampWindowPosition, placeWindowBesideFab } from './chatWindowLayout.js';

const { t } = useI18n();

const PLACEHOLDER_AI_REPLY =
  '我已经收到了你的消息，这里将来会由腾讯云AI小助手回复。';

function isPrimaryPointer(e) {
  return e.pointerType !== 'mouse' || e.button === 0;
}

function formatChatTime(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const isOpen = ref(false);
const messages = ref(loadChatHistory());
const userInput = ref('');

watchDebounced(
  messages,
  (val) => saveChatHistory(val),
  { deep: true, debounce: CHAT_PERSIST_DEBOUNCE_MS }
);

/* —— 悬浮按钮 —— */
const buttonPosition = reactive({
  x: typeof window !== 'undefined' ? window.innerWidth - CHAT_FAB_SIZE : 0,
  y:
    typeof window !== 'undefined'
      ? (window.innerHeight - CHAT_FAB_SIZE) / 2
      : 0
});

const fabDrag = reactive({
  isDragging: false,
  initialX: 0,
  initialY: 0,
  offsetX: 0,
  offsetY: 0
});
let fabDragged = false;

function syncFabFromChild({ x, y }) {
  buttonPosition.x = x;
  buttonPosition.y = y;
}

function snapFabRight() {
  const maxY = Math.max(0, window.innerHeight - CHAT_FAB_SIZE);
  buttonPosition.x = window.innerWidth - CHAT_FAB_SIZE;
  buttonPosition.y = Math.min(Math.max(buttonPosition.y, 0), maxY);
}

function onFabMove(e) {
  if (!fabDrag.isDragging) return;
  const dx = e.clientX - fabDrag.initialX;
  const dy = e.clientY - fabDrag.initialY;
  if (
    Math.abs(dx) > CHAT_DRAG_THRESHOLD_PX ||
    Math.abs(dy) > CHAT_DRAG_THRESHOLD_PX
  ) {
    fabDragged = true;
  }
  const maxX = Math.max(0, window.innerWidth - CHAT_FAB_SIZE);
  const maxY = Math.max(0, window.innerHeight - CHAT_FAB_SIZE);
  buttonPosition.x = Math.min(Math.max(fabDrag.offsetX + dx, 0), maxX);
  buttonPosition.y = Math.min(Math.max(fabDrag.offsetY + dy, 0), maxY);
}

function stopFabDrag() {
  fabDrag.isDragging = false;
  document.removeEventListener('pointermove', onFabMove);
  document.removeEventListener('pointerup', stopFabDrag);
  document.removeEventListener('pointercancel', stopFabDrag);
  snapFabRight();
}

function onFabPointerDown(e) {
  if (!isPrimaryPointer(e)) return;
  fabDrag.isDragging = true;
  fabDrag.initialX = e.clientX;
  fabDrag.initialY = e.clientY;
  fabDrag.offsetX = buttonPosition.x;
  fabDrag.offsetY = buttonPosition.y;
  fabDragged = false;
  document.addEventListener('pointermove', onFabMove);
  document.addEventListener('pointerup', stopFabDrag);
  document.addEventListener('pointercancel', stopFabDrag);
}

function togglePanel(payload = {}) {
  if (payload.source === 'keyboard' || !fabDragged) {
    isOpen.value = !isOpen.value;
  }
}

function onFabResize() {
  const maxY = Math.max(0, window.innerHeight - CHAT_FAB_SIZE);
  buttonPosition.x = window.innerWidth - CHAT_FAB_SIZE;
  buttonPosition.y = Math.min(Math.max(buttonPosition.y, 0), maxY);
}

/* —— 对话面板 —— */
const isMaximized = ref(false);
const panelSaved = ref(null);
const panelPos = ref({ x: 0, y: 0 });
const panelSize = ref({
  width: CHAT_WINDOW_DEFAULT_WIDTH,
  height: CHAT_WINDOW_DEFAULT_HEIGHT
});

const chatBodyRef = ref(null);
const composerRef = ref(null);

const isPanelDragging = ref(false);
const panelDragOffset = ref({ x: 0, y: 0 });
let panelLastEvent = null;
let panelRaf = null;

const panelWindowStyle = computed(() => {
  if (isMaximized.value) {
    const maxWidth = Math.min(800, window.innerWidth * 0.82);
    const left = (window.innerWidth - maxWidth) / 2;
    return {
      width: `${maxWidth}px`,
      height: `${window.innerHeight * 0.82}px`,
      top: `${window.innerHeight * 0.09}px`,
      left: `${left}px`
    };
  }
  return {
    width: `${panelSize.value.width}px`,
    height: `${panelSize.value.height}px`,
    top: `${panelPos.value.y}px`,
    left: `${panelPos.value.x}px`
  };
});

function layoutPanelBesideFab() {
  const placed = placeWindowBesideFab(
    buttonPosition.x,
    buttonPosition.y,
    CHAT_WINDOW_DEFAULT_WIDTH,
    CHAT_WINDOW_DEFAULT_HEIGHT
  );
  panelSize.value = { width: placed.width, height: placed.height };
  panelPos.value = { x: placed.x, y: placed.y };
}

function toggleMaximize() {
  if (isMaximized.value) {
    if (panelSaved.value) {
      panelSize.value = { ...panelSaved.value.size };
      panelPos.value = { ...panelSaved.value.position };
    }
    isMaximized.value = false;
  } else {
    panelSaved.value = {
      size: { ...panelSize.value },
      position: { ...panelPos.value }
    };
    isMaximized.value = true;
  }
}

function updatePanelDrag() {
  panelRaf = null;
  if (!panelLastEvent || !isPanelDragging.value) return;
  const nx = panelLastEvent.clientX - panelDragOffset.value.x;
  const ny = panelLastEvent.clientY - panelDragOffset.value.y;
  panelPos.value = clampWindowPosition(
    { x: nx, y: ny },
    panelSize.value.width,
    panelSize.value.height,
    buttonPosition.x
  );
  if (isPanelDragging.value) {
    panelRaf = requestAnimationFrame(updatePanelDrag);
  }
}

function onPanelDragMove(e) {
  if (!isPanelDragging.value) return;
  panelLastEvent = e;
  if (!panelRaf) panelRaf = requestAnimationFrame(updatePanelDrag);
}

function stopPanelDrag() {
  isPanelDragging.value = false;
  panelLastEvent = null;
  window.removeEventListener('pointermove', onPanelDragMove);
  window.removeEventListener('pointerup', stopPanelDrag);
  window.removeEventListener('pointercancel', stopPanelDrag);
  document.body.style.cursor = '';
  if (panelRaf) {
    cancelAnimationFrame(panelRaf);
    panelRaf = null;
  }
}

function onPanelHeaderPointerDown(e) {
  if (isMaximized.value || !isPrimaryPointer(e)) return;
  isPanelDragging.value = true;
  panelDragOffset.value = {
    x: e.clientX - panelPos.value.x,
    y: e.clientY - panelPos.value.y
  };
  panelLastEvent = e;
  window.addEventListener('pointermove', onPanelDragMove, { passive: true });
  window.addEventListener('pointerup', stopPanelDrag);
  window.addEventListener('pointercancel', stopPanelDrag);
  document.body.style.cursor = 'grabbing';
  e.preventDefault();
}

async function scrollChatToBottom() {
  await nextTick();
  const el = chatBodyRef.value;
  if (el) el.scrollTop = el.scrollHeight;
}

function onPanelViewportResize() {
  if (isOpen.value && !isMaximized.value) {
    layoutPanelBesideFab();
  }
}

watch(
  () => isOpen.value,
  (open) => {
    if (open) {
      layoutPanelBesideFab();
      scrollChatToBottom();
      nextTick(() => composerRef.value?.focus());
    } else {
      isMaximized.value = false;
    }
  },
  { flush: 'sync' }
);

watch(() => messages.value, scrollChatToBottom, { deep: true, flush: 'post' });

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  const now = Date.now();
  messages.value.push({
    id: newId(),
    content: text,
    type: 'user',
    timestamp: now
  });
  userInput.value = '';
  setTimeout(() => {
    messages.value.push({
      id: newId(),
      content: PLACEHOLDER_AI_REPLY,
      type: 'ai',
      timestamp: Date.now()
    });
  }, 500);
  nextTick(() => composerRef.value?.focus());
}

onMounted(() => {
  buttonPosition.x = window.innerWidth - CHAT_FAB_SIZE;
  buttonPosition.y = (window.innerHeight - CHAT_FAB_SIZE) / 2;
  window.addEventListener('resize', onFabResize);
  window.addEventListener('resize', onPanelViewportResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onFabResize);
  window.removeEventListener('resize', onPanelViewportResize);
  document.removeEventListener('pointermove', onFabMove);
  document.removeEventListener('pointerup', stopFabDrag);
  document.removeEventListener('pointercancel', stopFabDrag);
  stopPanelDrag();
});
</script>

<style scoped>
.chatbot-root {
  display: contents;
}

/* —— 面板入场：轻微弹出，不死板 —— */
.chat-panel-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.38s cubic-bezier(0.22, 1.15, 0.36, 1);
}

.chat-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.22s ease;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(14px);
}

.chat-window {
  --chat-radius-tl: 12px;
  --chat-radius-tr: 12px;
  --chat-radius-br: 12px;
  --chat-radius-bl: 12px;
  --chat-bubble-r: 12px;
  position: fixed;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-color);
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--chat-radius-tl) var(--chat-radius-tr) var(--chat-radius-br) var(--chat-radius-bl);
  box-shadow: var(--hover-shadow);
  transition:
    width 0.22s ease,
    height 0.22s ease,
    top 0.22s ease,
    left 0.22s ease,
    box-shadow 0.22s ease,
    border-radius 0.22s ease;
}

html.dark .chat-window {
  box-shadow: var(--hover-shadow);
}

.chat-window.maximized {
  --chat-radius-tl: 12px;
  --chat-radius-tr: 12px;
  --chat-radius-br: 12px;
  --chat-radius-bl: 12px;
}

.chat-header {
  flex-shrink: 0;
  cursor: grab;
  user-select: none;
  touch-action: none;
  border-bottom: 1px solid var(--border-color);
  background: var(--modal-bg);
}

.chat-header:active {
  cursor: grabbing;
}

.chat-header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
}

.chat-header-title {
  margin: 0;
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: -0.02em;
  color: var(--text-color);
  line-height: 1.25;
}

.chat-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 12px 12px;
  scrollbar-gutter: stable;
  /* 与 ChatGPT / Slack 类面板一致：纯色浅底，无纹理网格 */
  background-color: color-mix(in srgb, var(--btn-bg) 7%, var(--bg-color));
}

html.dark .chat-body {
  background-color: color-mix(in srgb, var(--modal-bg) 40%, var(--bg-color));
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  min-height: 72px;
  padding: 16px 12px 4px;
  pointer-events: none;
}

.chat-empty-mark {
  font-size: 1.35rem;
  line-height: 1;
  opacity: 0.35;
}

.chat-empty-text {
  margin: 0;
  max-width: 240px;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--secondary-color);
}

.message {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
  animation: msg-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.message:nth-child(even) {
  animation-delay: 0.03s;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
}

.message-avatar-face {
  font-size: 15px;
  line-height: 1;
}

.message-stack {
  display: flex;
  flex-direction: column;
  max-width: min(88%, calc(100% - 40px));
}

.user-message .message-stack {
  max-width: min(88%, 100%);
}

.message-bubble {
  position: relative;
}

.user-message .message-bubble {
  padding: 8px 12px;
  border-radius: var(--chat-bubble-r);
  background: var(--primary-color);
  color: #fff;
  box-shadow: none;
}

.ai-message .message-bubble {
  padding: 8px 12px;
  border-radius: var(--chat-bubble-r);
  background: var(--modal-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  box-shadow: none;
}

html.dark .ai-message .message-bubble {
  box-shadow: none;
}

.message-content {
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  letter-spacing: -0.018em;
}

.message-time {
  margin-top: 6px;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.76);
}

.ai-message .message-time {
  color: var(--secondary-color);
}

.chat-footer {
  flex-shrink: 0;
  padding: 8px 10px;
  background: var(--modal-bg);
  border-top: 1px solid var(--border-color);
}

/* 参考常见网页聊天：圆角矩形输入条 + 右侧方形圆角发送钮（非胶囊、无装饰点） */
.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 6px 6px 6px 12px;
  min-height: 38px;
  box-sizing: border-box;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.chat-composer:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(var(--primary-color-rgb), 0.22);
}

.chat-composer-input {
  flex: 1;
  min-height: 20px;
  max-height: 120px;
  padding: 5px 2px 6px 0;
  border: none;
  resize: none;
  font: inherit;
  font-size: 13px;
  line-height: 1.4;
  color: var(--text-color);
  background: transparent;
  outline: none;
}

.chat-composer-input::placeholder {
  color: var(--secondary-color);
  opacity: 0.75;
}

.chat-composer-send {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: 0 0 1px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 0.15s ease,
    transform 0.12s ease,
    background-color 0.15s ease;
}

.chat-composer-send:hover:not(:disabled) {
  opacity: 0.92;
}

.chat-composer-send:active:not(:disabled) {
  transform: scale(0.96);
}

.chat-composer-send:disabled {
  cursor: not-allowed;
  background-color: color-mix(in srgb, var(--border-color) 65%, var(--btn-bg));
  color: var(--secondary-color);
  opacity: 1;
}

.chat-send-icon {
  width: 15px;
  height: 15px;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .chat-panel-enter-active,
  .chat-panel-leave-active {
    transition: opacity 0.15s ease;
  }

  .chat-panel-enter-from,
  .chat-panel-leave-to {
    transform: none;
  }

  .chat-window {
    transition: none;
  }

  .message {
    animation: none;
  }

  .chat-composer-send {
    transition: opacity 0.18s ease;
  }

  .chat-composer-send:active:not(:disabled) {
    transform: none;
  }
}

@media (max-width: 768px) {
  .chat-window {
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    max-height: 100dvh;
    border-radius: 0;
    border-width: 0;
    box-shadow: none;
    transform: none;
  }

  html.dark .chat-window {
    box-shadow: none;
  }

  .chat-header-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .chat-footer {
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  }

  .user-message .message-stack,
  .ai-message .message-stack {
    max-width: 92%;
  }
}
</style>
