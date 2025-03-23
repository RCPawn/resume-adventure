// data/i18n/cn.js
// 中文语言包
import '@/assets/leetcodeIcon.css';

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
        title: '专业技能',
        skillTarget: '目标水平',
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
            title: "专业技能",
            categories: [
                {
                    name: "编程语言",
                    items: [
                        "Java：熟悉面向对象开发，理解集合框架与异常处理机制",
                        "Python：能使用Pandas进行数据处理，了解机器学习基础"
                    ]
                },
                {
                    name: "Web开发",
                    items: [
                        "后端：使用SpringBoot开发REST API，配合MyBatis操作MySQL",
                        "前端：基于Vue3+Element UI实现组件化开发",
                        "数据库：掌握关系型数据库设计，能编写联表查询与索引优化"
                    ]
                },
                {
                    name: "版本控制与协作",
                    items: [
                        "熟练使用Git进行日常开发，了解feature分支工作流与协作流程",
                        "使用GitHub托管项目代码，积极参与开源项目讨论"
                    ]
                },
                {
                    name: "3D与游戏开发",
                    items: [
                        "Blender：能够创建简单3D模型与材质，了解基础动画制作流程",
                        "Unity：掌握基本游戏场景搭建，使用C#脚本实现游戏逻辑"
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
                    title: "榄人千里眼 - 油橄榄园区一体化平台（实验室合作项目）",
                    stack: "SpringBoot, Vue3, MySQL, Redis",
                    contributions: [
                        "参与需求分析与设计文档编写（完成3+模块的API设计说明）",
                        "协助开发数据可视化看板：基于ECharts实现园区资产分类统计"
                    ],
                    highlight: "项目收获：学习大型项目协作规范与文档编写标准"
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
                "力扣刷题300+道，覆盖数据结构、动态规划、回溯、贪心算法等",
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
                "结合AI工具(如ChatGPT、Grok、Claude)进行开发，提高效率",
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
        title: '画廊',
        subtitle: '以下是我作品的一些视觉效果',
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
                    { text: '全栈应用', url: '/olive-ppt' },
                    { text: '游戏开发', url: '/game' },
                    { text: 'AI 实验室', url: '/coming-soon' }
                ]
            },
            {
                title: "资源",
                links: [
                    { text: "文档", url: "/coming-soon" },
                    { text: "教程", url: "/coming-soon" },
                    { text: "源码", url: "/coming-soon" }
                ],
            },
            {
                title: '关于',
                links: [
                    { text: '个人简介', url: '/coming-soon' },
                    { text: '联系', url: '/coming-soon' },
                    { text: '博客', url: '/coming-soon' }
                ]
            }
        ]
    }
}
