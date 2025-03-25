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
            "title": "Professional Skills",
            "categories": [
                {
                    "name": "Programming Languages",
                    "items": [
                        "Solid foundation in Java, proficient in strings, collections, multithreading (including synchronized, volatile, thread pools), and sorting algorithms (quick sort, bubble sort), with understanding of collection framework internals (including the thread safety mechanism of ConcurrentHashMap)."
                    ]
                },
                {
                    "name": "Data Storage Development",
                    "items": [
                        "Proficient in MySQL basics: index optimization (B+ tree structure), transaction ACID properties, locking mechanisms, and SQL tuning.",
                        "Familiar with basic Redis applications: String/Hash data structures, RDB persistence, and solutions for cache avalanche/penetration."
                    ]
                },
                {
                    "name": "Server-Side Frameworks",
                    "items": [
                        "Experienced in the SpringBoot development process (IOC container management, AOP logging aspects, MyBatis-Plus integration), capable of developing RESTful APIs independently.",
                        "Skilled in the Spring Security authentication process, implementing Token-based authentication with JWT and designing an RBAC access control system."
                    ]
                },
                {
                    "name": "Distributed Systems Basics",
                    "items": [
                        "Familiar with SpringCloud basic components (Nacos for service registration and OpenFeign for remote calls), with an understanding of microservice communication principles.",
                        "Knowledgeable in HTTP/HTTPS protocols and TCP three-way handshake mechanisms, as well as the principles of WebSocket real-time communication."
                    ]
                },
                {
                    "name": "Engineering Tools",
                    "items": [
                        "Skilled in using Git for version control (branch management and conflict resolution), Maven multi-module builds, Postman API testing, and Swagger API documentation generation."
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
                    "title": "Olive Vision - Intelligent Visual Management Platform for 10,000-Acre Olive Grove Assets",
                    "stack": "SpringBoot, Vue3, MySQL, Redis",
                    "contributions": [
                        "Developed device management interfaces based on the SpringBoot framework, utilizing MyBatis-Plus dynamic SQL for handling multi-criteria queries, integrated the PageHelper pagination plugin to optimize device data loading efficiency, and designed a device state machine (Idle, Under Repair, Scrapped) along with maintenance workflows for full lifecycle management.",
                        "Established a role-based access control (RBAC) system for roles such as administrators and operators, implemented token authentication using Spring Security and JWT, and designed filters to intercept unauthorized operations (e.g., operators accessing admin interfaces), returning 401/403 status codes to ensure interface security.",
                        "For device tracking queries, designed a composite index on device ID and timestamp in MySQL to enhance query efficiency, and combined Redis caching for frequently accessed device location data to reduce database load by approximately 20%.",
                        "Drafted backend module design proposals, utilized Swagger to generate standardized API documentation, and created core business process flowcharts and database ER diagrams to promote unified team development standards."
                    ],
                    "highlight": "Project Achievements: Gained mastery over enterprise-level full-stack development processes, enhanced the implementation of integrated SpringBoot technology stacks, delivered the project through cross-functional collaboration (product, front-end), and strengthened communication and documentation skills."
                },
                {
                    "title": "Celestial Takeaway (HeiMa Programmer Course Practice)",
                    "stack": "SpringBoot, MyBatis, Redis, Vue3",
                    "contributions": [
                        "Implemented an order state machine module (State Pattern) following course instructions.",
                        "Practiced applying Redis in shopping cart scenarios (course lab example).",
                        "Completed WebSocket message notification functionality based on the provided teaching template."
                    ],
                    "highlight": "Course Extension: Executed over 30 API test cases using Postman."
                },
                {
                    "title": "Big Events (HeiMa Programmer Course Practice)",
                    "stack": "SpringBoot, Vue3, MySQL",
                    "contributions": [
                        "Course Practice: Implemented an article category management module according to teaching documents.",
                        "Applied course knowledge to develop responsive layouts using Flexbox/Grid.",
                        "Mastered JWT authentication flow and integrated the Quill rich text editor through a course case study."
                    ],
                    "highlight": "Course Achievements: Systematically mastered the SpringBoot+Vue3 engineering development process and practiced Git for version control and team collaboration."
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
