<template>
  <div v-if="isOpen"
       class="chat-window"
       :class="{ 'maximized': isMaximized }"
       :style="windowStyle">
    <!-- 拖动区域（标题栏） -->
    <div class="chat-header"
         ref="header"
         @mousedown="startDrag"
         @dblclick="toggleMaximize">

      <!-- 动态岛替代顶部横线 -->
      <div class="dynamic-island">
        <div class="dynamic-island-inner">
          <div class="dynamic-island-camera"></div>
          <div class="dynamic-island-sensor"></div>
        </div>
      </div>
    </div>

    <!-- 聊天内容 -->
    <div class="chat-body" ref="chatBody">
      <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type === 'user' ? 'user-message' : 'ai-message']">
        <div class="message-bubble">
          <div class="message-content">{{ message.content }}</div>
          <div v-if="message.type !== 'user'" class="message-time">
            {{ formatTime(message.timestamp || Date.now()) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <textarea
          :value="userInput"
          placeholder="在这里发送消息..."
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSend"
          ref="inputField">
      </textarea>
      <button @click="handleSend" class="send-button" :disabled="!userInput.trim()">发送</button>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch, nextTick, onMounted, onUnmounted, computed} from 'vue';

const props = defineProps({
  isOpen: {type: Boolean, required: true},
  messages: {type: Array, required: true},
  userInput: {type: String, required: true}
});

const emit = defineEmits(['update:userInput', 'sendMessage', 'close', 'minimize']);

// 窗口状态
const isMaximized = ref(false);
const previousState = ref(null);
const position = ref({x: window.innerWidth - 370, y: window.innerHeight - 580});
const windowSize = ref({width: 350, height: 500});

// 计算窗口样式，最大化时使用自适应宽度
const windowStyle = computed(() => {
  if (isMaximized.value) {
    // 计算最大化时的宽度 - 使用最大宽度800px或屏幕宽度的80%，取较小值
    const maxWidth = Math.min(800, window.innerWidth * 0.8);
    // 计算居中位置
    const centeredX = (window.innerWidth - maxWidth) / 2;
    return {
      width: `${maxWidth}px`,
      height: `${window.innerHeight * 0.8}px`,
      top: `${window.innerHeight * 0.1}px`,
      left: `${centeredX}px`
    };
  } else {
    return {
      width: `${windowSize.value.width}px`,
      height: `${windowSize.value.height}px`,
      top: `${position.value.y}px`,
      left: `${position.value.x}px`
    };
  }
});

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

// 窗口最大化/还原
const toggleMaximize = () => {
  if (isMaximized.value) {
    windowSize.value = previousState.value.size;
    position.value = previousState.value.position;
    isMaximized.value = false;
  } else {
    previousState.value = {
      size: {...windowSize.value},
      position: {...position.value}
    };
    isMaximized.value = true;
  }
};

// 开始拖动 - 更平滑的拖动
const startDrag = (e) => {
  if (isMaximized.value) return;
  isDragging.value = true;
  dragOffset.value = {x: e.clientX - position.value.x, y: e.clientY - position.value.y};
  // 使用 requestAnimationFrame 使拖动更平滑
  window.addEventListener('mousemove', handleDrag, {passive: true});
  window.addEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'grabbing';
  e.preventDefault();
};

// 处理拖动 - 使用 requestAnimationFrame 提高平滑度
let lastDragEvent = null;
let animationFrameId = null;

const handleDrag = (e) => {
  if (!isDragging.value) return;
  // 存储最后一次事件
  lastDragEvent = e;

  // 如果没有动画帧请求，则请求一个
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updatePosition);
  }
};

const updatePosition = () => {
  animationFrameId = null;

  if (lastDragEvent && isDragging.value) {
    position.value = {
      x: lastDragEvent.clientX - dragOffset.value.x,
      y: lastDragEvent.clientY - dragOffset.value.y
    };

    // 边界检查
    position.value.x = Math.max(0, Math.min(position.value.x, window.innerWidth - windowSize.value.width));
    position.value.y = Math.max(0, Math.min(position.value.y, window.innerHeight - windowSize.value.height));

    // 如果还在拖动，继续请求动画帧
    if (isDragging.value) {
      animationFrameId = requestAnimationFrame(updatePosition);
    }
  }
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'default';

  // 取消任何未完成的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
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
    // 不需要在这里设置大小，因为使用了计算属性
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
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', stopDrag);

  // 确保取消任何未完成的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* 整体窗口：暗色主题iOS风格 */
.chat-window {
  position: fixed;
  background-color: #000;
  border: none;
  border-radius: 38px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9998;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 最大化时的样式 */
.chat-window.maximized {
  border-radius: 28px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
}

.chat-header {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #000;
  cursor: grab;
  user-select: none;
}

.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 12px;
  background-color: #000;
  background-image: linear-gradient(to bottom, rgba(40, 40, 40, 0.2), rgba(20, 20, 20, 0.4));
  will-change: transform; /* 性能优化 */
}

.chat-input {
  flex-shrink: 0;
  padding: 12px 14px;
  background-color: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

/* 动态岛设计 */
.dynamic-island {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 28px;
  background: #000;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.dynamic-island-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.dynamic-island-camera {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  position: absolute;
  left: 30px;
}

.dynamic-island-sensor {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  right: 30px;
}

/* 消息动画和间距 */
.message {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.15s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 用户消息（右侧，iOS暗色主题蓝色气泡） */
.user-message {
  align-items: flex-end;
}

.user-message .message-bubble {
  background-color: #0A84FF;
  color: white;
  padding: 10px 14px;
  border-radius: 18px 18px 5px 18px;
  max-width: 75%;
  margin-right: 6px;
}

/* AI 消息（左侧，iOS暗色主题气泡） */
.ai-message {
  align-items: flex-start;
}

.ai-message .message-bubble {
  background-color: #2C2C2E;
  color: #fff;
  padding: 10px 14px;
  border-radius: 18px 18px 18px 5px;
  max-width: 75%;
  margin-left: 6px;
}

/* 消息内容 */
.message-content {
  font-size: 16px;
  line-height: 1.35;
  white-space: pre-wrap;
  font-weight: 400;
  letter-spacing: -0.22px;
}

/* 消息时间 */
.message-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  margin-top: 3px;
}

textarea {
  flex-grow: 1;
  height: 38px;
  max-height: 120px;
  padding: 10px 14px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  resize: none;
  font-size: 16px;
  outline: none;
  margin-right: 10px;
  background-color: #2C2C2E;
  transition: border-color 0.2s;
  letter-spacing: -0.22px;
  color: #fff;
}

textarea:focus {
  border-color: #0A84FF;
}

/* 发送按钮 */
.send-button {
  background-color: #0A84FF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  letter-spacing: -0.2px;
}

.send-button:hover {
  background-color: #0071e3;
}

.send-button:active {
  transform: scale(0.98);
}

.send-button:disabled {
  background-color: #636366;
  cursor: not-allowed;
}

/* iOS暗色主题滚动条 */
.chat-body::-webkit-scrollbar {
  width: 5px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.chat-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 响应式调整（适配小屏幕） */
@media (max-width: 768px) {
  .chat-window {
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 0;
  }

  .user-message .message-bubble,
  .ai-message .message-bubble {
    max-width: 85%;
  }
}
</style>