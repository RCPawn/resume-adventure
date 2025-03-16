<template>
  <div v-if="isOpen"
       class="chat-window"
       :style="{ width: `${windowSize.width}px`, height: `${windowSize.height}px`, transform: `rotate(${rotate}deg)`, top: `${position.y}px`, left: `${position.x}px`, right: 'auto', bottom: 'auto' }">

    <!-- 拖动区域(标题栏) -->
    <div class="chat-header"
         ref="header"
         @mousedown="startDrag"
         @dblclick="toggleMaximize">
      <div class="drag-indicator">
        <div class="drag-line"></div>
      </div>
      <div class="chat-title">rcpawn's echo</div>
      <div class="chat-controls">
        <button class="control-button minimize" @click.stop.prevent="minimize">−</button>
        <button class="control-button maximize" @click.stop.prevent="toggleMaximize">□</button>
        <button class="control-button close" @click.stop.prevent="closeChat">×</button>
      </div>
    </div>

    <div class="chat-body" ref="chatBody">
      <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type === 'user' ? 'user-message' : 'ai-message']"
      >
        <div class="message-bubble">
          <div class="message-content">{{ message.content }}</div>
          <div v-if="message.type !== 'user'" class="message-time">{{
              formatTime(message.timestamp || Date.now())
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea
          :value="userInput"
          placeholder="在这里发送消息..."
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSend"
          ref="inputField"
      ></textarea>
      <button @click="handleSend" class="send-button" :disabled="!userInput.trim()">发送</button>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';

const props = defineProps({
  isOpen: {type: Boolean, required: true},    // 聊天窗口可见性
  messages: {type: Array, required: true},    // 消息列表
  userInput: {type: String, required: true}   // 当前用户输入
});

const emit = defineEmits(['update:userInput', 'sendMessage', 'close', 'minimize']);

// 窗口状态
const isMaximized = ref(false);
const previousState = ref(null);
const rotate = ref(-1);
const position = ref({x: window.innerWidth - 370, y: window.innerHeight - 580});
const windowSize = ref({width: 350, height: 500});
const minSize = {width: 300, height: 400};
const maxSize = {width: 800, height: 900};

// DOM 引用
const chatBody = ref(null);
const header = ref(null);
const inputField = ref(null);

// 拖动状态
const isDragging = ref(false);
const dragOffset = ref({x: 0, y: 0});

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 输入处理
const handleInput = (e) => {
  emit('update:userInput', e.target.value);
};

// 发送消息
const handleSend = () => {
  if (props.userInput.trim()) {
    emit('sendMessage');
    nextTick(() => {
      if (inputField.value) inputField.value.focus();
    });
  }
};

// 关闭聊天，重置状态为默认小窗口
const closeChat = () => {
  // 重置为默认的小窗口状态
  windowSize.value = { width: 350, height: 500 };
  position.value = { x: window.innerWidth - 370, y: window.innerHeight - 580 };
  rotate.value = -1;
  isMaximized.value = false;
  emit('close');
};

// 最小化聊天
const minimize = () => {
  emit('minimize');
};

// 窗口最大化/还原
const toggleMaximize = () => {
  if (isMaximized.value) {
    windowSize.value = previousState.value.size;
    position.value = previousState.value.position;
    rotate.value = previousState.value.rotate;
    isMaximized.value = false;
  } else {
    previousState.value = {
      size: {...windowSize.value},
      position: {...position.value},
      rotate: rotate.value
    };
    windowSize.value = {width: window.innerWidth * 0.8, height: window.innerHeight * 0.8};
    position.value = {x: window.innerWidth * 0.1, y: window.innerHeight * 0.1};
    rotate.value = 0;
    isMaximized.value = true;
  }
};

// 开始拖动
const startDrag = (e) => {
  if (isMaximized.value) return;
  isDragging.value = true;
  dragOffset.value = {x: e.clientX - position.value.x, y: e.clientY - position.value.y};
  // rotate.value = Math.random() * 2 - 1;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'grabbing';
  e.preventDefault();
};

// 处理拖动
const handleDrag = (e) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    };
    position.value.x = Math.max(0, Math.min(position.value.x, window.innerWidth - windowSize.value.width));
    position.value.y = Math.max(0, Math.min(position.value.y, window.innerHeight - windowSize.value.height));
  }
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'default';
};

// 自动聚焦输入框
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    scrollToBottom();
    nextTick(() => {
      if (inputField.value) inputField.value.focus();
    });
  }
});

// 窗口大小变化时重新计算
const handleWindowResize = () => {
  if (isMaximized.value) {
    windowSize.value = {width: window.innerWidth * 0.8, height: window.innerHeight * 0.8};
    position.value = {x: window.innerWidth * 0.1, y: window.innerHeight * 0.1};
  } else {
    position.value.x = Math.min(position.value.x, window.innerWidth - windowSize.value.width);
    position.value.y = Math.min(position.value.y, window.innerHeight - windowSize.value.height);
  }
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
};

// 监听消息更新，滚动到底部
watch(() => props.messages, scrollToBottom, {deep: true});

// 组件挂载和卸载
onMounted(() => {
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize);
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.chat-window {
  position: fixed;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9998;
  box-shadow: 5px 5px 0 #0005;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-window:hover {
  box-shadow: 6px 6px 0 #0006;
}

.chat-header {
  padding: 12px 15px;
  border-bottom: 2px solid #333;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  cursor: grab;
  user-select: none;
  transition: background-color 0.2s;
  position: relative;
}

.chat-header:hover {
  background-color: #e6e6e6;
}

.chat-header:active {
  cursor: grabbing;
  background-color: #e6e6e6;
}

/* 拖动指示器 */
.drag-indicator {
  position: absolute;
  top: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.drag-line {
  width: 36px;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
  transform: rotate(1deg) translateX(35px); /* 向右移动 35px */
}

.chat-controls {
  display: flex;
  gap: 6px; /* 增加间距 */
}

.control-button {
  width: 25px; /* 从20px增加到28px */
  height: 25px; /* 从20px增加到28px */
  border-radius: 50%;
  border: 1px solid #333;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px; /* 增大字体大小 */
  transition: transform 0.2s;
  z-index: 10; /* 确保按钮在最上层 */
  position: relative; /* 添加相对定位 */
}

.control-button:hover {
  transform: scale(1.1);
}

.control-button.close {
  background-color: #ff6b6b;
  color: #fff;
}

.control-button.maximize {
  background-color: #6bd6ff;
  color: #fff;
}

.control-button.minimize {
  background-color: #ffdb6b;
  color: #333;
}

.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #2c2c2c;
}

.message {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  align-items: flex-end;
}

.ai-message {
  align-items: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  width: fit-content;
  min-width: 40px;
}

.user-message .message-bubble {
  background-color: #e1f5fe;
  border: 1px solid #81d4fa;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 2px 2px 0 #b3e5fc;
}

.ai-message .message-bubble {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 2px 2px 0 #eeeeee;
}

.message-content {
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  color: #999;
  text-align: right;
  margin-top: 4px;
}

.chat-input {
  padding: 10px;
  border-top: 2px solid #333;
  background-color: #f0f4f8;
  display: flex;
  align-items: center;
}

textarea {
  flex-grow: 1;
  height: 40px;
  max-height: 120px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  resize: none;
  font-size: 15px;
  outline: none;
  margin-right: 10px;
  background-color: #fff;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: #81d4fa;
}

.send-button {
  background-color: #4fc3f7;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.send-button:hover {
  background-color: #29b6f6;
}

.send-button:active {
  transform: scale(0.95);
}

.send-button:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  transform: none;
}

/* 滚动条样式 */
.chat-body::-webkit-scrollbar {
  width: 8px;
}

.chat-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.chat-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.chat-body::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-window {
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 0;
    transform: none !important;
  }
}
</style>
