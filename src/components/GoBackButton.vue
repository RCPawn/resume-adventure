<template>
  <router-link to="#" class="home-button" aria-label="返回上一页" @click.prevent="goBack">
    <span class="button-content">
      <slot>←</slot>
    </span>
    <div class="hover-line"></div>
  </router-link>
</template>

<script setup>
// 获取 Vue Router 实例
import { useRouter } from "vue-router";

const router = useRouter();

// 返回上一页
const goBack = () => {
  router.back(); // 或者 router.go(-1)
};
</script>

<style scoped>
.home-button {
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdfbfb, #ebedee);
  border: 2px solid #2d3436;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 100;
}

.button-content {
  font-size: 1.8rem;
  color: #34495e;
  font-weight: bold;
  line-height: 1;
  transition: transform 0.2s ease, color 0.2s ease;
}

.hover-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #e74c3c;
  transition: width 0.3s ease;
}

.home-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.home-button:hover .hover-line {
  width: 100%;
}

.home-button:hover .button-content {
  transform: scale(1.1);
  color: #e74c3c;
}

.home-button:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .home-button {
    top: 1.5rem;
    left: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .button-content {
    font-size: 1.5rem;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .home-button {
    background: linear-gradient(135deg, #2d3436, #34495e);
  }

  .button-content {
    color: #ecf0f1;
  }

  .hover-line {
    background: #e74c3c;
  }
}
</style>
