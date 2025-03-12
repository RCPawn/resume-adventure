<template>
  <div class="container">
    <iframe src="/WebGL Builds/index.html" class="iframe" frameborder="0"></iframe>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* 页面基础样式 */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* 防止页面出现滚动条 */
  background-color: #f4f4f9;
}

/* 容器样式，确保iframe在全屏和小窗模式下都能自适应 */
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* iframe样式：全屏显示且响应式设计 */
.iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  /* 去掉边框圆角 */
}

/* GoBackButton样式：位置调整和适配 */
.go-back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  /* 确保按钮显示在最前面 */
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-back-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 小屏幕响应式设计：当窗口变小时，iframe将适应窗口 */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .iframe {
    height: 400px;
    /* 设置一个适中的高度 */
  }
}

@media (max-width: 480px) {
  .go-back-button {
    font-size: 12px;
    padding: 8px 16px;
  }

  .iframe {
    height: 300px;
    /* 更小的高度适应极小屏幕 */
  }
}
</style>
