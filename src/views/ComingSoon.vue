<template>
  <div class="container">
    <div class="emoji">🚧</div>
    <h1>建设中...</h1>
    <p>抱歉，该页面还在开发中，敬请期待！</p>
    <!-- 如果你使用 vue-router，推荐使用 router-link -->
<!--    <router-link to="/" class="btn">返回主页</router-link>-->
    <!-- 如果没使用 vue-router，可换成普通按钮绑定返回事件 -->
     <button class="btn" @click="goBack">返回</button>
  </div>
</template>

<script>
export default {
  name: 'UnderDevelopment',
  // 如果你没使用 vue-router，可以通过 window.history 返回上一页
  methods: {
    goBack() {
      window.history.back();
    }
  }
}
</script>

<style scoped>
/* 重置基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ece9e6, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.emoji {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
}

.btn {
  display: inline-block;
  padding: 12px 25px;
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}
</style>
