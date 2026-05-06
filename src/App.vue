<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- 仅缓存首页：从学习足迹详情返回时不重挂载下部区块，避免一帧「只有开篇」再突然长出卡片的割裂感 -->
    <keep-alive include="HomeView">
      <component :is="Component" v-if="Component" />
    </keep-alive>
  </router-view>
</template>
