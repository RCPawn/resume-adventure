<template>
  <div class="sketch-container">
    <div class="emoji">🚧</div>
    <h1 class="sketch-title">{{ t('stuffs.building') }}</h1>
    <p class="sketch-text">{{ t('stuffs.developing') }}</p>
    <button class="sketch-btn" @click="goBack">{{ t('stuffs.back') }}</button>
  </div>
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
/* 重置基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@font-face {
  font-family: 'Sketchy';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf') format('truetype');
}

.sketch-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
  text-align: center;
}

.emoji {
  font-size: 5rem;
  margin-bottom: 30px;
  animation: wobble 2s infinite;
  filter: drop-shadow(3px 3px 2px rgba(0,0,0,0.2));
}

@keyframes wobble {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.sketch-title {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #333;
  text-shadow: 2px 2px 0px #fff;
  position: relative;
  display: inline-block;
}

.sketch-title::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,1 Q5,3 10,1 Q15,-1 20,1 Q25,3 30,1 Q35,-1 40,1 Q45,3 50,1 Q55,-1 60,1 Q65,3 70,1 Q75,-1 80,1 Q85,3 90,1 Q95,-1 100,1' stroke='%23333' stroke-width='1' fill='none'/%3E%3C/svg%3E");
  background-size: 100px 3px;
  background-repeat: repeat-x;
}

.sketch-text {
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 40px;
  max-width: 80%;
  line-height: 1.5;
  position: relative;
  display: inline-block;
}

.sketch-btn {
  display: inline-block;
  padding: 12px 30px;
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
}

.sketch-btn:hover {
  box-shadow: 2px 2px 0 #333;
  transform: translate(2px, 2px);
}

.sketch-btn:active {
  box-shadow: none;
  transform: translate(4px, 4px);
}

/* 添加一些手绘元素 */
.sketch-container::before {
  content: "";
  position: absolute;
  top: 10%;
  right: 15%;
  width: 100px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,10 Q30,5 50,30 T90,40 Q75,60 80,80 T20,90 Q10,60 10,10 Z' stroke='%23ddd' stroke-width='2' fill='none' stroke-dasharray='5,5'/%3E%3C/svg%3E");
  opacity: 0.5;
}

.sketch-container::after {
  content: "";
  position: absolute;
  bottom: 10%;
  left: 10%;
  width: 150px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg width='150' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,40 Q40,10 70,40 T140,40' stroke='%23ddd' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  opacity: 0.5;
}
</style>