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
        footer: '页脚'
    },
    title: '嘿，我是过河卒',
    subtitle: '一名软件工程专业的学生',
    professions: [
        '全栈开发者',
        '深度学习爱好者',
        '热衷于3D和互动设计'
    ],
    skills: {
        title: '技能专长',
        subtitle: '从技术栈到实践应用，记录我的成长历程',
        skillTarget: '技能目标',
        current: '当前水平',
        target: '目标水平',
        items: [
            {
                name: '全栈开发',
                desc: '熟练掌握Spring、Vue等技术栈，具备从前端到后端的开发能力，能够独立完成完整的系统开发工作。',
                icon: 'fas fa-laptop-code',
                level: 60,
                target: 85
            },
            {
                name: '数据库设计',
                desc: '熟练使用MySQL数据库，能够编写常用SQL查询，具备数据库结构设计与优化的基础能力。',
                icon: 'fas fa-database',
                level: 50,
                target: 75
            },
            {
                name: '算法与数据结构',
                desc: '在力扣平台完成300+道题目，涵盖数据结构、动态规划、回溯、贪心算法等，能够根据实际问题选用合适的算法进行优化。',
                icon: 'fas fa-code',
                level: 55,
                target: 80
            },
            {
                name: '人工智能与机器学习',
                desc: '具备Python编程基础，并对机器学习和深度学习有初步了解，持续进行学习与实践。',
                icon: 'fas fa-brain',
                level: 20,
                target: 70
            },
            {
                name: '游戏与3D开发',
                desc: '掌握Unity游戏引擎和Blender 3D建模基础技能，能够创建简单的3D模型和游戏资源。',
                icon: 'fas fa-gamepad',
                level: 30,
                target: 60
            },
            {
                name: '版本控制与协作',
                desc: '熟悉Git工作流程，能够高效进行团队协作开发，积极参与开源项目。',
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
                name: "算法刷题",
                description: "系统性解决300+算法题，涵盖数据结构、动态规划、回溯、贪心算法等"
            },
            {
                name: "GitHub项目管理",
                description: "使用GitHub托管个人项目代码，积极探索开源资源，培养版本控制能力与技术视野"
            },
            {
                name: "深度学习入门",
                description: "通过YouTube等平台自学深度学习相关知识，实践简单图像识别模型，对AI前沿技术的学习充满热情"
            },
            {
                name: "简历冒险",
                description: "基于Unity3D开发的互动游戏，通过驾驶小车探索我的学习历程"
            },
            {
                name: "甜甜圈",
                description: "使用Blender学习创作的3D动画短片，展示建模、材质、光照与动画技术"
            },
            {
                name: "技能目标",
                description: "构建个人全栈发展规划，涵盖前后端、算法、深度学习与产品设计等多领域技能体系，持续迭代更新"
            }
        ],
        title: '学习经历',
        subtitle: '从技能到实践，记录我的成长之路',
        viewDetails: '查看详情'
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
                "软件工程专业，大三在读",
                "GPA 3.42/4.0 (专业前20%)",
                "校级优秀奖学金获得者",
                "英语水平：CET6，熟练阅读技术文档"
            ]
        },

        skills: {
            "title": "专业技能",
            "categories": [
                {
                    "name": "编程语言",
                    "items": [
                        "具备扎实的Java基础，熟练掌握字符串处理、集合框架、多线程编程及常见排序算法，了解集合框架的实现原理"
                    ]
                },
                {
                    "name": "存储层开发",
                    "items": [
                        "熟练使用MySQL进行数据存储与查询，了解索引（如B+树结构）和事务（ACID特性）的基本原理，能够编写高效的SQL语句解决常见业务需求",
                        "熟悉Redis的基础应用，掌握String/Hash数据结构及RDB持久化机制，了解缓存的基本优化策略"
                    ]
                },
                {
                    "name": "服务端框架",
                    "items": [
                        "掌握SpringBoot开发流程，熟悉IOC容器管理、AOP日志切面、MyBatis整合，能够独立开发RESTful API",
                        "熟悉Spring Security认证流程，能基于JWT实现Token鉴权并设计RBAC权限控制体系"
                    ]
                },
                {
                    "name": "分布式基础",
                    "items": [
                        "了解SpringCloud的基础概念，熟悉Nacos服务注册与OpenFeign远程调用的基本使用，理解其在微服务通信中的作用",
                        "了解HTTP/HTTPS协议和TCP三次握手机制，掌握WebSocket实时通信原理"
                    ]
                },
                {
                    "name": "工程化工具",
                    "items": [
                        "具备工程化开发能力，熟练使用Swagger生成接口文档，掌握Git分支管理、Maven多模块构建、Postman接口调试等工具和技术"
                    ]
                }
            ]
        },
        projects: {
            title: "项目经验",
            stackLabel: "技术栈",
            contributionsLabel: "个人贡献",
            items: [
                {
                    title: "榄人千里眼-万亩油橄榄林区资产可视智能管控平台",
                    stack: "SpringBoot、Vue3、MySQL、Redis",
                    contributions: [
                        "基于SpringBoot框架开发设备管理接口，采用MyBatis-Plus动态SQL处理多条件组合查询，集成PageHelper分页插件优化设备数据加载效率，并设计设备状态机（空闲、报修、报废）、维保流程等全生命周期管理功能",
                        "基于RBAC模型构建管理员、操作员等角色权限体系，通过Spring Security+JWT实现Token认证，设计过滤器拦截越权操作（如操作员访问管理员接口），返回401/403状态码保障接口安全",
                        "针对设备轨迹查询场景，在MySQL设计设备ID与时间戳的联合索引提升查询效率，结合Redis缓存高频访问的设备位置数据，降低数据库并发压力约20%",
                        "编写后端模块设计方案，使用Swagger生成标准化接口文档，绘制系统核心业务流程图与数据库ER图，推动团队开发规范统一"
                    ],
                    highlight: "项目收获：掌握企业级全栈开发流程，提升SpringBoot整合技术栈的工程化落地能力，通过跨角色协作（产品、前端）完成项目交付，强化沟通与文档输出能力。"
                },
                {
                    title: "苍穹外卖（黑马程序员课程实践）",
                    stack: "SpringBoot, MyBatis, Redis, Vue3",
                    contributions: [
                        "按课程指导实现订单状态机模块（状态模式）",
                        "练习Redis在购物车场景的应用（课程实验案例）",
                        "基于教学模板完成WebSocket消息通知功能"
                    ],
                    highlight: "课程延伸：使用Postman完成30+接口测试用例"
                },
                {
                    title: "大事件（黑马程序员课程实践）",
                    stack: "SpringBoot, Vue3, MySQL",
                    contributions: [
                        "课程实践：根据教学文档实现文章分类管理模块",
                        "应用课程知识完成响应式布局（Flexbox/Grid）",
                        "通过课程案例掌握JWT鉴权流程与Quill富文本集成"
                    ],
                    highlight: "课程收获：系统掌握SpringBoot+Vue3工程化开发流程，实践Git进行版本控制与团队协作"
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
            title: "自学能力",
            items: [
                "通过技术博客、YouTube、Bilibili等平台持续学习前沿技术",
                "结合AI工具(如ChatGPT、Grok、Claude)等优化开发工作流，提高效率",
                "关注技术社区动态，star优质项目并阅读源码，学习工程实践"
            ]
        },
        softSkills: {
            title: "软技能",
            items: [
                "团队协作：积极参与小组项目讨论，善于倾听与表达，有效与设计、产品等角色沟通",
                "时间管理：合理规划任务优先级，按时交付项目，保持学习与开发的平衡",
                "问题解决：遇到技术难题，能够查阅官方文档、分析源码，在Stack Overflow和GitHub issues中寻找解决方案"
            ]
        }
    },
    gallery: {
        title: '作品展示',
        subtitle: '用视觉记录我的创作历程，展示我的设计理念',
    },
    footer: {
        appName: '开发者空间',
        tagline: '让编码创造更多可能',
        copyright: '© {year} 开发者空间. 保留所有权利.',
        madeWith: '用热爱和代码精心制作',
        socialLinks: [
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
            {url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok'},
            {url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
        ],
        linkGroups: [
            {
                title: '项目',
                links: [
                    {text: '全栈应用', url: '/olive-ppt'},
                    {text: '游戏开发', url: '/game'},
                    {text: 'AI 实验室', url: '/coming-soon'}
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
                    {text: '简介', url: '/coming-soon'},
                    {text: '联系', url: '/coming-soon'},
                    {text: '博客', url: '/coming-soon'}
                ]
            }
        ]
    }
}
