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
        '☕ Java后端开发者',
        '☁️ 微服务架构探索者',
        '🎨 热衷于3D和互动设计'
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

// ... existing education ...

        skills: {
            title: "专业技能",
            categories: [
                {
                    name: "Java 核心",
                    items: [
                        "熟练使用 Java 语言与集合框架，熟悉 ThreadLocal 线程隔离应用，了解 JVM 内存模型与 GC 机制"
                    ]
                },
                {
                    name: "微服务架构",
                    items: [
                        "熟悉 Spring Cloud Alibaba 生态，掌握 Nacos、Sentinel、OpenFeign 核心组件及服务治理",
                        "掌握 Spring Cloud Gateway 架构，理解 Netty + WebFlux 响应式模型及 Filter 链机制"
                    ]
                },
                {
                    name: "服务端框架",
                    items: [
                        "熟练使用 Spring Boot / Spring MVC 进行后端开发，理解 IoC、AOP 原理及 Bean 生命周期"
                    ]
                },
                {
                    name: "数据库与缓存",
                    items: [
                        "熟练使用 MySQL，掌握 SQL 编写，熟悉索引优化，理解事务隔离级别与 MVCC/锁机制",
                        "熟悉 Redis 核心数据结构及应用场景，掌握缓存穿透/击穿/雪崩的解决方案及双写一致性策略"
                    ]
                },
                {
                    name: "前端技术",
                    items: [
                        "熟悉 Vue3 + Element Plus 开发，具备前后端联调、CORS 跨域处理及组件化开发经验"
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
                    title: "微服务流量治理与统一接入网关平台 (2025.12 - 至今)",
                    description: "自主研发的微服务统一流量治理平台，深度整合了动态路由热更新、全链路身份安全闭环、Sentinel 高可用防护及 SkyWalking 链路追踪，配套开发 Vue3 可视化运维控制台，通过 Nacos 与 Actuator 实现路由规则的零停机动态管理与服务健康实时监控，构建了安全可观测的流量入口。",
                    stack: "Spring Boot 3、Spring Cloud Alibaba (Nacos, Sentinel)、Spring Cloud Gateway",
                    contributions: [
                        "全链路身份闭环：针对微服务间调用 Token 丢失痛点，设计基于 ThreadLocal + Feign 拦截器的透传方案，在网关层注入 Header，配合内部拦截器实现令牌中继，确保用户 ID 与 Token 在全链路的无缝传递。",
                        "零停机动态路由：摒弃 YAML 静态配置，基于 Nacos Config 监听机制开发动态路由加载器，监听配置变更并调用 Gateway 底层 API 实时刷新路由表，达成修改路由规则无需重启网关的目标。",
                        "流量治理与监控：基于 Sentinel 实现核心接口的 QPS 限流与熔断降级，并通过 Nacos 落地规则持久化方案，整合 SkyWalking 探针实现分布式全链路追踪，通过异常处理规范限流响应，并精准定位系统耗时瓶颈。",
                        "可视化管理平台：独立搭建 Vue3 管理后台，配置全局 CORS 解决跨域，对接 Actuator 端点与管理接口，实现了路由规则的可视化查看及服务健康状态监控。"
                    ]
                },
                {
                    title: "非遗虚拟陈列与数据监测平台 (2024.09 - 2025.01)",
                    description: "针对非遗文化设计的数字双生平台，实现 3D 展品全方位展示、实时动态统计与高交互讨论等功能。",
                    stack: "Spring Boot、Vue3、WebGL、MyBatis、MySQL",
                    contributions: [
                        "业务闭环与全栈建模：独立完成系统全链路开发，设计并落地 UGC 发布系统，重构分类模型为层级架构，利用递归算法与级联选择器实现了对复杂非遗项目谱系的精准管理与数据聚合。",
                        "数字化看板：构建集成 WebGL 与 ECharts 的数字驾驶舱，实时分析资源分布与交互热度，通过异构数据聚合算法，直观呈现非遗技艺流派与传承人之间的谱系关联。",
                        "数据一致性与并发安全：独立设计点赞/收藏“状态切换”逻辑并引入行为记录表，结合 Spring 事务确保交互行为与统计数据的强一致性，采用 SQL 原子操作规避并发更新丢失风险并实现计数值非负校验。",
                        "组件调优与 UI 适配：针对 WebGL 组件利用 Vue3 生命周期管理与 Key 机制解决框架缓存导致的渲染死循环及白屏问题，并采用视口锁定与滚动隔离方案，彻底消除了复杂 3D 页面在后台容器中的布局晃动感。"
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

// ... existing algo, courses ...
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
