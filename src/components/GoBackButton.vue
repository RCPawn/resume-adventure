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
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  color: #333;
  text-decoration: none;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
  font-size: 1.2rem;
  font-weight: bold;
  position: relative;
  transition: transform 0.2s;
  box-shadow: 3px 3px 0 #333;
  margin: 15px;
}

.sketchy-back-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 #333;
}

.sketchy-back-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #333;
}

.arrow-icon {
  font-size: 1.5rem;
  margin-right: 8px;
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 1;
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
  border: 1px dashed #aaa;
  border-radius: 10px;
  z-index: -1;
  opacity: 0.5;
}

@font-face {
  font-family: 'Sketchy';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf') format('truetype');
}
</style>