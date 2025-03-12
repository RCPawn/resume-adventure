<template>
  <div class="sketchy-game-container">
    <GoBackButton class="sketchy-back-button" />
    <div class="sketchy-frame">
      <div class="sketchy-frame-corner top-left"></div>
      <div class="sketchy-frame-corner top-right"></div>
      <div class="sketchy-frame-corner bottom-left"></div>
      <div class="sketchy-frame-corner bottom-right"></div>
      <iframe src="/WebGL Builds/index.html" class="sketchy-iframe" frameborder="0"></iframe>
    </div>
    <div class="sketchy-decoration dot-1"></div>
    <div class="sketchy-decoration dot-2"></div>
    <div class="sketchy-decoration squiggle"></div>
  </div>
</template>

<script setup>
import GoBackButton from "@/components/GoBackButton.vue";
</script>

<style scoped>
@font-face {
  font-family: 'Sketchy';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf') format('truetype');
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f9f6f0;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
}

.sketchy-game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #f9f6f0;
  background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='%23e0e0e0' stroke-width='0.5' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E");
  overflow: hidden;
}

.sketchy-back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.sketchy-frame {
  width: 90%;
  height: 85%;
  max-width: 1200px;
  position: relative;
  border: 3px solid #333;
  border-radius: 8px;
  background-color: white;
  box-shadow: 6px 6px 0 #333;
}

.sketchy-frame::before {
  content: "";
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
  border: 1px dashed #aaa;
  border-radius: 12px;
  z-index: -1;
}

.sketchy-frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: transparent;
  z-index: 5;
}

.top-left {
  top: -5px;
  left: -5px;
  border-top: 3px solid #333;
  border-left: 3px solid #333;
  transform: rotate(-5deg);
}

.top-right {
  top: -5px;
  right: -5px;
  border-top: 3px solid #333;
  border-right: 3px solid #333;
  transform: rotate(5deg);
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  border-bottom: 3px solid #333;
  border-left: 3px solid #333;
  transform: rotate(5deg);
}

.bottom-right {
  bottom: -5px;
  right: -5px;
  border-bottom: 3px solid #333;
  border-right: 3px solid #333;
  transform: rotate(-5deg);
}

.sketchy-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  display: block;
}

/* 装饰元素 */
.sketchy-decoration {
  position: absolute;
  opacity: 0.3;
  z-index: -1;
}

.dot-1 {
  top: 15%;
  right: 10%;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23333' stroke-width='2' stroke-dasharray='3,3'/%3E%3C/svg%3E");
}

.dot-2 {
  bottom: 15%;
  left: 10%;
  width: 60px;
  height: 60px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23333' stroke-width='2' stroke-dasharray='5,3'/%3E%3C/svg%3E");
}

.squiggle {
  top: 75%;
  right: 15%;
  width: 100px;
  height: 30px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Cpath d='M0,15 Q15,5 30,15 T60,15 T90,15' fill='none' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E");
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sketchy-frame {
    width: 95%;
    height: 70%;
  }

  .sketchy-decoration {
    display: none;
  }
}

@media (max-width: 480px) {
  .sketchy-frame {
    height: 50%;
  }

  .sketchy-back-button {
    top: 10px;
    left: 10px;
  }
}
</style>