<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { BookOpenIcon, CodeBracketIcon, PuzzlePieceIcon } from "@heroicons/vue/24/solid";

// 使用 Vue Router 进行页面跳转
const router = useRouter();

// 页面入口数据
const worlds = ref([
  {
    title: "Resume Adventure",
    description: "探索我的简历，开启一场小游戏之旅！",
    path: "/adventure",
    icon: BookOpenIcon,
    color: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  {
    title: "Projects",
    description: "查看我做过的项目，了解我的技术栈。",
    path: "/projects",
    icon: CodeBracketIcon,
    color: "bg-gradient-to-r from-green-400 to-teal-500",
  },
  {
    title: "Secret Zone",
    description: "进入神秘区域，发现一些惊喜。",
    path: "/secret",
    icon: PuzzlePieceIcon,
    color: "bg-gradient-to-r from-purple-500 to-pink-600",
  },
]);

// 选中状态
const hoverIndex = ref(null);

// 进入页面方法
const enterWorld = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">

    <!-- 标题 -->
    <h1 class="text-5xl font-bold text-center mb-16 text-gray-800 animate__animated animate__fadeIn">
      Welcome to My World
    </h1>

    <!-- 入口卡片 -->
    <div class="flex justify-center gap-8 mb-20">
      <div v-for="(item, index) in worlds" :key="index" @click="enterWorld(item.path)" @mouseover="hoverIndex = index"
        @mouseleave="hoverIndex = null"
        class="relative w-80 h-80 p-6 flex flex-col items-center justify-center rounded-3xl shadow-xl cursor-pointer transform transition-all duration-500"
        :class="[item.color, hoverIndex === index ? 'scale-110 shadow-2xl' : 'scale-100']">
        <component :is="item.icon" class="w-16 h-16 text-white mb-4" />
        <h2 class="text-2xl font-semibold text-white text-center">{{ item.title }}</h2>
        <p class="text-sm text-white opacity-80 text-center mt-2">{{ item.description }}</p>
      </div>
    </div>

    <!-- 底部文字 -->
    <p class="absolute bottom-4 text-gray-600 text-center text-sm animate__animated animate__fadeIn animate__delay-1s">
      Select one of the portals and dive into my world...
    </p>
  </div>
</template>

<style scoped>
/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate__fadeIn {
  animation: fadeIn 1s ease-out;
}

.animate__delay-1s {
  animation-delay: 1s;
}
</style>
