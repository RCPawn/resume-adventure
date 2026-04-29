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
        title: "TECHNICAL_STACK // MATRIX",
        status: "ACTIVE",
        modules: {
            java: {
                name: "Java Core",
                desc: "Proficient in Java & Collections. Familiar with ThreadLocal and JVM memory model/GC mechanisms. Solid foundation in multi-threading.",
                items: [
                    { name: "Java SE", tags: ["Collections", "ThreadLocal", "Reflection"] },
                    { name: "JVM", tags: ["Memory Model", "GC", "Monitoring"] },
                    { name: "Framework", tags: ["Spring Boot", "IoC/AOP", "Bean Lifecycle"] }
                ]
            },
            cloud: {
                name: "Cloud Native",
                desc: "Familiar with Spring Cloud Alibaba (Nacos, Sentinel). Mastered Gateway architecture and Netty reactive programming for full-link identity relay.",
                items: [
                    { name: "Microservices", tags: ["Nacos", "Sentinel", "Feign"] },
                    { name: "Gateway", tags: ["Dynamic Route", "Token Relay", "Limit"] },
                    { name: "Network", tags: ["Netty", "Reactive", "High-perf IO"] }
                ]
            },
            data: {
                name: "Data & Middleware",
                desc: "Proficient in MySQL Indexing & MVCC. Familiar with Redis caching strategies and RabbitMQ for async decoupling and peak shaving.",
                items: [
                    { name: "MySQL", tags: ["Indexing", "Isolation", "MVCC"] },
                    { name: "Redis", tags: ["DCL Lock", "Atomic", "Cache Aside"] },
                    { name: "RabbitMQ", tags: ["Async", "Peak Shaving", "Reliability"] }
                ]
            },
            frontend: {
                name: "Full Stack",
                desc: "Familiar with Vue3 + Element Plus. Skilled in full-stack debugging, CORS, and componentization. Basic knowledge of WebGL and dashboards.",
                items: [
                    { name: "Vue Eco", tags: ["Vue 3", "Composition API", "Element Plus"] },
                    { name: "Engineering", tags: ["CORS", "Debugging", "Components"] },
                    { name: "Visualization", tags: ["WebGL", "Dashboard", "3D Display"] }
                ]
            },
            performance: {
                name: "Performance",
                desc: "Full-link diagnosis capability. Improved throughput by 12x via RabbitMQ; optimized algorithm from O(n²) to O(n) using HashMap indexing.",
                items: [
                    { name: "Optimization", tags: ["JMeter", "Async Log", "Throughput"] },
                    { name: "Algorithms", tags: ["Refactoring", "Logic", "HashMap Opt"] },
                    { name: "Security", tags: ["Replay Attack", "Lua", "Tracing"] }
                ]
            }
        }
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
        "education": {
            "title": "Education",
            "items": [
                "Southwest Minzu University - B.S. in Software Engineering (2022.09 - 2026.07)",
                "GPA: 3.47 / 4.00 (Ranked Top 20%)",
                "University-level Scholarship for two consecutive years (2023-2025)",
                "English Level: CET-6"
            ]
        },

        "skills": {
            "title": "Professional Skills",
            "categories": [
                {
                    "name": "Java Core",
                    "items": [
                        "Proficient in Java and Collections Framework; familiar with ThreadLocal for thread isolation; understood JVM memory models and GC mechanisms."
                    ]
                },
                {
                    "name": "Backend Frameworks",
                    "items": [
                        "Proficient in Spring Boot / Spring MVC; understood IoC, AOP principles, and Bean lifecycle."
                    ]
                },
                {
                    "name": "Microservices",
                    "items": [
                        "Familiar with Spring Cloud Alibaba (Nacos, Sentinel, OpenFeign); understood Gateway architecture and Netty reactive programming."
                    ]
                },
                {
                    "name": "Database & Caching",
                    "items": [
                        "Proficient in MySQL and SQL writing; experienced in index optimization and transaction isolation (MVCC/Locking).",
                        "Familiar with Redis data structures and application scenarios; mastered solutions for cache penetration/breakdown/avalanche and data consistency."
                    ]
                },
                {
                    "name": "Frontend",
                    "items": [
                        "Familiar with Vue3 + Element Plus; experienced in API integration, CORS handling, and component-based development."
                    ]
                }
            ]
        },

        "projects": {
            "title": "Project Experience",
            "stackLabel": "Tech Stack",
            "contributionsLabel": "Key Contributions",
            "items": [
                {
                    "title": "Microservices Traffic Governance & Gateway Platform (2025.12 - Present)",
                    "description": "A self-developed microservices gateway platform integrating authentication, dynamic routing, traffic governance, and security monitoring.",
                    "stack": "Spring Boot 3, Spring Cloud Alibaba (Nacos, Sentinel), Spring Cloud Gateway",
                    "contributions": [
                        "Full-link Identity: Designed a pass-through solution based on ThreadLocal + Feign interceptors to ensure seamless relay of User IDs and Tokens.",
                        "Dynamic Routing: Developed a routing loader based on Nacos Config to refresh routing tables in real-time via Gateway APIs without restarts.",
                        "Traffic Governance: Implemented QPS limiting and circuit breaking with Sentinel; integrated SkyWalking for distributed tracing.",
                        "Security & Docs: Designed anti-replay filters using Redis + Lua with Nonce and timestamp mechanisms; aggregated Swagger docs via Knife4j.",
                        "Async Logging: Used RabbitMQ for decoupling. JMeter tests showed throughput increased from 89 to 1100+ QPS (approx. 12x boost)."
                    ]
                },
                {
                    "title": "Intangible Cultural Heritage Digital Twin Platform (2024.09 - 2025.01)",
                    "description": "A digital twin platform designed for cultural heritage, featuring 3D exhibition, real-time statistics, and high-interaction community features.",
                    "stack": "Spring Boot, Vue3, WebGL, MyBatis, MySQL, Redis",
                    "contributions": [
                        "Full-stack Modeling: Independently developed the system and UGC publishing; refactored categorization using recursive algorithms for lineage management.",
                        "Architecture Optimization: Designed a write-buffer architecture using Redis atomic counters and Quartz for batch persistence to reduce DB row lock contention.",
                        "Caching & Consistency: Implemented static/dynamic separation; used Double-Checked Locking (DCL) for cache breakdown and Cache Aside for consistency.",
                        "Performance Tuning: Conducted full-link diagnostics; JMeter tests verified a 7x increase in core API QPS (peak 990+), achieving millisecond-level loading."
                    ]
                },
                {
                    "title": "Resume Adventure (Personal Website)",
                    "description": "An independently designed website based on Spring Boot + Vue3, utilizing AI-assisted programming to develop core modules efficiently.",
                    "stack": "Spring Boot, Vue3, Three.js, Reveal.js",
                    "contributions": [
                        "Implemented smart Q&A features using Tencent Cloud LLM API based on a personal knowledge base.",
                        "Integrated Three.js for 3D interactive effects in the project showcase area.",
                        "Developed online presentation modules with Reveal.js to transform project experiences into interactive PPTs.",
                        "Designed a clean UI to present education, skills, and project achievements clearly."
                    ]
                }
            ]
        },

        "algo": {
            "title": "Algorithm Skills",
            "items": [
                "Solved 300+ LeetCode problems, covering DP, Backtracking, and Greedy algorithms.",
                "Familiar with complexity analysis and optimization methods.",
                "Capable of selecting appropriate algorithmic solutions for practical problems."
            ]
        },

        "courses": {
            "title": "Core Courses",
            "items": [
                "CS Fundamentals: Data Structures, Algorithms, Computer Organization, Networking, Operating Systems",
                "Development: JavaEE, Web Development, Database Systems",
                "AI: Machine Learning Fundamentals, PyTorch Practice"
            ]
        },

        "selfLearning": {
            "title": "Self-Evaluation",
            "items": [
                "Willing to learn continuously and document the journey (GitHub repositories).",
                "Strong interest in emerging technologies and skilled at turning ideas into reality (Personal Blog)."
            ]
        },

        "softSkills": {
            "title": "Soft Skills",
            "items": [
                "Experienced in laboratory collaboration; proactive communicator who integrates quickly into teams."
            ]
        }
    },

    gallery: {
        title: 'Creative Gallery',
        subtitle: 'Snapshots of implemented modules and core system functionalities.',
        viewDetail: 'View Details',
        items: {
            // Row 1: Heritage Exhibition (order matches GallerySection screenshots)
            work0: { title: 'Digital Twin Dashboard', desc: 'Dark-theme twin dashboard: resource mix, category breakdown, interaction bars, word cloud, centered on the top exhibit 3D model.' },
            work1: { title: 'Immersive Portal Home', desc: 'Light hero with live KPIs for exhibits, views, and engagement; featured Sanheyuan digital twin on the right.' },
            work2: { title: 'Online Hall · Exhibit Detail', desc: 'Exhibit page for Sanheyuan: Three.js viewer, narrative sections, and threaded discussion panel.' },
            work3: { title: 'Paper Universe · Photo Column', desc: 'Masonry grid of heritage photo essays: tie-dye, architecture, wood carving, tea culture, and more.' },
            // Gateway Platform
            work4: { title: 'Gateway Console', desc: 'Admin interface for managing microservices gateway, including route forwarding and status monitoring.' },
            work5: { title: 'Traffic Defense Monitor', desc: 'Real-time visualization of QPS, concurrency, and error rates with threshold alerting.' },
            work6: { title: 'Route Matrix Config', desc: 'Module for dynamic route configuration, supporting environment-specific mapping and hot deployment.' },
            work7: { title: 'Audit Logs', desc: 'Operation auditing system featuring multi-criteria filtering, traceability, and data export.' },
            // More Highlights
            work8: { title: '3D Render Practice', desc: '3D scene rendering practice covering lighting, material textures, and geometric modeling.' },
            
            // Row 2: Additional Images
            work10: { title: 'Gateway Architecture', desc: 'Logical diagram illustrating the request lifecycle: interception, authentication, and routing.' },
            work11: { title: 'Security Policy Config', desc: 'Management of rate-limiting, whitelisting, and circuit-breaking policies to ensure system stability.' },
            work12: { title: 'Route Topology', desc: 'Service routing topology showing the complete request path from client through gateway to downstream services.' },
            work13: { title: 'Async Logging System', desc: 'Asynchronous log collection and storage module designed to minimize main thread latency.' },
            // Exhibition Extras
            work14: { title: 'Inheritance Graph', desc: 'Force-directed lineage graph for crafts: projects, sub-categories, and inheritor nodes with pan/zoom.' },
            work15: { title: 'Graph Cover Page', desc: 'Entry screen for the inheritance map: 3D book motif and CTA, subtitle Interwoven · Universe on Paper.' },
            work16: { title: 'Live Traffic Waveform', desc: 'ECharts dynamic rendering of gateway QPS, error rates, and response time curves for real-time health monitoring.' },
            work17: { title: 'Heritage Article View', desc: 'Long-form heritage story with image carousel, thumbnails, and caption overlay for tie-dye and similar topics.' },
        }
    },


    footer: {
        appName: 'Dev Space',
        tagline: 'Where code meets creativity',
        techTitle: 'Powering this site',
        copyEmail: 'Copy Email',
        emailCopied: 'Copied!',
        copyright: '© {year} Dev Space. All rights reserved.',
        madeWith: 'Designed & Built by rcpawn',
        stayInTouch: 'Stay in touch',
        statsSitePv: 'Total views',
        statsTodayUv: 'Visitors today',
        statsRunning: 'Online for',
        statsRunningUnit: 'days',
        statsPvFormat: '{n} views',
        statsUvFormat: '{n} visitors',
        statsGroupAria: 'Site statistics',
        socialLinks: [
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
            //{url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok'},
            //{url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
        ],
        linkGroups: [
            {
                title: 'Projects',
                links: [
                    {text: 'Heritage', url: '/project/exhibition'},
                    {text: 'Gateway', url: '/project/gateway'},
                    {text: 'Cooperation', url: '/olive-ppt'}
                ]
            },
            {
                title: "Resources",
                links: [
                    {text: "Doc", url: "/coming-soon"},
                    {text: "Tutorials", url: "/coming-soon"},
                    {text: "Code", url: "/coming-soon"}
                ]
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
