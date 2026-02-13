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
        title: "TECHNICAL_STACK // 技术矩阵",
        status: "ACTIVE",
        modules: {
            java: {
                name: "Java 核心",
                desc: "熟练使用 Java 语言与集合框架，熟悉 ThreadLocal 线程隔离应用，了解 JVM 内存模型与 GC 机制。具备多线程开发与并发处理基础。",
                items: [
                    {name: "Java SE", tags: ["集合框架", "ThreadLocal", "反射"]},
                    {name: "JVM", tags: ["JMM", "GC 机制", "内存布局"]},
                    {name: "Framework", tags: ["Spring Boot", "IoC/AOP", "Bean 生命周期"]}
                ]
            },
            cloud: {
                name: "微服务治理",
                desc: "熟悉 Spring Cloud Alibaba 生态中 Nacos、Sentinel、OpenFeign 组件的基础使用；了解 Gateway 网关架\n" +
                    "构及 Netty 响应式编程模型。",
                items: [
                    {name: "Microservices", tags: ["Nacos", "Sentinel", "Feign 拦截器"]},
                    {name: "Gateway", tags: ["动态路由", "身份闭环", "限流响应"]},
                    {name: "Network", tags: ["Netty", "响应式编程", "高性能 IO"]}
                ]
            },
            data: {
                name: "数据中间件",
                desc: "熟练使用 MySQL 索引优化与 MVCC 锁机制。熟悉 Redis 缓存策略（Cache Aside）及一致性方案；具备 RabbitMQ 异步解耦与削峰填谷实践经验。",
                items: [
                    {name: "MySQL", tags: ["索引优化", "事务隔离", "MVCC"]},
                    {name: "Redis", tags: ["双重检查锁", "原子计数", "批量持久化"]},
                    {name: "RabbitMQ", tags: ["异步解耦", "削峰填谷", "流量平滑"]}
                ]
            },
            frontend: {
                name: "全栈与工程化",
                desc: "熟悉 Vue3 + Element Plus 开发与组件化经验。具备前后端联调、CORS 跨域处理能力；了解 WebGL 3D 展陈集成与数据可视化看板开发。",
                items: [
                    {name: "Vue 生态", tags: ["Vue 3", "组合式 API", "Element Plus"]},
                    {name: "Engineering", tags: ["CORS 跨域", "全栈联调", "组件化"]},
                    {name: "Visualization", tags: ["WebGL", "数据看板", "3D 展示"]}
                ]
            },
            performance: {
                name: "调优实战",
                desc: "具备全链路性能诊断能力。通过 RabbitMQ 异步解耦使系统吞吐量提升约 12 倍；利用 HashMap 索引重构递归逻辑，将算法复杂度从 O(n²) 降为 O(n)。",
                items: [
                    {name: "Optimization", tags: ["JMeter 压测", "异步日志", "吞吐量提升"]},
                    {name: "Algorithms", tags: ["递归重构", "空间换时间", "逻辑降维"]},
                    {name: "Security", tags: ["防重放过滤", "Lua 脚本", "全链路追踪"]}
                ]
            }
        }
    },

    projects: {
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
                description: "基于Unity3D开发的互动游戏，通过驾驶小车探索我的学习历程（敬请期待😊）"
            }
        ],
        title: '学习经历',
        subtitle: '从 Hello World 到 Hello Bug',
        viewDetails: '查看详情'
    },

    gallery: {
        title: '作品展示',
        subtitle: '核心功能模块截图，记录系统关键逻辑的实现与运行状态。',
        viewDetail: '查看详情',
        items: {
            work0: { title: '数据驾驶舱', desc: '非遗平台可视化看板，采用双重检查锁优化复杂聚合查询，消除缓存击穿隐患。' },
            work1: { title: '数字化展厅', desc: '基于 Vue3 实现的非遗资产展示界面，支持 3D 沉浸式交互与响应式布局。' },
            work2: { title: '传承关系图谱', desc: '利用 HashMap 索引重构递归逻辑，将多级分类树的查询复杂度从 O(n²) 降维至 O(n)。' },
            work3: { title: '展品详情页', desc: '实施动静分离策略，结合长效缓存与状态实时聚合，大幅降低系统 IO 开销。' },
            work4: { title: '网关管理控制台', desc: '统一接入网关的可视化管理端，集成全链路鉴权与服务运行状态监控。' },
            work5: { title: '网关系统架构', desc: '基于 Spring Cloud Gateway 设计，涵盖动态路由、安全防御与异步日志的完整架构。' },
            work6: { title: '动态路由配置', desc: '基于 Nacos Config 监听机制实现零停机路由刷新，修改规则无需重启网关。' },
            work7: { title: '流量防卫监控', desc: '深度集成 Sentinel 实现 QPS 流控与熔断降级，通过 Nacos 实现规则持久化。' },
            work8: { title: '安全防御配置', desc: '基于 Redis + Lua 设计防重放过滤器，利用 Nonce 与时间戳机制拦截重复请求。' },
            work9: { title: '操作审计日志', desc: '记录网关层接入的所有请求明细，提供全链路追踪与管理后台审计功能。' },
            work10: { title: '异步日志削峰', desc: '基于 RabbitMQ 实现日志解耦，高延迟环境下使系统吞吐量由 89 提升至 1100+ QPS。' },
            work11: { title: '3D 场景渲染', desc: 'WebGL 渲染练习，探索 3D 模型在数字化展陈平台中的光影效果与交互性能。' }
        }
    },

    stuffs: {
        back: '返回',
        building: '建设中...',
        developing: '该页面还在开发中，敬请期待！...',
    },

    resume: {
        "education": {
            "title": "教育背景",
            "items": [
                "西南民族大学 - 本科 - 软件工程（2022.09 - 2026.07）",
                "GPA 3.47/4.0 (专业排名前 20%)",
                "连续两年获得校级奖学金 (2023-2025)",
                "英语水平 CET-6"
            ]
        },

        "skills": {
            "title": "专业技能",
            "categories": [
                {
                    "name": "Java 核心",
                    "items": [
                        "熟练使用 Java 语言与集合框架，熟悉 ThreadLocal 线程隔离应用，了解 JVM 内存模型与 GC 机制"
                    ]
                },
                {
                    "name": "服务端框架",
                    "items": [
                        "熟练使用 Spring Boot / Spring MVC 进行后端开发，理解 IoC、AOP 原理及 Bean 生命周期"
                    ]
                },
                {
                    "name": "微服务架构",
                    "items": [
                        "熟悉 Spring Cloud Alibaba 生态中 Nacos、Sentinel、OpenFeign 组件的基础使用；了解 Gateway 网关架\n" +
                        "构及 Netty 响应式编程模型"
                    ]
                },
                {
                    "name": "数据库与缓存",
                    "items": [
                        "熟练使用 MySQL，熟悉 SQL 编写及索引优化，理解事务隔离级别与 MVCC/锁机制",
                        "熟悉 Redis 核心数据结构及应用场景，掌握缓存穿透/击穿/雪崩的解决方案及双写一致性策略"
                    ]
                },
                {
                    "name": "前端技术",
                    "items": [
                        "熟悉 Vue3 + Element Plus 开发，具备前后端联调、CORS 跨域处理及组件化开发经验"
                    ]
                }
            ]
        },

        "projects": {
            "title": "项目经历",
            "stackLabel": "技术栈",
            "contributionsLabel": "主要工作",
            "items": [
                {
                    "title": "微服务流量治理与统一接入网关平台 (2025.12 - 至今)",
                    "description": "自主研发的微服务网关平台，深度整合了全链路鉴权、动态路由、流量治理、安全防御、异步日志及可视化配置与监控，构建了安全可观测的流量入口。",
                    "stack": "Spring Boot、Spring Cloud Gateway、Spring Cloud Alibaba (Nacos, Sentinel)、Redis、Vue3",
                    "contributions": [
                        "数据采集与监控：开发 Metrics 埋点过滤器，基于 WebFlux 异步流无侵入采集 QPS、RT 等指标；利用 Redis 原子递增与时间窗口算法聚合数据，结合 ECharts 绘制实时流量波形与微服务拓扑，实现流量可视化监控。",
                        "全链路身份透传：设计基于 ThreadLocal + Feign 拦截器 的透传方案，解决异步调用 Token 丢失问题；在网关层注入 Header，配合用户上下文与内部拦截器实现令牌中继，确保用户 ID 在全链路的无缝传递。",
                        "规则配置与管理：基于 NacosConfigManager 开发一站式控制台，实现路由与 Sentinel 流控规则的在线热更；自定义加载器监听 Config 变更并实时刷新网关路由表，解决了原生配置繁琐痛点，达成规则修改零停机、秒级生效。",
                        "安全防御与文档：基于 Redis + Lua 设计防重放过滤器，利用 Nonce 随机串 + 时间戳机制拦截重复请求；引入 Knife4j 在网关层聚合所有服务的 Swagger 文档，实现单一入口调试。",
                        "异步日志与压测：基于 RabbitMQ 实现日志异步解耦；经 JMeter 压测，在模拟 50ms 写库延迟下，系统吞吐量由 89 QPS 飙升至 1100+ QPS（提升约 12 倍），且在全链路拦截模式下仍保持了直连服务 66% 的高性能水准。"
                    ]
                },
                {
                    "title": "非遗虚拟展陈与数据监测平台 (2024.09 - 2025.01)",
                    "description": "针对非遗文化保护痛点设计的数字化平台，实现了非遗 3D 展示、UGC 社区互动与传承系谱图等功能；系统通过数字驾驶舱实时监测全站资产交互热度，实现非遗资源从云端采集到跨模态交互的全链路闭环。",
                    "stack": "Spring Boot、Vue3、WebGL、MyBatis、Redis、MySQL",
                    "contributions": [
                        "全链路业务闭环：构建前台沉浸式门户+后台精细化管理双端体系，完成非遗资产全生命周期(UGC)治理从 DB 到 Vue3 的全链路开发，实现了资产从用户侧采集到管理侧管控的深度闭环。",
                        "谱系建模与算法优化：基于 ECharts 实现传承系谱图，直观呈现技艺流派与传承人间的谱系拓扑关联；针对其多级分类树性能瓶颈，利用 HashMap 重构递归逻辑，将时间复杂度从 O(n²) 降维至 O(n)。",
                        "写入优化与一致保障：针对高频热点写场景，设计写缓冲架构 ，利用 Redis 原子计数暂存流量，结合 Quartz 实现数据的异步批量持久化，规避数据库行锁竞争，显著提升写入吞吐量；对数据驾驶舱中的复杂聚合查询实施 Cache Aside 模式与双重检查锁机制，消除缓存击穿隐患，解决并发场景下的数据一致性难题。",
                        "链路调优与性能压测：通过优化算法与缓存，完成链路性能诊断与调优，经 JMeter 压测验证，在同等并发规模下，核心接口 QPS 提升约 7 倍（峰值 990+），成功实现首屏加载从秒级到毫秒级的性能跨越。"
                    ]
                },
                {
                    "title": "Resume Adventure（个人网站）",
                    "description": "基于 Spring Boot + Vue3 独自设计的个人网站，通过 AI 辅助编程高效完成核心模块开发。",
                    "stack": "Spring Boot, Vue3, Three.js, Reveal.js",
                    "contributions": [
                        "调用腾讯云大模型知识引擎 API，基于个人知识库实现智能问答功能。",
                        "整合 Three.js 技术，实现项目展示区 3D 交互效果。",
                        "基于 Reveal.js 开发在线演示模块，将个人项目经历转化为交互式 PPT 展示。",
                        "设计开发简洁美观的个人信息展示页面，清晰呈现学习经历、技能与项目成果。"
                    ],
                    "highlight": "项目特点：独立全栈开发项目，实践AI辅助编程工作流，探索前沿技术在实际项目中的应用。"
                }
            ]
        },

        "algo": {
            "title": "算法能力",
            "items": [
                "力扣刷题 300+ 道，覆盖动态规划、回溯、贪心算法等，享受代码 AC 的过程",
                "熟悉常见算法复杂度分析与优化方法",
                "能够针对实际问题选择合适的算法解决方案"
            ]
        },

        "courses": {
            "title": "专业课程",
            "items": [
                "计算机基础：数据结构、算法分析与设计、计算机组成原理、计算机网络、操作系统",
                "开发技术：JavaEE、Web 前端开发、数据库概论",
                "人工智能：机器学习基础、PyTorch 实践课程"
            ]
        },

        "selfLearning": {
            "title": "自我评价",
            "items": [
                "愿意持续学习，记录学习经历及收获（GitHub 仓库）",
                "对新兴技术有浓厚兴趣，善于将想法落地实现（个人博客）"
            ]
        },

        "softSkills": {
            "title": "软技能",
            "items": [
                "拥有实验室项目合作经验，沟通主动，能快速融入团队并配合团队成员完成开发任务"
            ]
        }
    },

    footer: {
        appName: '开发者空间',
        tagline: '让编码创造更多可能',
        techTitle: '本网站由以下技术驱动',
        copyEmail: '复制邮箱',
        emailCopied: '已复制!',
        copyright: '© {year} 开发者空间. 保留所有权利.',
        madeWith: 'RCPAWN 用热爱和代码精心制作',
        socialLinks: [
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
            {url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
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
                title: "资源",
                links: [
                    {text: "文档", url: "/coming-soon"},
                    {text: "教程", url: "/coming-soon"},
                    {text: "源码", url: "/coming-soon"}
                ]
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
