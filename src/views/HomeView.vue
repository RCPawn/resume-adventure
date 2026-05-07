<script>
export default { name: 'HomeView' }
</script>

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
  onActivated,
  onDeactivated,
  defineAsyncComponent,
  provide,
  nextTick,
} from 'vue'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import {
  peekHomeProjectReturn,
  clearHomeProjectReturn,
} from '@/utils/homeScrollRestore.js'

const Chatbot = defineAsyncComponent(() => import('@/components/chatbot/Chatbot.vue'))
const ProjectsSection = defineAsyncComponent(() => import('@/components/ProjectsSection.vue'))
const ExperienceSection = defineAsyncComponent(() => import('@/components/GallerySection.vue'))
const FooterSection = defineAsyncComponent(() => import('@/components/FooterSection.vue'))

const BELOW_FOLD_HASHES = ['#projects', '#gallery', '#footer']

function getInitialBelowFoldMounted() {
  if (typeof window === 'undefined') return false
  const hash = (location.hash || '').split('?')[0]
  if (BELOW_FOLD_HASHES.includes(hash)) return true
  if (peekHomeProjectReturn()) {
    void import('@/components/ProjectsSection.vue')
    return true
  }
  return false
}

const belowFoldMounted = ref(getInitialBelowFoldMounted())
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

const mountBelowFoldOnceFromScroll = () => {
  ensureBelowFold()
}

function teardownBelowFoldGuards() {
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
}

/** 首访未展开下部区块时：哨兵 + 空闲 + 滚动一次触发挂载 */
function setupBelowFoldGuards() {
  if (belowFoldMounted.value) return

  const el = belowFoldSentinel.value
  if (el && typeof IntersectionObserver !== 'undefined' && !belowFoldIo) {
    belowFoldIo = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          ensureBelowFold()
          belowFoldIo?.disconnect()
          belowFoldIo = null
        }
      },
      { rootMargin: '260px 0px', threshold: 0 },
    )
    belowFoldIo.observe(el)
  }

  if (!idleScheduleId) {
    if (typeof window.requestIdleCallback === 'function') {
      idleScheduleId = window.requestIdleCallback(
        () => {
          idleScheduleId = 0
          ensureBelowFold()
        },
        { timeout: 2600 },
      )
    } else {
      idleScheduleId = window.setTimeout(() => {
        idleScheduleId = 0
        ensureBelowFold()
      }, 900)
    }
  }

  window.addEventListener('scroll', mountBelowFoldOnceFromScroll, { passive: true, once: true })
}

/** 从详情回首页时滚动到对应学习足迹卡片（须配合 keep-alive 在 onActivated 中调用） */
async function restoreHomeProjectCardScroll() {
  const payload = peekHomeProjectReturn()
  if (!payload?.projectId) return
  const id = payload.projectId
  const esc =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(id)
      : id.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const selector = `#projects .project-node[data-project-id="${esc}"]`
  try {
    await ensureBelowFold()
    for (let attempt = 0; attempt < 50; attempt++) {
      await nextTick()
      const card = document.querySelector(selector)
      if (card) {
        card.scrollIntoView({ block: 'start', behavior: 'auto' })
        return
      }
      await new Promise((r) => setTimeout(r, 40))
    }
  } finally {
    clearHomeProjectReturn()
  }
}

onActivated(async () => {
  await nextTick()
  await restoreHomeProjectCardScroll()
  setupBelowFoldGuards()
})

onDeactivated(() => {
  teardownBelowFoldGuards()
})

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
})

onUnmounted(() => {
  teardownBelowFoldGuards()
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
