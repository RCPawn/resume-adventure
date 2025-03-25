// data/i18n/en.js
// 英文语言包
import '@/assets/leetcodeIcon.css';

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
        'Full-stack Developer',
        'Deep Learning Enthusiast',
        'Passionate About 3D and Interactive Design'
    ],
    skills: {
        title: 'Professional Skills',
        skillTarget: 'Skill Target',
        current: 'Current Level',
        target: 'Target Level',
        items: [
            {
                name: 'Full-Stack Dev',
                desc: 'Proficient in Spring, Vue, and other technologies, capable of full-stack development from frontend to backend.',
                icon: 'fas fa-laptop-code',
                level: 60,
                target: 85
            },
            {
                name: 'Database Design',
                desc: 'Proficient in MySQL, able to write complex SQL queries, and knowledgeable in database design and optimization.',
                icon: 'fas fa-database',
                level: 50,
                target: 75
            },
            {
                name: 'Algorithms',
                desc: 'Solved 300+ problems on LeetCode, covering data structures, dynamic programming, backtracking, and greedy algorithms.',
                icon: 'fas fa-code',
                level: 55,
                target: 80
            },
            {
                name: 'AI & Machine Learning',
                desc: 'Familiar with Python programming and has a foundational understanding of machine learning and deep learning.',
                icon: 'fas fa-brain',
                level: 20,
                target: 70
            },
            {
                name: 'Game & 3D Dev',
                desc: 'Experienced in Unity game engine and Blender 3D modeling, capable of creating simple 3D assets.',
                icon: 'fas fa-gamepad',
                level: 30,
                target: 60
            },
            {
                name: 'Version Control',
                desc: 'Proficient in Git workflows, efficient in team collaboration, and actively involved in open-source projects.',
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
                "English Proficiency: CET6, Skilled in Technical Documentation Reading"
            ]
        },
        skills: {
            title: "Prof Skills",
            categories: [
                {
                    name: "Programming Languages",
                    items: [
                        "Solid mastery of Java core syntax, proficient with collection frameworks (studied HashMap source code, understanding hash collision resolution and expansion mechanisms). Experienced in multi-threaded programming (synchronized, volatile, thread pools) and common algorithms (Quick Sort, Merge Sort)"
                    ]
                },
                {
                    name: "Storage Layer Development",
                    items: [
                        "Proficient in Redis fundamentals, including String/Hash data structures, RDB persistence, and cache breakdown/penetration solutions (timeout randomization, null object caching)"
                    ]
                },
                {
                    name: "Server-Side Frameworks",
                    items: [
                        "Skilled in SpringBoot development (IOC/AOP), integrating MyBatis-Plus to implement dynamic SQL and pagination plugin optimization",
                        "Experienced with Spring Security+JWT in building RBAC permission systems, capable of implementing interface-level permission control and security interception"
                    ]
                },
                {
                    name: "Distributed Computing Basics",
                    items: [
                        "Familiar with SpringCloud microservice components (Nacos/OpenFeign), able to perform service registration, discovery, and remote interface calls"
                    ]
                },
                {
                    name: "Engineering Tools",
                    items: [
                        "Proficient in Git version control (resolving branch conflicts), Maven project management, Postman interface testing, and Swagger documentation maintenance"
                    ]
                }
            ]
        },
        projects: {
            title: "Projects",
            stackLabel: "Tech Stack",
            contributionsLabel: "Personal Contributions",
            items: [
                {
                    title: "Olive Thousand-Mile Panorama - Intelligent Asset Management Platform for Thousand-Mu Olive Groves",
                    stack: "SpringBoot, Vue3, MySQL, Redis",
                    contributions: [
                        "Developed asset information management module: Implemented CRUD interfaces for equipment (bug traps, mowers, etc.) using SpringBoot, optimizing backend management efficiency with MyBatis-Plus dynamic SQL and PageHelper pagination",
                        "Designed permission and security system: Implemented multi-role permission control using RBAC model+JWT+Spring Security, intercepting unauthorized requests with standardized status codes (401/403)",
                        "Optimized data storage and querying: Utilized MySQL composite indexing (Device ID + timestamp) to improve trajectory query efficiency, combined with Redis caching of high-frequency location data to reduce database pressure",
                        "Produced technical solutions and documentation: Collaborated with team to organize business processes, transforming asset management and trajectory tracking requirements into backend module design proposals, and generated Swagger interface documentation",
                        "Maintained code traceability: Used Git for version control, resolved branch conflicts, and ensured code maintainability"
                    ],
                    highlight: "Project Insights: Mastered enterprise-level full-stack development process, enhanced engineering capabilities of SpringBoot technology stack integration, completed project delivery through cross-role collaboration (product, frontend), and strengthened communication and documentation skills."
                },
                {
                    title: "Sky Take-Out (Black Horse Programmer Course Practice)",
                    stack: "SpringBoot, MyBatis, Redis, Vue3",
                    contributions: [
                        "Implemented order state machine module following course guidance (State Pattern)",
                        "Practiced Redis application in shopping cart scenarios (course experimental case)",
                        "Completed WebSocket message notification functionality based on teaching template"
                    ],
                    highlight: "Course Extension: Completed 30+ interface test cases using Postman"
                },
                {
                    title: "Major Events (Black Horse Programmer Course Practice)",
                    stack: "SpringBoot, Vue3, MySQL",
                    contributions: [
                        "Course practice: Implemented article category management module according to teaching documentation",
                        "Applied course knowledge to complete responsive layout (Flexbox/Grid)",
                        "Mastered JWT authentication process and Quill rich text integration through course cases"
                    ],
                    highlight: "Course Gains: Systematically learned SpringBoot+Vue3 engineering development process, practiced version control and team collaboration with Git"
                }
            ]
        },
        algo: {
            title: "Algorithm",
            items: [
                "Solved 300+ LeetCode problems, covering data structures, dynamic programming, backtracking, and greedy algorithms",
                "Familiar with common algorithm complexity analysis and optimization methods",
                "Capable of selecting appropriate algorithmic solutions for practical problems"
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
        title: 'Gallery',
        subtitle: 'Here are a few visuals of my works',
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
                    {text: 'Game Dev', url: '/game'},
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
