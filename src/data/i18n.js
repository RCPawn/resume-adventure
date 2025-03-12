import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      logo: 'RCPAWN',
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      gallery: 'Gallery',
      assistant: 'Assistant'
    },
    title: 'HEY, I AM RCPAWN',
    subtitle: 'A SOFTWARE ENGINEERING STUDENT',
    professions: [
      'Full-stack Developer',
      'Deep Learning Enthusiast',
      'Passionate About 3D and Interactive Design'
    ],
    buttons: {
      viewProjects: 'ENTER MY WORLD',
      aboutSite: 'ABOUT THIS SITE'
    },
    about: {
      title: 'About Me',
      intro: 'I am a passionate developer with a keen interest in interactive design.',
      modulesTitle: 'My Skills',  // 新增：模块标题
      modules: [                 // 修改为数组，方便遍历
        'HTML',
        'CSS',
        'JavaScript',
        'Vue',
        'Node.js'
      ],
      visionTitle: 'My Vision',
      vision: 'I strive to create innovative solutions that blend technology and creativity.',
      contactTitle: 'Get in Touch',
      contact: 'Feel free to reach out for collaborations or inquiries.'
    }
  },
  cn: {
    nav: {
      logo: '过河卒',
      home: '主页',
      about: '关于',
      projects: '项目',
      gallery: '画廊',
      assistant: '小助手'
    },
    title: '嘿，我是过河卒',
    subtitle: '一名软件工程学生',
    professions: [
      '全栈开发者',
      '深度学习爱好者',
      '热衷于3D和互动设计'
    ],
    buttons: {
      viewProjects: '进入我的世界',
      aboutSite: '关于这个网站'
    },
    about: {
      title: '关于我',
      intro: '我是一名充满热情的开发者，对互动设计充满兴趣。',
      modulesTitle: '我的技能',  // 新增：模块标题
      modules: [                 // 修改为数组，方便遍历
        'HTML',
        'CSS',
        'JavaScript',
        'Vue',
        'Node.js'
      ],
      visionTitle: '我的愿景',
      vision: '我致力于打造融合科技与创意的创新解决方案。',
      contactTitle: '联系我',
      contact: '欢迎联系我进行合作或咨询。'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages,
  warnHtmlInMessage: 'off'
})

export default i18n
