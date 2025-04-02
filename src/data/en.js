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
        footer: 'Footer'
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
                description: "Systematically solved 300+ algorithm challenges covering data structures, dynamic programming, backtracking, greedy algorithms and more"
            },
            {
                name: "GitHub Project",
                description: "Utilized GitHub for hosting personal project code, actively explored open-source resources, and developed version control skills and technical perspective"
            },
            {
                name: "Deep Learning",
                description: "Self-taught deep learning fundamentals through YouTube and other platforms, practiced basic image recognition models, passionate about frontier AI technologies"
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
                "Software Engineering, Junior Year (Undergraduate)",
                "GPA 3.42/4.0 (Top 20% in Major)",
                "University-Level Scholarship Recipient",
                "English Proficiency: CET-6, Skilled in Technical Documentation Reading"
            ]
        },
        skills: {
            "title": "Prof Skills",
            "categories": [
                {
                    "name": "Programming Languages",
                    "items": [
                        "Solid foundation in Java, proficient in string manipulation, collection frameworks, multithreading programming, and common sorting algorithms, with an understanding of the underlying implementation of collection frameworks"
                    ]
                },
                {
                    "name": "Data Storage Development",
                    "items": [
                        "Proficient in using MySQL for data storage and queries, with an understanding of basic principles of indexes (e.g., B+ tree) and transactions (ACID properties), capable of writing efficient SQL queries to address common business requirements",
                        "Familiar with the basic applications of Redis, proficient in String/Hash data structures and the RDB persistence mechanism, with an understanding of basic caching optimization strategies"
                    ]
                },
                {
                    "name": "Server-side Frameworks",
                    "items": [
                        "Proficient in the SpringBoot development process, familiar with IOC container management, AOP logging aspects, and MyBatis integration, capable of independently developing RESTful APIs",
                        "Familiar with the Spring Security authentication process, capable of implementing token authentication based on JWT and designing an RBAC (Role-Based Access Control) system"
                    ]
                },
                {
                    "name": "Distributed Systems Fundamentals",
                    "items": [
                        "Familiar with the basic concepts of SpringCloud, knowledgeable in the basic usage of Nacos for service registration and OpenFeign for remote calls, and understanding their role in microservices communication",
                        "Understanding of HTTP/HTTPS protocols and the TCP three-way handshake mechanism, with a grasp of WebSocket real-time communication principles"
                    ]
                },
                {
                    "name": "Engineering Tools",
                    "items": [
                        "Possess engineering development skills, proficient in using Swagger for generating API documentation, and skilled in tools and techniques such as Git branch management, Maven multi-module builds, and Postman for API debugging"
                    ]
                }
            ]
        },
        projects: {
            title: "Projects",
            stackLabel: "Technology Stack",
            contributionsLabel: "Key Contributions",
            items: [
                {
                    title: "Olive Vision - Intelligent Asset Management Platform for Olive Groves",
                    description: "A university-enterprise collaboration project covering digital lifecycle management for over 1000 agricultural devices (insect traps, mowers, etc.) across 12 management zones. Implemented core features including asset registration, cross-zone transfers, mobile QR code maintenance requests, and disposal processes. Addressed industry pain points like difficult device tracking, ambiguous responsibility definition, and inefficient cross-zone coordination. Project pending launch with expected 30%+ reduction in operational costs.",
                    stack: "SpringBoot, Vue3, MySQL, Redis",
                    contributions: [
                        "Developed core asset management features using SpringBoot+MyBatis, implementing complete lifecycle state transitions (check-in/out, maintenance, disposal)",
                        "Utilized Redis to cache hotspot asset data, improving query response time and reducing database pressure by ~20%",
                        "Implemented RBAC-based permission control system with Spring Security+JWT token authentication, designing filters to block unauthorized operations",
                        "Developed maintenance work order dispatch system with auto-assignment, progress tracking and timeout alerts",
                        "Implemented batch data processing using EasyExcel for bulk import/export of asset information",
                        "Led requirements analysis and technical solution design, participated in backend architecture discussions, and established core module development standards"
                    ],
                    highlight: "Key Takeaways: Mastered enterprise full-stack development processes, enhanced engineering implementation capabilities with SpringBoot integration, improved communication and documentation skills through cross-role collaboration (product managers, frontend developers)."
                },
                {
                    title: "Resume Adventure (Personal Website)",
                    description: "Independently designed personal website using SpringBoot+Vue3, with core modules developed efficiently through AI-assisted programming (Claude/ChatGPT).",
                    stack: "SpringBoot, Vue3",
                    contributions: [
                        "Integrated Tencent Cloud's AI knowledge engine API to implement intelligent Q&A based on personal knowledge base",
                        "Incorporated Three.js technology to create 3D interactive effects in project showcase area",
                        "Developed online presentation module using Reveal.js to transform project experience into interactive slides",
                        "Designed and developed clean, aesthetic personal information display pages showcasing education, skills and project achievements"
                    ],
                    highlight: "Project Highlights: Independent full-stack development project, practiced AI-assisted programming workflow, explored cutting-edge technology applications in real projects."
                }
            ]
        },
        algo: {
            "title": "Algorithm Skills",
            "items": [
                "Solved over 300 LeetCode problems covering dynamic programming, backtracking, greedy algorithms, etc., enjoying the process of achieving code acceptance.",
                "Familiar with common algorithm complexity analysis and optimization methods.",
                "Capable of selecting appropriate algorithmic solutions for real-world problems."
            ]
        },
        courses: {
            title: "Prof Courses",
            items: [
                "Computer Fundamentals: Data Structures, Algorithm Analysis and Design, Computer Organization, Computer Networks, Operating Systems",
                "Development Technologies: JavaEE, Web Frontend Development, Database Fundamentals",
                "Artificial Intelligence: Machine Learning Basics, PyTorch Practical Course"
            ]
        },
        selfLearning: {
            title: "Self-Learning",
            items: [
                "Continuously learning cutting-edge technologies through tech blogs, YouTube, Bilibili, and other platforms",
                "Optimizing development workflow using AI tools (such as ChatGPT, Grok, Claude) to improve efficiency",
                "Following tech community trends, starring quality projects, and reading source code to learn engineering practices"
            ]
        },
        softSkills: {
            title: "Soft Skills",
            items: [
                "Team Collaboration: Actively participating in group project discussions, skilled in listening and expression, effectively communicating with design and product roles",
                "Time Management: Rationally planning task priorities, delivering projects on time, maintaining a balance between learning and development",
                "Problem Solving: When encountering technical challenges, capable of consulting official documentation, analyzing source code, and finding solutions on Stack Overflow and GitHub issues"
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
                    {text: 'AI Lab', url: '/coming-soon'}
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
                    {text: 'Bio', url: '/coming-soon'},
                    {text: 'Contact', url: '/coming-soon'},
                    {text: 'Blog', url: '/coming-soon'}
                ]
            }
        ]
    }
}
