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
        items: [
            {
                name: 'Full-Stack Development',
                desc: 'Proficient in Java, Spring, Vue and other technology stacks, capable of complete system development from front-end to back-end, possessing comprehensive abilities from system design to implementation',
                icon: 'fas fa-laptop-code',
                level: 60
            },
            {
                name: 'Database Design & Optimization',
                desc: 'Skilled in MySQL database operations, proficient in writing efficient SQL statements, experienced in database structure design',
                icon: 'fas fa-database',
                level: 50
            },
            {
                name: 'Algorithms & Data Structures',
                desc: 'Solved 300+ problems on LeetCode covering data structures, dynamic programming, backtracking, greedy algorithms, etc. Familiar with common algorithm complexity analysis and optimization methods. Able to select appropriate algorithmic solutions for practical problems',
                icon: 'fas fa-code',
                level: 55
            },
            {
                name: 'Game & 3D Development',
                desc: 'Mastered Unity game engine and basic Blender 3D modeling skills, capable of developing game prototypes and creating basic 3D model resources',
                icon: 'fas fa-gamepad',
                level: 30
            },
            {
                name: 'AI & Machine Learning',
                desc: 'Possesses Python programming foundations, understands core AI concepts, continuously learning and exploring deep learning application capabilities',
                icon: 'fas fa-brain',
                level: 20
            },
            {
                name: 'Version Control & Collaboration',
                desc: 'Proficient in Git workflow, skilled in team collaborative development, actively participating in open source community contributions',
                icon: 'fab fa-github',
                level: 60
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
                name: "Skills Roadmap",
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

    // Resume
    resume: {
        education: {
            title: "Education",
            items: [
                "Software Engineering Major, Junior Year",
                "University Excellence Scholarship Recipient",
                "English Proficiency: CET6"
            ]
        },
        skills: {
            title: "Prof Skills",
            categories: [
                {
                    name: "Programming Languages",
                    items: [
                        "Java: Familiar with core syntax, OOP, collections framework, and multi-threading basics",
                        "Python: Proficient in basic syntax, preliminary applications in data analysis and machine learning"
                    ]
                },
                {
                    name: "Web Development",
                    items: [
                        "Backend: Spring ecosystem (SpringMVC, SpringBoot), MyBatis, Redis, MySQL",
                        "Frontend: Vue3, Element UI, Node.js fundamentals",
                        "Database: Capable of designing database models, writing complex SQL queries, and basic performance optimization"
                    ]
                },
                {
                    name: "Version Control & Collaboration",
                    items: [
                        "Proficient in Git for version control, familiar with branch management workflows",
                        "Using GitHub for project hosting and participating in the open-source community"
                    ]
                },
                {
                    name: "3D & Game Development",
                    items: [
                        "Blender: Fundamentals of 3D modeling and animation",
                        "Unity: Game development basics, C# scripting"
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
                    title: "Smart Agriculture Management System - Olive Grove Integrated Platform",
                    stack: "SpringBoot, Vue3, MySQL, Redis",
                    contributions: [
                        "Responsible for user authentication and permission management",
                        "Designed and implemented data visualization interface",
                        "Optimized query performance, reducing page load time by 30%"
                    ],
                    highlight: "Challenge Solved: Implemented data consistency in high-concurrency scenarios"
                },
                {
                    title: "Content Management System - Full Stack Project",
                    stack: "Express.js, Vue3, MySQL",
                    contributions: [
                        "Implemented article publishing, editing, and categorization features",
                        "Designed responsive user interfaces",
                        "Integrated third-party rich text editors"
                    ]
                },
                {
                    title: "Online Food Ordering Platform - Full Stack Project",
                    stack: "SpringBoot, MyBatis, Redis, Vue3",
                    contributions: [
                        "Developed order management system",
                        "Implemented Redis-based shopping cart functionality",
                        "Integrated payment interfaces"
                    ]
                }
            ]
        },
        algo: {
            title: "Algorithm Skills",
            items: [
                "Solved 300+ problems on LeetCode, covering data structures, dynamic programming, greedy algorithms, etc.",
                "Familiar with common algorithm complexity analysis and optimization methods",
                "Able to select appropriate algorithmic solutions for real-world problems"
            ]
        },
        courses: {
            title: "Prof Courses",
            items: [
                "Computer Fundamentals: Data Structures, Algorithm Analysis & Design, Computer Architecture, Computer Networks, Operating Systems",
                "Development Technologies: Spring Stack, MyBatis, Redis, MySQL, Vue3, and related courses",
                "Artificial Intelligence: PyTorch fundamentals"
            ]
        },
        selfLearning: {
            title: "Self-Learning",
            items: [
                "Continuously following technology trends, learning professional knowledge through YouTube",
                "Understanding and utilizing various AI tools to improve development efficiency",
                "Active participation in the GitHub open-source community, studying high-quality project code"
            ]
        },
        softSkills: {
            title: "Soft Skills",
            items: [
                "Team Collaboration: Working closely with team members in project development, efficiently completing tasks",
                "Time Management: Able to balance study, project development, and personal growth",
                "Problem Solving: When facing technical challenges, capable of consulting documentation, analyzing source code, and proposing solutions"
            ]
        }
    },
    gallery: {
        title: 'Gallery',
        subtitle: 'Here are a few visuals of my works (Replace with another picture first)',
    },
    footer: {
        appName: 'Dev Space',
        tagline: 'Where code meets creativity',
        copyright: '© {year} Dev Space. All rights reserved.',
        madeWith: 'Made with passion & code',
        socialLinks: [
            { url: 'https://github.com/RCPawn', icon: 'fab fa-github' },
            { url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok' },
            { url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode' }
        ],
        linkGroups: [
            {
                title: 'Projects',
                links: [
                    { text: 'Full Stack Apps', url: '/coming-soon' },
                    { text: 'Game Dev', url: '/coming-soon' },
                    { text: 'AI Lab', url: '/coming-soon' }
                ]
            },
            {
                title: 'Tech Stack',
                links: [
                    { text: 'Java & Spring', url: '/coming-soon' },
                    { text: 'Vue & Frontend', url: '/coming-soon' },
                    { text: 'Unity & Blender', url: '/coming-soon' }
                ]
            },
            {
                title: 'About',
                links: [
                    { text: 'Bio', url: '/coming-soon' },
                    { text: 'Contact', url: '/coming-soon' },
                    { text: 'Blog', url: '/coming-soon' }
                ]
            }
        ]
    }
}
