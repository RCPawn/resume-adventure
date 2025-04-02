<template>
  <div class="napkin-container napkin-background">
    <NavBar/>
    <Chatbot/>
    <HeroSection/>
    <SkillsSection/>
    <ProjectsSection/>
    <ExperienceSection/>
    <FooterSection/>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import Chatbot from "@/components/chatbot/Chatbot.vue";
import HeroSection from '@/components/HeroSection.vue';
import SkillsSection from "@/components/SkillsSection.vue";
import ProjectsSection from '@/components/ProjectsSection.vue';
import ExperienceSection from "@/components/GallerySection.vue";
import FooterSection from '@/components/FooterSection.vue';
import {onMounted} from 'vue';

onMounted(() => {
  console.log('' +
      ' __    __  ________  __      __        ______         ______   __       __        _______    ______   _______    ______   __       __  __    __ \n' +
      '|  \\  |  \\|        \\|  \\    /  \\      |      \\       /      \\ |  \\     /  \\      |       \\  /      \\ |       \\  /      \\ |  \\  _  |  \\|  \\  |  \\\n' +
      '| $$  | $$| $$$$$$$$ \\$$\\  /  $$       \\$$$$$$      |  $$$$$$\\| $$\\   /  $$      | $$$$$$$\\|  $$$$$$\\| $$$$$$$\\|  $$$$$$\\| $$ / \\ | $$| $$\\ | $$\n' +
      '| $$__| $$| $$__      \\$$\\/  $$         | $$        | $$__| $$| $$$\\ /  $$$      | $$__| $$| $$   \\$$| $$__/ $$| $$__| $$| $$/  $\\| $$| $$$\\| $$\n' +
      '| $$    $$| $$  \\      \\$$  $$          | $$        | $$    $$| $$$$\\  $$$$      | $$    $$| $$      | $$    $$| $$    $$| $$  $$$\\ $$| $$$$\\ $$\n' +
      '| $$$$$$$$| $$$$$$      \\$$$$           | $$        | $$$$$$$$| $$\\$$ $$ $$      | $$$$$$$\\| $$   __ | $$$$$$$ | $$$$$$$$| $$ $$\\$$\\$$| $$\\$$ $$\n' +
      '| $$  | $$| $$_____     | $$ __        _| $$_       | $$  | $$| $$ \\$$$| $$      | $$  | $$| $$__/  \\| $$      | $$  | $$| $$$$  \\$$$$| $$ \\$$$$\n' +
      '| $$  | $$| $$     \\    | $$|  \\      |   $$ \\      | $$  | $$| $$  \\$ | $$      | $$  | $$ \\$$    $$| $$      | $$  | $$| $$$    \\$$$| $$  \\$$$\n' +
      ' \\$$   \\$$ \\$$$$$$$$     \\$$| $$       \\$$$$$$       \\$$   \\$$ \\$$      \\$$       \\$$   \\$$  \\$$$$$$  \\$$       \\$$   \\$$ \\$$      \\$$ \\$$   \\$$\n' +
      '                             \\$                                                                                                                 \n' +
      '                                                                                                                                                \n' +
      '                                                                                                                                                ' +
      '');
});

</script>

<style>

/* 全局样式 */
.napkin-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #F8F8F8;
}
</style>