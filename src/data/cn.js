// data/i18n/cn.js
// 中文语言包
import '@/assets/styles/leetcodeIcon.css';

export default {
    nav: {
        logo: '过河卒',
        home: '主页',
        skill: '技能',
        experience: '经历',
        gallery: '画廊',
        resume: '简历',
        footer: '关于'
    },
    title: '嘿，我是过河卒',
    subtitle: '一名软件工程专业的学生',
    professions: [
        '后端开发者',
        '深度学习爱好者',
        '热衷于3D和互动设计'
    ],
    skills: {
        title: '技能图谱',
        subtitle: '百分比为测试数据',
        skillTarget: '技能目标',
        current: '当前水平',
        target: '目标水平',
        items: [
            {
                name: '后端开发',
                icon: 'fas fa-laptop-code',
                level: 60,
                target: 85
            },
            {
                name: '数据库设计',
                icon: 'fas fa-database',
                level: 50,
                target: 75
            },
            {
                name: '算法与数据结构',
                icon: 'fas fa-code',
                level: 55,
                target: 80
            },
            {
                name: '人工智能与机器学习',
                icon: 'fas fa-brain',
                level: 20,
                target: 70
            },
            {
                name: '游戏与3D开发',
                icon: 'fas fa-gamepad',
                level: 30,
                target: 60
            },
            {
                name: '版本控制与协作',
                icon: 'fab fa-github',
                level: 60,
                target: 80
            }
        ]
    },
    projects: {
        items: [
            {
                name: "榄人千里眼",
                description: "油橄榄园区一体化平台，融合数据可视化、WebGIS与区块链技术的全域资产管理平台"
            },
            {
                name: "算法心得",
                description: "敬请期待😊"
            },
            {
                name: "GitHub开源",
                description: "敬请期待😊"
            },
            {
                name: "深度学习",
                description: "敬请期待😊"
            },
            {
                name: "天气App",
                description: "后端还未部署（敬请期待😊）"
            },
            {
                name: "简历冒险",
                description: "基于Unity3D开发的互动游戏，通过驾驶小车探索我的学习历程（敬请期待😊）"
            },
            {
                name: "甜甜圈",
                description: "使用Blender学习创作的3D模型，展示建模、材质、光照与动画技术"
            },
            {
                name: "技能目标",
                description: "简单展示自己的技能目标（当前百分比为测试数据）"
            }
        ],
        title: '学习经历',
        subtitle: '从 Hello World 到 Hello Bug',
        viewDetails: '查看详情'
    },
    gallery: {
        title: '作品展示',
        subtitle: '截图留念，证明曾经跑通过',
    },
    stuffs: {
        back: '返回',
        building: '建设中...',
        developing: '该页面还在开发中，敬请期待！...',
    },
    resume: {
        education: {
            title: "教育背景",
            items: [
                "软件工程（2022.09 - 2026.07）",
                "GPA 3.47/4.0 (专业前20%)",
                "连续两年获得校级奖学金 (2023-2025)",
                "英语水平 CET-6"
            ]
        },

        skills: {
            title: "专业技能",
            categories: [
                {
                    name: "编程语言",
                    items: [
                        "熟练掌握 Java 核心语法、集合框架、面向对象设计，熟悉反射及异常处理机制"
                    ]
                },
                {
                    name: "存储层开发",
                    items: [
                        "熟练使用 MyBatis 框架，能编写 SQL 满足基本业务需求，理解索引优化、事务隔离级别与锁机制",
                        "熟练使用 MySQL，熟悉 Redis 缓存应用，理解其常用数据结构、数据持久化及缓存一致性方案"
                    ]
                },
                {
                    name: "服务端框架",
                    items: [
                        "熟练使用 Spring Boot / Spring MVC，理解 IoC、AOP、Bean 生命周期"
                    ]
                },
                {
                    name: "前端与可视化",
                    items: [
                        "熟悉 Vue3 框架，了解 WebGL (model-viewer) 渲染原理，具备 3D 模型与后端数据交互的联调经验"
                    ]
                },
                {
                    name: "系统设计",
                    items: [
                        "熟悉常见设计模式，如单例、工厂、模板方法、责任链、策略模式等",
                        "了解JVM基础知识，包括堆、栈内存划分，垃圾回收概念，以及类加载的基本流程"
                    ]
                },
                {
                    name: "通信协议",
                    items: [
                        "了解 WebSocket 协议，能够实现服务器与客户端之间的实时消息推送"
                    ]
                },
                {
                    name: "工程化工具",
                    items: [
                        "熟练使用 IDEA / Git / Maven 等核心开发工具，具备良好的 Markdown 文档编写习惯"
                    ]
                }
            ]
        },
        projects: {
            title: "项目经历",
            stackLabel: "技术栈",
            contributionsLabel: "主要工作",
            items: [
                {
                    title: "基于 SpringBoot 与 WebGL 的非遗数字展厅设计与实现 (2025.12 - 至今)",
                    description: "项目描述：针对非遗文化设计的数字双生平台，实现 3D 展品全方位展示、实时动态统计与高交互讨论。核心技术包括 Spring Boot、Vue3、WebGL、MyBatis、MySQL。",
                    stack: "Spring Boot、Vue3、WebGL、MyBatis、MySQL",
                    contributions: [
                        "依托成熟框架完成系统全链路开发，参考得物设计规范重塑高保真交互布局，攻克 3D 非遗物品上传存储与 Web 端实时渲染展示难题，实现非遗展品管理模块从数据建模到终端展示的技术闭环。",
                        "设计并实现了点赞/收藏状态切换逻辑，引入 user_action 记录表，结合 Spring 事务 (@Transactional) 确保“用户行为记录”与“主表统计字段”的强一致性，支持状态持久化。",
                        "在 SQL 更新层采用原子操作与 CASE WHEN 逻辑，有效避免了高频点击下的并发数据污染，并实现计数值“非负”校验，提升了系统鲁棒性。",
                        "针对 WebGL 组件 <model-viewer> 在框架缓存机制下出现的渲染死循环与白屏问题，利用 Vue3 生命周期管理与 Key 机制强制组件重绘，显著提升了 3D 模型的加载稳定性与切换流畅度。"
                    ]
                },
                {
                    title: "榄人千里眼-万亩油橄榄林区资产可视智能管控平台（2024.09 - 2025.03）",
                    description: "项目描述：实验室合作项目，为企业开发的农业资产数字化管理平台，覆盖 12 个管区、1000+ 台设备（捕虫灯、割草机等），提供资产入库、跨区调拨、扫码报修、工单派送等全生命周期管理功能，解决传统农业资产管理中的盘点困难、台账混乱、跨区协同低效等问题，预计上线后可降低企业运维成本 30%+。",
                    stack: "Spring Boot、MySQL、Redis、MyBatis",
                    contributions: [
                        "引入状态机设计模式驱动资产全生命周期管理（入库、调拨、报修、报废），提升资产台账准确性及利用率。",
                        "利用 Redis 对高频访问的设备地理位置与运行状态进行缓存，显著降低了林区大地图渲染时的数据库穿透压力。",
                        "基于 WebSocket 构建工单派送模块，引入优先级队列与超时告警机制，确保紧急任务优先处理，超时 30 分钟未处理自动触发分级告警。",
                        "结合 AOP + 自定义注解搭建权限拦截与操作审计体系，从技术层面保障敏感操作的合规性。"
                    ],
                    highlight: "项目收获：掌握企业级全栈开发流程，提升SpringBoot整合技术栈的工程化落地能力，通过跨角色协作（产品、前端）完成项目交付，强化沟通与文档输出能力。"
                },
                {
                    title: "校园二手交易平台（2023.09 - 2023.11）",
                    description: "软件工程课程小组项目，支持用户注册登录、商品发布、浏览及简单交易功能，旨在通过实践掌握前后端协作开发流程，并完成基础功能实现。",
                    stack: "Spring Boot、Vue3、MySQL、MyBatis",
                    contributions: [
                        "自学相关知识，完成前后端基础环境搭建、数据库连接，并实现登录注册功能。",
                        "开发商品管理模块，支持多条件查询（如分类、价格区间），集成 PageHelper 实现分页展示",
                        "通过 Git（Sourcetree）管理分支，制定团队代码提交规范，多次解决分支合并冲突",
                        "作为小组负责人，利用在线协作平台分配任务并跟踪进度，确保项目按时交付"
                    ]
                },
                {
                    title: "Resume Adventure（个人网站）",
                    description: "基于SpringBoot+Vue3，独自设计的个人网站，通过AI辅助编程（Claude/ChatGPT）高效完成核心模块开发。",
                    stack: "SpringBoot, Vue3",
                    contributions: [
                        "调用腾讯云大模型知识引擎API，基于个人知识库实现智能问答功能",
                        "整合Three.js技术，实现项目展示区3D交互效果",
                        "基于Reveal.js开发在线演示模块，将个人项目经历转化为交互式PPT展示",
                        "设计开发简洁美观的个人信息展示页面，清晰呈现学习经历、技能与项目成果"
                    ],
                    highlight: "项目特点：独立全栈开发项目，实践AI辅助编程工作流，探索前沿技术在实际项目中的应用。"
                }
            ]
        },
        algo: {
            title: "算法能力",
            items: [
                "力扣刷题300+道，覆盖动态规划、回溯、贪心算法等，享受代码AC的过程",
                "熟悉常见算法复杂度分析与优化方法",
                "能够针对实际问题选择合适的算法解决方案"
            ]
        },
        courses: {
            title: "专业课程",
            items: [
                "计算机基础：数据结构、算法分析与设计、计算机组成原理、计算机网络、操作系统",
                "开发技术：JavaEE、Web前端开发、数据库概论",
                "人工智能：机器学习基础、PyTorch实践课程"
            ]
        },
        selfLearning: {
            title: "自我评价",
            items: [
                "愿意持续学习，记录学习经历及收获（GitHub仓库）",
                "对新兴技术有浓厚兴趣，善于将想法落地实现（个人博客）"
            ]
        },
        softSkills: {
            title: "软技能",
            items: [
                "拥有实验室项目合作经验，沟通主动，能快速融入团队并配合团队成员完成开发任务"
            ]
        }
    },
    footer: {
        appName: '开发者空间',
        tagline:
            '让编码创造更多可能',
        copyright:
            '© {year} 开发者空间. 保留所有权利.',
        madeWith:
            '用热爱和代码精心制作',
        socialLinks:
            [
                {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
                {url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok'},
                {url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
            ],
        linkGroups:
            [
                {
                    title: '项目',
                    links: [
                        {text: '全栈应用', url: '/olive-ppt'},
                        {text: '3D模型', url: '/model'},
                        {
                            text: 'AI实验室',
                            url: 'https://github.com/RCPawn/ai-generate-prompt-words/blob/main/README.md'
                        }
                    ]
                },
                {
                    title: "资源",
                    links: [
                        {text: "文档", url: "/coming-soon"},
                        {text: "教程", url: "/coming-soon"},
                        {text: "源码", url: "/coming-soon"}
                    ],
                },
                {
                    title: '关于',
                    links: [
                        {text: '简介', url: 'https://github.com/RCPawn'},
                        {text: '联系', url: '/coming-soon'},
                        {text: '博客', url: 'https://github.com/RCPawn'}
                    ]
                }
            ]
    }
}
