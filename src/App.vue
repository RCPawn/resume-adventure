<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TestVue from './Test.vue'
import MouseCursor from "@/components/MouseCursor.vue";

</script>

<template>
  <MouseCursor />
  <RouterView />
<!--   <TestVue />-->
</template>

<style scoped>
@media (hover: hover) {
  /* 强制所有元素继承 html 的自定义鼠标 */
  body, a, button, .clickable {
    cursor: inherit !important;
  }
}
</style>
