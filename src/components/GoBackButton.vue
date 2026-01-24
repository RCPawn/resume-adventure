<template>
  <button @click="goBack" class="sketchy-back-btn" title="返回上一级">
    <div class="arrow-icon">←</div>
    <span class="btn-text">{{ t('stuffs.back') }}</span>
  </button>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.sketchy-back-btn {
  padding: 10px 20px;
  background-color: var(--btn-bg);
  border: 2px solid var(--text-color);
  border-radius: 8px;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  box-shadow: var(--hover-shadow);
  transition: all 0.2s ease;
  color: var(--text-color);
}

.sketchy-back-btn:hover {
  box-shadow: 2px 2px 0 var(--text-color);
  transform: translate(2px, 2px);
  background-color: var(--btn-bg);
}

.sketchy-back-btn:active {
  box-shadow: none;
  transform: translate(4px, 4px);
}

.arrow-icon {
  font-size: 1.5rem;
  margin-right: 8px;
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 1;
  color: var(--icon-color);
}

.btn-text {
  position: relative;
  display: inline-block;
}

/* 给按钮添加手绘感的细节 */
.sketchy-back-btn::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 1px dashed var(--border-color);
  border-radius: 10px;
  z-index: -1;
  opacity: 0.5;
}
</style>