<template>
  <div>
    <ChatbotButton
        :position="buttonPosition"
        :isOpen="isOpen"
        @startDrag="startDrag"
        @toggleChatWindow="toggleChatWindow"
    />
    <ChatbotWindow
        :isOpen="isOpen"
        :messages="messages"
        :userInput="userInput"
        @update:userInput="userInput = $event"
        @sendMessage="sendMessage"
        @close="handleClose"
        @minimize="handleMinimize"
    />
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import ChatbotButton from './ChatbotButton.vue';
import ChatbotWindow from './ChatbotWindow.vue';

const isOpen = ref(false);
const isMinimized = ref(false);
const userInput = ref('');
const messages = ref([
  {content: '你好！我是 rcpawn 的小助手 echo，有什么可以帮你的吗？', type: 'ai'}
]);
const buttonPosition = reactive({
  x: window.innerWidth - 70,
  y: window.innerHeight / 2
});
const dragState = reactive({
  isDragging: false,
  initialX: 0,
  initialY: 0,
  offsetX: 0,
  offsetY: 0
});
const handleClose = () => {
  isOpen.value = false;
};
const handleMinimize = () => {
  isMinimized.value = true;
  isOpen.value = false;
};
let hasDragged = false;
const startDrag = (e) => {
  dragState.isDragging = true;
  dragState.initialX = e.clientX;
  dragState.initialY = e.clientY;
  dragState.offsetX = buttonPosition.x;
  dragState.offsetY = buttonPosition.y;
  hasDragged = false;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (dragState.isDragging) {
    const deltaX = e.clientX - dragState.initialX;
    const deltaY = e.clientY - dragState.initialY;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged = true;
    }
    const newX = dragState.offsetX + deltaX;
    const newY = dragState.offsetY + deltaY;
    buttonPosition.x = Math.min(Math.max(newX, 0), window.innerWidth - 70);
    buttonPosition.y = Math.min(Math.max(newY, 0), window.innerHeight - 70);
  }
};

const stopDrag = () => {
  dragState.isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  snapToEdge();
};

const snapToEdge = () => {
  const leftDistance = buttonPosition.x;
  const rightDistance = window.innerWidth - 70 - buttonPosition.x;
  const topDistance = buttonPosition.y;
  const bottomDistance = window.innerHeight - 70 - buttonPosition.y;
  const minHorizontal = Math.min(leftDistance, rightDistance);
  const minVertical = Math.min(topDistance, bottomDistance);
  if (minHorizontal <= minVertical) {
    buttonPosition.x = leftDistance < rightDistance ? 0 : window.innerWidth - 70;
  } else {
    buttonPosition.y = topDistance < bottomDistance ? 0 : window.innerHeight - 70;
  }
};

const toggleChatWindow = () => {
  if (!hasDragged) {
    isOpen.value = !isOpen.value;
  }
};

const sendMessage = () => {
  if (!userInput.value.trim()) return;
  messages.value.push({content: userInput.value, type: 'user'});
  setTimeout(() => {
    messages.value.push({
      content: `我收到了你的消息："${userInput.value}"。这里将来会由腾讯云AI小助手回复。`,
      type: 'ai'
    });
  }, 500);
  userInput.value = '';
};

onMounted(() => {
  window.addEventListener('resize', () => {
    if (buttonPosition.x > window.innerWidth - 70) {
      buttonPosition.x = window.innerWidth - 70;
    }
    if (buttonPosition.y > window.innerHeight - 70) {
      buttonPosition.y = window.innerHeight - 70;
    }
  });
});
</script>

<style scoped>
/* No additional styles needed here */
</style>