// data/i18n/en.js
// 英文语言包
import '@/assets/styles/leetcodeIcon.css';

export default {
    nav: {
        logo: 'RCPAWN',
        home: 'Home',
        skill: 'Skills',
        experience: 'Experience',
        gallery: 'Gallery',
        resume: 'Resume',
        footer: 'About'
    },
    title: 'HEY, I AM RCPAWN',
    subtitle: 'A SOFTWARE ENGINEERING STUDENT',
    professions: [
        '☕ Java Backend Developer',
        '☁️ Microservice Architecture Explorer',
        '🎨 Enthusiast of 3D & Interactive Design'
    ],
    skills: {
        title: 'Skills & Map',
        subtitle: 'The % are for reference only',
        skillTarget: 'Skill Target',
        current: 'Current Level',
        target: 'Target Level',
        items: [
            {
                name: 'BackendDev',
                icon: 'fas fa-laptop-code',
                level: 60,
                target: 85
            },
            {
                name: 'Database Design',
                icon: 'fas fa-database',
                level: 50,
                target: 75
            },
            {
                name: 'Algorithms',
                icon: 'fas fa-code',
                level: 55,
                target: 80
            },
            {
                name: 'AI & Machine Learning',
                icon: 'fas fa-brain',
                level: 20,
                target: 70
            },
            {
                name: 'Game & 3D Dev',
                icon: 'fas fa-gamepad',
                level: 30,
                target: 60
            },
            {
                name: 'Version Control',
                icon: 'fab fa-github',
                level: 60,
                target: 80
            }
        ]
    },
    projects: {
        items: [
            {
                name: "Olive Guardian",
                description: "Integrated olive grove management platform combining data visualization, WebGIS and blockchain technologies for comprehensive asset management"
            },
            {
                name: "Algorithm",
                description: "Stay tuned😊"
            },
            {
                name: "GitHub Project",
                description: "Stay tuned😊"
            },
            {
                name: "Personal Gateway",
                description: "Stay tuned😊"
            },
            {
                name: "Weather App",
                description: "Stay tuned😊"
            },
            {
                name: "Resume Adventure",
                description: "Interactive game developed with Unity3D where players drive through a virtual world exploring my learning journey"
            },
            {
                name: "Donut 3D",
                description: "Created a 3D animated short film using Blender, demonstrating modeling, texturing, lighting and animation techniques"
            },
            {
                name: "Skill Target",
                description: "Constructed personal full-stack development plan encompassing frontend, backend, algorithms, deep learning and product design, continuously updated through iterative learning"
            }
        ],
        title: 'Learning Experience',
        subtitle: 'From hello world to hello bug',
        viewDetails: 'View Details'
    },


    stuffs: {
        back: 'Back',
        building: 'Building...',
        developing: 'This page is still under development, please stay tuned! ...',
    },

    resume: {
        education: {
            title: "Education",
            items: [
                "Software Engineering (2022.09 - 2026.07)",
                "GPA 3.47/4.0 (Top 20% in Major)",
                "University-Level Scholarship Recipient (Consecutive years 2023-2025)",
                "English Proficiency: CET-6"
            ]
        },

// ... existing education ...

        skills: {
            title: "Professional Skills",
            categories: [
                {
                    name: "Java Core",
                    items: [
                        "Proficient in Java language and Collection Framework; Familiar with ThreadLocal thread isolation applications; Understanding of JVM memory model and GC mechanisms."
                    ]
                },
                {
                    name: "Microservices Architecture",
                    items: [
                        "Familiar with Spring Cloud Alibaba ecosystem; Mastered core components like Nacos, Sentinel, and OpenFeign for service governance.",
                        "Mastered Spring Cloud Gateway architecture; Understanding of Netty + WebFlux reactive model and Filter chain mechanisms."
                    ]
                },
                {
                    name: "Server-side Frameworks",
                    items: [
                        "Proficient in Spring Boot / Spring MVC for backend development; Understanding of IoC, AOP principles, and Bean lifecycle."
                    ]
                },
                {
                    name: "Database & Caching",
                    items: [
                        "Proficient in MySQL and SQL writing; Familiar with index optimization; Understanding of transaction isolation levels and MVCC/Locking mechanisms.",
                        "Familiar with Redis core data structures and scenarios; Mastered solutions for Cache Penetration/Breakdown/Avalanche and double-write consistency strategies."
                    ]
                },
                {
                    name: "Frontend Technologies",
                    items: [
                        "Familiar with Vue3 + Element Plus development; Experienced in frontend-backend integration, CORS handling, and component-based development."
                    ]
                }
            ]
        },

        projects: {
            title: "Project Experience",
            stackLabel: "Tech Stack",
            contributionsLabel: "Key Contributions",
            items: [
                {
                    title: "Microservice Traffic Governance & Unified Gateway Platform (2025.12 - Present)",
                    description: "Independently developed a unified microservice traffic governance platform integrating dynamic route hot-updates, full-link identity security loop, Sentinel high-availability protection, and SkyWalking tracing. Developed a matching Vue3 visual operations console. Achieved zero-downtime dynamic management of routing rules and real-time service health monitoring via Nacos and Actuator, building a secure and observable traffic entrance.",
                    stack: "Spring Boot 3, Spring Cloud Alibaba (Nacos, Sentinel), Spring Cloud Gateway",
                    contributions: [
                        "Full-link Identity Loop: Addressed the token loss issue in inter-service calls by designing a pass-through scheme based on ThreadLocal + Feign Interceptors. Injected headers at the gateway layer and coordinated with internal interceptors to achieve token relay, ensuring seamless propagation of User ID and Token across the entire link.",
                        "Zero-Downtime Dynamic Routing: Abandoned static YAML configuration and developed a dynamic route loader based on the Nacos Config listening mechanism. It listens for configuration changes and calls the Gateway underlying API to refresh the routing table in real-time, achieving route rule modification without restarting the gateway.",
                        "Traffic Governance & Monitoring: Implemented QPS rate limiting and circuit breaking for core interfaces based on Sentinel, utilizing Nacos for rule persistence. Integrated SkyWalking probes for distributed full-link tracing, standardized rate-limiting responses via exception handling, and accurately pinpointed system bottlenecks.",
                        "Visual Management Platform: Independently built a Vue3 admin dashboard, configured global CORS, and integrated with Actuator endpoints to realize visual inspection of routing rules and monitoring of service health status."
                    ]
                },
                {
                    title: "Intangible Cultural Heritage Virtual Display & Data Monitoring Platform (2024.09 - 2025.01)",
                    description: "A digital twin platform designed for Intangible Cultural Heritage (ICH), realizing all-around 3D exhibit display, real-time dynamic statistics, and high-interaction discussions.",
                    stack: "Spring Boot, Vue3, WebGL, MyBatis, MySQL",
                    contributions: [
                        "Business Loop & Full-Stack Modeling: Independently completed full-link system development. Designed and implemented the UGC publishing system. Refactored the classification model into a hierarchical structure, utilizing recursive algorithms and cascaded selectors to achieve precise management and data aggregation of complex ICH project genealogies.",
                        "Digital Dashboard: Built a digital cockpit integrating WebGL and ECharts to analyze resource distribution and interaction heat in real-time. Used heterogeneous data aggregation algorithms to intuitively present the lineage connections between ICH schools and inheritors.",
                        "Data Consistency & Concurrency Safety: Independently designed the Like/Collect 'state toggle' logic and introduced user action logs. Combined with Spring Transactions (@Transactional) to ensure strong consistency between interaction behaviors and statistical data. Adopted SQL atomic operations to avoid concurrent update data loss and implemented non-negative validation for counters.",
                        "Component Tuning & UI Adaptation: Resolved infinite rendering loops and white screen issues caused by framework caching in WebGL components by utilizing Vue3 Lifecycle management and the Key mechanism. Adopted viewport locking and scroll isolation schemes to completely eliminate layout jitter of complex 3D pages in backend containers."
                    ]
                },
                {
                    title: "Resume Adventure (Personal Website)",
                    description: "A personal website independently designed based on SpringBoot + Vue3, efficiently completing core module development via AI-assisted programming (Claude/ChatGPT).",
                    stack: "SpringBoot, Vue3",
                    contributions: [
                        "Integrated Tencent Cloud LLM Knowledge Engine API to implement intelligent Q&A based on personal knowledge base.",
                        "Integrated Three.js technology to achieve 3D interactive effects in the project showcase area.",
                        "Developed an online presentation module based on Reveal.js, transforming project experiences into interactive PPTs.",
                        "Designed and developed a clean and aesthetic personal information display page to clearly present learning experiences, skills, and project results."
                    ],
                    highlight: "Highlights: Independent full-stack development, practiced AI-assisted programming workflow, and explored the application of cutting-edge technologies in actual projects."
                }
            ]
        },

// ... existing algo, courses ...
        algo: {
            title: "Algorithm Skills",
            items: [
                "Solved over 300 LeetCode problems covering dynamic programming, backtracking, greedy algorithms, etc., enjoying the process of achieving code acceptance.",
                "Familiar with common algorithm complexity analysis and optimization methods.",
                "Capable of selecting appropriate algorithmic solutions for real-world problems."
            ]
        },
        courses: {
            title: "Professional Courses",
            items: [
                "Computer Fundamentals: Data Structures, Algorithm Analysis and Design, Computer Organization, Computer Networks, Operating Systems",
                "Development Technologies: JavaEE, Web Frontend Development, Database Fundamentals",
                "Artificial Intelligence: Machine Learning Basics, PyTorch Practical Course"
            ]
        },
        selfLearning: {
            title: "Self-Evaluation",
            items: [
                "Willing to learn continuously, recording learning experiences and gains (GitHub).",
                "Strong interest in emerging technologies, skilled in implementing ideas into reality (Personal Blog)."
            ]
        },
        softSkills: {
            title: "Soft Skills",
            items: [
                "Possess experience in lab project collaboration, proactive in communication, able to quickly integrate into teams and cooperate with members to complete development tasks."
            ]
        }
    },


    gallery: {
        title: 'Portfolio',
        subtitle: 'Screenshots as a souvenir, proving that I once made it through',
    },


    footer: {
        appName: 'Dev Space',
        tagline: 'Where code meets creativity',
        copyright: '© {year} Dev Space. All rights reserved.',
        madeWith: 'Made with passion & code',
        socialLinks: [
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
            {url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok'},
            {url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
        ],
        linkGroups: [
            {
                title: 'Projects',
                links: [
                    {text: 'Full Stack Apps', url: '/olive-ppt'},
                    {text: '3D Model', url: '/model'},
                    {text: 'AI Lab', url: 'https://github.com/RCPawn/ai-generate-prompt-words/blob/main/README.md'}
                ]
            },
            {
                title: "Resources",
                links: [
                    {text: "Documentation", url: "/coming-soon"},
                    {text: "Tutorials", url: "/coming-soon"},
                    {text: "Blog", url: "/coming-soon"}
                ],
            },
            {
                title: 'About',
                links: [
                    {text: 'Bio', url: 'https://github.com/RCPawn'},
                    {text: 'Contact', url: '/coming-soon'},
                    {text: 'Blog', url: 'https://github.com/RCPawn'}
                ]
            }
        ]
    }
}
