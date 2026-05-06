/** 中文文案；各段与站内组件对应关系见段首注释 */
export default {
    /** 顶栏 NavBar */
    nav: {
        logo: 'RCPAWN',
        intro: '开篇',
        journey: '学习足迹',
        works: '作品影像',
        contact: '联系方式',
        game: '我的游戏'
    },

    /** 悬浮 AI 对话 Chatbot */
    chatbot: {
        title: 'AI 助手',
        placeholder: '输入消息…',
        ariaFab: 'AI 助手',
        ariaDialog: 'AI 对话',
        emptyHint: '随便丢一句话进来，我会接住。',
        send: '发送'
    },

    /** 首屏 HeroSection：主标题、副标题、职业标签 */
    title: '嘿，我是过河卒',
    subtitle: '一名软件工程专业的学生',
    professions: [
        { icon: 'code', label: 'Java后端开发者' },
        { icon: 'cloud', label: '微服务架构探索者' },
        { icon: 'cube', label: '热衷于3D和互动设计' }
    ],

    /** 首屏 HeroSection：滚动提示 */
    hero: {
        scrollHint: '向下滚动'
    },

    /** 学习足迹 ProjectsSection（projects.json 的 nameKey；新增条目未配专属图时可用 `/images/projects/玄武岩黑.png`） */
    projects: {
        internship: {
            name: '📋 制造业信息化驻场实习',
            description:
                '在某制造企业侧参与计划与排程相关能力的交付与迭代：与计划、商务及 IT 协同澄清业务口径，推进主数据引用收口、跨系统身份映射与校验等后端工作。涉及客户现网环境、第三方商业产品及内部实现细节依保密协议不予展示。',
        },
        items: [
            {
                name: "🛡️微服务流量治理与统一接入网关平台",
                description: "自主研发的微服务网关平台，深度整合了全链路鉴权、动态路由、流量治理、安全防御、异步日志及可视化配置与监控，构建了安全可观测的流量入口。"
            },
            {
                name: "🎪非遗虚拟展陈与数据监测平台",
                description: "针对非遗文化保护痛点设计的数字化平台，实现了非遗 3D 展示、UGC 社区互动与传承系谱图等功能；系统通过数字驾驶舱实时监测全站资产交互热度，实现非遗资源从“云端采集”到“跨模态交互”的全链路闭环。"
            },
            {
                name: "🌿榄人千里眼",
                description: "油橄榄园区一体化平台，融合数据可视化、WebGIS与区块链技术的全域资产管理平台"
            },
            {
                name: "☁️天气App",
                description: "后端还未部署（敬请期待😊）"
            },
            {
                name: "🚗简历冒险",
                description: "基于Unity3D开发的互动游戏，通过驾驶小车探索我的学习历程（正在开发中，敬请期待😊）"
            },
            {
                name: "🍩 Web 端 3D 模型 Lab",
                description: "基于 model-viewer 的 GLB 展示练习：相机操控、加载进度与自动旋转等。"
            }
        ],
        title: '学习足迹',
        subtitle: '从 Hello World 到 Hello Bug',
        viewDetails: '查看详情',
        dateUnknown: '日期待定',
        dateCaption: '创建时间',
        indexRailAria: '学习足迹卡片索引',
        /** 与 projects.json 每条 id 对应，左侧目录短标题 */
        indexLabels: {
            'enterprise-internship': '浙江实习',
            gateway: '接入网关',
            exhibition: '非遗展陈',
            'olive-ppt': '榄园平台',
            'resume-game': '简历冒险',
            'weather-app': '天气',
            'model-viewer-page': '3D Lab'
        },
        indexJumpAria: '第 {n} 项，共 {total} 项：{short}'
    },

    /** 作品影像 GallerySection（gallery.items 顺序与 GallerySection 内图片列表一致） */
    gallery: {
        title: '作品影像',
        subtitle: '核心功能模块截图，记录系统关键逻辑的实现与运行状态。',
        streamPrefix: '// VISUAL_ARCHIVE',
        snapCounter: '{current} / {total}',
        snapRegionAria: '作品影像横向橱窗',
        snapPrevAria: '上一张',
        snapNextAria: '下一张',
        snapDotsAria: '当前页定位',
        progressAria: '全局浏览进度',
        indicatorSegAria: '第 {n} 张：{title}',
        toolbarAria: '作品影像筛选与导航',
        searchPlaceholder: '搜索…',
        searchAria: '按文案筛选截图',
        categoryGroupAria: '按分类筛选',
        categoryAll: '全部',
        categoryExhibition: '非遗展陈',
        categoryGateway: '接入网关',
        categoryOther: '其他',
        jumpPlaceholder: '定位到…',
        jumpAria: '选择截图并定位',
        pagePrevAria: '上一页',
        pageNextAria: '下一页',
        pageIndicator: '{current}/{total}',
        emptyFiltered: '没有匹配的截图，可清空搜索或切换分类后再试。',
        viewDetail: '查看详情',
        items: {
            work0: { title: '数字孪生数据大屏', desc: '深色主题数字孪生仪表盘：资源构成、类目分布、交互行为与热词云，中央聚焦全站热度最高的白族三合院 3D。' },
            work1: { title: '沉浸式门户首页', desc: '浅色门户首屏：实时监测展品、浏览与互动等核心指标，右侧呈现「镇馆之宝」三合院数字孪生模型。' },
            work2: { title: '在线展厅 · 展品详情', desc: '在线展厅中的白族三合院：左侧 Three.js 场景漫游，中部图文与历史渊源，右侧用户讨论区。' },
            work3: { title: '纸上乾坤 · 影像专栏', desc: '图文专栏瀑布流布局，呈现扎染、建筑、木雕、三道茶等非遗影像与生活叙事。' },
            work4: { title: '网关管理控制台', desc: '统一接入网关的可视化管理端，集成全链路鉴权与服务运行状态监控。' },
            work5: { title: '流量防卫监控', desc: '深度集成 Sentinel 实现 QPS 流控与熔断降级，通过 Nacos 实现规则持久化。' },
            work6: { title: '动态路由配置', desc: '基于 Nacos Config 监听机制实现零停机路由刷新，修改规则无需重启网关。' },
            work7: { title: '操作审计日志', desc: '记录网关层接入的所有请求明细，提供全链路追踪与管理后台审计功能。' },
            work8: { title: '3D 场景渲染', desc: 'WebGL 渲染练习，探索 3D 模型在数字化展陈平台中的光影效果与交互性能。' },
            work10: { title: '网关系统架构', desc: '基于 Spring Cloud Gateway 设计，涵盖动态路由、安全防御与异步日志的完整架构。' },
            work11: { title: '安全防御配置', desc: '基于 Redis + Lua 设计防重放过滤器，利用 Nonce 与时间戳机制拦截重复请求。' },
            work12: { title: '路由矩阵总览', desc: '服务路由拓扑图，清晰展示请求从客户端经网关分发至下游微服务的完整链路。' },
            work13: { title: '异步日志削峰', desc: '基于 RabbitMQ 实现日志解耦，高延迟环境下使系统吞吐量由 89 提升至 1100+ QPS。' },
            work14: { title: '传承关系图谱', desc: '传统技艺谱系力导向图：技艺项目、子分类与传承人节点可拖拽缩放，支持右侧传承说明。' },
            work15: { title: '传承图谱扉页', desc: '传承图谱入口扉页：立体典籍视觉与「点击查阅」引导，副标题「经纬交织 · 纸上乾坤」。' },
            work16: { title: '实时流量波形', desc: 'ECharts 动态绘制网关 QPS、错误率及响应耗时曲线，直观呈现系统健康状态。' },
            work17: { title: '非遗图文档案', desc: '单篇非遗图文专题：主图轮播与缩略图轨，叠底解说文案，完整呈现扎染等叙事内容。' },
        }
    },

    /** 页脚 FooterSection */
    footer: {
        appName: '开发者空间',
        tagline: '让编码创造更多可能',
        techTitle: '本网站由以下技术驱动',
        downloadResume: '下载简历',
        downloadResumeAria: '下载简历文件',
        copyright: '© {year} 开发者空间. 保留所有权利.',
        madeWith: 'rcpawn 用热爱和代码精心制作',
        stayInTouch: '保持联系',
        statsSitePv: '总访问量',
        statsTodayUv: '今日访客',
        statsRunning: '已运行',
        statsRunningUnit: '天',
        statsPvFormat: '{n} 次',
        statsUvFormat: '{n} 人',
        statsGroupAria: '站点统计',
        socialLinks: [
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
        ],
        linkGroups: [
            {
                title: '项目',
                links: [
                    {text: '非遗展陈', url: '/project/exhibition'},
                    {text: '我的网关', url: '/project/gateway'},
                    {text: '校企合作', url: '/olive-ppt'}
                ]
            },
            {
                title: '站内',
                links: [
                    {text: 'GitHub', url: 'https://github.com/RCPawn'},
                    {text: '我的游戏', url: '/game'}
                ]
            }
        ]
    }
}
