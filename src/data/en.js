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
        'Backend Developer',
        'Deep Learning Enthusiast',
        'Passionate About 3D and Interactive Design'
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
                name: "Deep Learning",
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

        skills: {
            title: "Professional Skills",
            categories: [
                {
                    name: "Programming Languages",
                    items: [
                        "Proficient in Java core syntax, Collection Framework, and Object-Oriented Design; familiar with Reflection and Exception Handling mechanisms."
                    ]
                },
                {
                    name: "Data Storage",
                    items: [
                        "Proficient in MyBatis, capable of writing SQL for business needs; understand Index Optimization, Transaction Isolation Levels, and Locking mechanisms.",
                        "Proficient in MySQL; familiar with Redis caching applications, understanding its common data structures, persistence, and cache consistency strategies."
                    ]
                },
                {
                    name: "Server-side Frameworks",
                    items: [
                        "Proficient in Spring Boot / Spring MVC; understand IoC, AOP, and Bean Lifecycle."
                    ]
                },
                {
                    name: "Frontend & Visualization",
                    items: [
                        "Familiar with Vue3 framework; understand WebGL (model-viewer) rendering principles; experienced in coupling 3D models with backend data."
                    ]
                },
                {
                    name: "System Design",
                    items: [
                        "Familiar with common design patterns such as Singleton, Factory, Template Method, Chain of Responsibility, and Strategy patterns.",
                        "Understand JVM fundamentals, including Heap/Stack memory layout, Garbage Collection concepts, and the basic Class Loading process."
                    ]
                },
                {
                    name: "Communication Protocols",
                    items: [
                        "Understand WebSocket protocol, capable of implementing real-time message pushing between server and client."
                    ]
                },
                {
                    name: "Engineering Tools",
                    items: [
                        "Proficient in core development tools like IDEA / Git / Maven; possess good habits for Markdown documentation."
                    ]
                }
            ]
        },
        projects: {
            title: "Projects",
            stackLabel: "Tech Stack",
            contributionsLabel: "Key Contributions",
            items: [
                {
                    title: "Design and Implementation of Non-Heritage Digital Exhibition Hall based on SpringBoot & WebGL (2025.12 - Present)",
                    description: "A digital twin platform designed for intangible cultural heritage, realizing comprehensive 3D product display, real-time dynamic statistics, and high-interaction discussions. Core technologies include Spring Boot, Vue3, WebGL, MyBatis, and MySQL.",
                    stack: "Spring Boot, Vue3, WebGL, MyBatis, MySQL",
                    contributions: [
                        "Completed end-to-end system development based on mature frameworks; refactored high-fidelity interaction layouts referencing Dewu (Poison) App design specs, solving technical challenges in 3D artifact upload, storage, and web-side rendering, achieving a technical closed loop from data modeling to terminal display.",
                        "Designed and implemented Logic for Like/Collection status toggling; introduced 'user_action' table combined with Spring Transactions (@Transactional) to ensure strong consistency between 'user activity records' and 'statistical fields', supporting state persistence.",
                        "Adopted Atomic Operations and CASE WHEN logic for SQL updates, effectively avoiding concurrent data pollution under high-frequency clicks and realizing 'non-negative' verification for statistical values, enhancing system robustness.",
                        "Addressed rendering loops and white screen issues caused by framework caching in the WebGL component <model-viewer>; utilized Vue3 Lifecycle Management and Key Mechanism to force component re-rendering, significantly improving 3D model loading stability and switching smoothness."
                    ]
                },
                {
                    title: "Olive Vision - 10,000-Acre Olive Forest Asset Visual Intelligent Control Platform (2024.09 - 2025.03)",
                    description: "A lab-enterprise collaboration project. An agricultural asset digitalization management platform covering 12 zones and 1000+ devices. Provides full lifecycle management functions including asset entry, cross-zone transfer, scan-to-repair, and work order dispatch. Solves traditional problems like difficult counting, chaotic ledgers, and inefficient cross-zone coordination. Expected to reduce enterprise O&M costs by 30%+ upon launch.",
                    stack: "Spring Boot, MySQL, Redis, MyBatis",
                    contributions: [
                        "Introduced State Machine Design Pattern to drive full asset lifecycle management (Entry, Transfer, Repair, Scrap), improving asset ledger accuracy and utilization rates.",
                        "Utilized Redis to cache high-frequency access data regarding device location and running status, significantly reducing database pressure during large map rendering in forest areas.",
                        "Built a work order dispatch module based on WebSocket; introduced Priority Queues and Overtime Alarm Mechanisms to ensure emergency tasks are prioritized, triggering hierarchical alerts if unprocessed for over 30 minutes.",
                        "Combined AOP + Custom Annotations to build a permission interception and operation audit system, ensuring compliance of sensitive operations at the technical level."
                    ],
                    highlight: "Key Takeaways: Mastered enterprise full-stack development processes, enhanced engineering implementation capabilities with SpringBoot integration, improved communication and documentation skills through cross-role collaboration."
                },
                {
                    title: "Campus Second-hand Trading Platform (2023.09 - 2023.11)",
                    description: "A Software Engineering course group project supporting user registration/login, item posting, browsing, and simple trading functions. Aimed at mastering frontend-backend collaboration processes through practice.",
                    stack: "Spring Boot, Vue3, MySQL, MyBatis",
                    contributions: [
                        "Self-taught relevant knowledge to complete basic environment setup and database connection, implementing login and registration functions.",
                        "Developed the item management module supporting multi-condition queries (e.g., category, price range) and integrated PageHelper for pagination.",
                        "Managed branches via Git (Sourcetree), established team code submission standards, and resolved branch merge conflicts multiple times.",
                        "As the team lead, assigned tasks and tracked progress using online collaboration platforms to ensure on-time project delivery."
                    ]
                },
                {
                    title: "Resume Adventure (Personal Website)",
                    description: "Independently designed personal website using SpringBoot+Vue3, with core modules developed efficiently through AI-assisted programming (Claude/ChatGPT).",
                    stack: "SpringBoot, Vue3",
                    contributions: [
                        "Integrated Tencent Cloud's AI knowledge engine API to implement intelligent Q&A based on personal knowledge base.",
                        "Incorporated Three.js technology to create 3D interactive effects in project showcase area.",
                        "Developed online presentation module using Reveal.js to transform project experience into interactive slides.",
                        "Designed and developed clean, aesthetic personal information display pages showcasing education, skills and project achievements."
                    ],
                    highlight: "Project Highlights: Independent full-stack development project, practiced AI-assisted programming workflow, explored cutting-edge technology applications in real projects."
                }
            ]
        },
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
