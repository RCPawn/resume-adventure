<template>
  <div class="napkin-container napkin-background">
    <NavBar/>
    <HeroSection/>
    <!-- 惰性挂载哨兵：紧贴首屏下方，用于接近视口时再加载下部重型组件 -->
    <div
      ref="belowFoldSentinel"
      class="home-below-fold-sentinel"
      aria-hidden="true"
    />
    <template v-if="belowFoldMounted">
      <Chatbot/>
      <ProjectsSection/>
      <ExperienceSection/>
      <FooterSection/>
    </template>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  provide,
  nextTick,
} from 'vue'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'

const Chatbot = defineAsyncComponent(() => import('@/components/chatbot/Chatbot.vue'))
const ProjectsSection = defineAsyncComponent(() => import('@/components/ProjectsSection.vue'))
const ExperienceSection = defineAsyncComponent(() => import('@/components/GallerySection.vue'))
const FooterSection = defineAsyncComponent(() => import('@/components/FooterSection.vue'))

const belowFoldMounted = ref(false)
const belowFoldSentinel = ref(null)

/** 导航锚点跳转前由 NavBar inject 调用，保证 #projects 等节点已挂载 */
async function ensureBelowFold() {
  if (belowFoldMounted.value) {
    await nextTick()
    return
  }
  belowFoldMounted.value = true
  await nextTick()
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

provide('ensureHomeBelowFold', ensureBelowFold)

let belowFoldIo = null
/** @type {number} */
let idleScheduleId = 0

const BELOW_FOLD_HASHES = ['#projects', '#gallery', '#footer']

const mountBelowFoldOnceFromScroll = () => {
  ensureBelowFold()
}

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
      '')

  const hash = (location.hash || '').split('?')[0]
  if (BELOW_FOLD_HASHES.includes(hash)) {
    ensureBelowFold()
  }

  const el = belowFoldSentinel.value
  if (el && typeof IntersectionObserver !== 'undefined') {
    belowFoldIo = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          ensureBelowFold()
          belowFoldIo?.disconnect()
          belowFoldIo = null
        }
      },
      { rootMargin: '260px 0px', threshold: 0 }
    )
    belowFoldIo.observe(el)
  }

  if (typeof window.requestIdleCallback === 'function') {
    idleScheduleId = window.requestIdleCallback(
      () => {
        idleScheduleId = 0
        ensureBelowFold()
      },
      { timeout: 2600 }
    )
  } else {
    idleScheduleId = window.setTimeout(() => {
      idleScheduleId = 0
      ensureBelowFold()
    }, 900)
  }

  window.addEventListener('scroll', mountBelowFoldOnceFromScroll, { passive: true, once: true })
})

onUnmounted(() => {
  belowFoldIo?.disconnect()
  belowFoldIo = null
  if (idleScheduleId) {
    if (typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleScheduleId)
    } else {
      clearTimeout(idleScheduleId)
    }
    idleScheduleId = 0
  }
  window.removeEventListener('scroll', mountBelowFoldOnceFromScroll)
})
</script>

<style>
.napkin-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.home-below-fold-sentinel {
  height: 1px;
  width: 100%;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  pointer-events: none;
  visibility: hidden;
}
</style>
