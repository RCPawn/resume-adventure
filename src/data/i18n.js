import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'HEY, I AM RCPAWN',
    subtitle: 'A SOFTWARE ENGINEERING STUDENT',
    profession: [
      'Full-stack Developer',
      'Unity & Blender Enthusiast',
      'Passionate About 3D and Interactive Design'
    ],
    buttons: {
      viewProjects: 'ENTER MY WORLD',
      aboutSite: 'ABOUT THIS SITE'
    }
  },
  cn: {
    title: '嘿，我是RCPAWN',
    subtitle: '一名软件工程学生',
    profession: [
      '全栈开发者',
      'Unity & Blender爱好者',
      '热衷于3D和互动设计'
    ],
    buttons: {
      viewProjects: '进入我的世界',
      aboutSite: '关于这个网站'
    }
  }
}

const i18n = createI18n({
  locale: 'en', // 默认语言
  messages,
})

export default i18n
