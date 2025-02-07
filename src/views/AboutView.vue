<template>
  <div class="about">
    <GoBackButton />

    <header class="about-header">
      <h1 class="about-title">关于我的网站</h1>
    </header>

    <section class="about-intro">
      <p>
        欢迎来到我的个人网站！这个网站旨在为您展示我的专业背景、个人项目以及创意作品。通过这个平台，您可以更好地了解我的技能和职业方向。
      </p>
    </section>

    <section class="about-modules">
      <h2 id="modules">网站模块</h2>
      <ul>
        <li>
          <strong>GitHub:</strong> 我的代码仓库，里面放着我写的代码。
        </li>
        <li>
          <strong>Projects:</strong> 我的一些个人项目和作品集，展示了我的设计能力与开发技能。
        </li>
        <li>
          <strong>Resume Adventure:</strong> 一款小游戏，通过探索方式展现我的教育背景、技能与工作经历。
        </li>
      </ul>
    </section>

    <section class="about-vision">
      <h2 id="vision">设计理念</h2>
      <p>
        本网站采用简洁现代的设计风格，旨在提供直观且有趣的浏览体验。通过动画和交互设计，让您轻松了解我的专业背景和能力。
      </p>
    </section>

    <section class="about-contact">
      <h2 id="contact">联系方式</h2>
      <p><strong>电话 & 微信：</strong>18076120275</p>
    </section>
  </div>
</template>

<script setup>
import GoBackButton from '@/components/GoBackButton.vue'
</script>

<style scoped>
:root {
  --primary-color: #34495e;
  --secondary-color: #2d3436;
  --highlight-color: #3498db;
  --background-color: #f5f5f5;
  --font-family: 'Helvetica Neue', sans-serif;
}

.about {
  padding: 1.5rem 2rem;
  font-family: var(--font-family);
  color: var(--secondary-color);
  background: var(--background-color);
  line-height: 1.7;
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  /* 调近顶部距离 */
}

.about-intro,
.about-modules,
.about-vision,
.about-contact {
  margin-bottom: 1.5rem;
}

.about-modules ul {
  list-style: disc;
  margin-left: 1.5rem;
  padding-left: 0.5rem;
}

.about-modules li {
  margin: 0.3rem 0;
}

.about-contact p {
  margin: 0.3rem 0;
}

.about-modules h2,
.about-vision h2,
.about-contact h2 {
  cursor: pointer;
  transition: color 0.3s ease;
}

.about-modules h2:hover,
.about-vision h2:hover,
.about-contact h2:hover {
  color: var(--highlight-color);
}

@media (min-width: 1024px) {
  .about {
    padding: 2rem 4rem;
    min-height: calc(100vh - 100px);
    justify-content: flex-start;
  }

  .about-title {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
    margin-top: 0.25rem;
    /* 更进一步调整顶部距离 */
  }

  .about-intro,
  .about-modules,
  .about-vision,
  .about-contact {
    margin-bottom: 1.75rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }

  .about-title {
    font-size: 1.75rem;
    margin-top: 0.5rem;
    /* 保证移动端也近一些 */
  }
}
</style>
