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
        title: 'Technical Skills',
        items: [
            {
                name: 'Full-Stack Development',
                desc: 'Proficient in Spring and Vue technology stacks, capable of end-to-end system development from frontend to backend.',
                icon: 'fas fa-laptop-code',
                level: 60
            },
            {
                name: 'Database Design',
                desc: 'Skilled in MySQL with strong SQL query capabilities, experienced in schema design and optimization.',
                icon: 'fas fa-database',
                level: 50
            },
            {
                name: 'Algorithms & Data Structures',
                desc: 'Solved 300+ LeetCode problems covering DP/backtracking/greedy algorithms, with practical optimization skills.',
                icon: 'fas fa-code',
                level: 55
            },
            {
                name: 'Game & 3D Development',
                desc: 'Proficient in Unity engine fundamentals and Blender 3D modeling for game asset creation.',
                icon: 'fas fa-gamepad',
                level: 30
            },
            {
                name: 'AI & Machine Learning',
                desc: 'Python programming foundation with growing expertise in ML/DL through continuous learning.',
                icon: 'fas fa-brain',
                level: 20
            },
            {
                name: 'Version Control',
                desc: 'Experienced in Git workflows and team collaboration, active in open-source contributions.',
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
    resume: {
        education: {
            title: "Education",
            items: [
                "B.S. in Software Engineering (Junior Year)",
                "GPA 3.42/4.0 (Top 20% in Major)",
                "University Outstanding Scholarship Recipient",
                "English Proficiency: CET-6 (Skilled in Technical Documentation)"
            ]
        },
        skills: {
            title: "Prof Skills",
            categories: [
                {
                    name: "Programming Languages",
                    items: [
                        "Java: Proficient in OOP, Collections Framework & Exception Handling",
                        "Python: Experienced with Pandas for data processing, familiar with ML fundamentals"
                    ]
                },
                {
                    name: "Web Development",
                    items: [
                        "Backend: REST API development with SpringBoot, MySQL operations via MyBatis",
                        "Frontend: Component-based development using Vue3 + Element UI",
                        "Database: Relational DB design, complex queries & index optimization"
                    ]
                },
                {
                    name: "Version Control",
                    items: [
                        "Proficient with Git workflows (feature branching & collaboration)",
                        "Active GitHub user with open-source contributions"
                    ]
                },
                {
                    name: "3D & Game Development",
                    items: [
                        "Blender: 3D modeling/texturing & basic animation workflows",
                        "Unity: Scene setup & C# scripting for game logic"
                    ]
                }
            ]
        },
        projects: {
            title: "Projects",
            stackLabel: "Tech Stack",
            contributionsLabel: "Contributions",
            items: [
                {
                    title: "Olive Vision - Smart Agriculture Platform (Lab Collaboration)",
                    stack: "SpringBoot, Vue3, MySQL, Redis",
                    contributions: [
                        "Co-designed API specifications for 3+ modules",
                        "Developed asset analytics dashboard using ECharts"
                    ],
                    highlight: "Key Learning: Large-scale project collaboration & documentation standards"
                },
                {
                    title: "SkyFood Delivery (Coding Bootcamp Project)",
                    stack: "SpringBoot, MyBatis, Redis, Vue3",
                    contributions: [
                        "Implemented order state machine using State Pattern",
                        "Applied Redis in shopping cart scenarios",
                        "Built WebSocket notifications per curriculum"
                    ],
                    highlight: "Extended Learning: Created 30+ Postman test cases"
                },
                {
                    title: "NewsHub Platform (Coding Bootcamp Project)",
                    stack: "SpringBoot, Vue3, MySQL",
                    contributions: [
                        "Developed article category management system",
                        "Implemented responsive layouts with Flexbox/Grid",
                        "Integrated JWT auth & Quill rich-text editor"
                    ],
                    highlight: "Key Takeaway: Mastered SpringBoot+Vue3 development workflow with Git collaboration"
                }
            ]
        },
        algo: {
            title: "Algorithm",
            items: [
                "Solved 300+ LeetCode problems (DP/Backtracking/Greedy algorithms)",
                "Proficient in algorithm complexity analysis",
                "Practical problem-solving with optimized approaches"
            ]
        },
        courses: {
            title: "Prof Courses",
            items: [
                "Core CS: Data Structures, Algorithm Design, Computer Architecture, OS, Networking",
                "Development: JavaEE, Web Frontend, Database Systems",
                "AI/ML: Fundamentals of Machine Learning, PyTorch Projects"
            ]
        },
        selfLearning: {
            title: "Self-Learning",
            items: [
                "Continuous learning via tech blogs/YouTube/Coursera",
                "Leverage AI tools (ChatGPT/Grok/Claude) for coding efficiency",
                "Active GitHub user studying trending projects"
            ]
        },
        softSkills: {
            title: "Soft Skills",
            items: [
                "Collaboration: Effective cross-functional communication (Design/Product teams)",
                "Time Management: Prioritization & deadline-driven delivery",
                "Problem-Solving: Systematic debugging via docs/community resources"
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
            {url: 'https://github.com/RCPawn', icon: 'fab fa-github'},
            {url: 'https://www.douyin.com/user/self?from_tab_name=main', icon: 'fab fa-tiktok'},
            {url: 'https://leetcode.cn/u/guo-he-zu-ew/', icon: 'icon-leetcode'}
        ],
        linkGroups: [
            {
                title: 'Projects',
                links: [
                    {text: 'Full Stack Apps', url: '/coming-soon'},
                    {text: 'Game Dev', url: '/coming-soon'},
                    {text: 'AI Lab', url: '/coming-soon'}
                ]
            },
            {
                title: 'Tech Stack',
                links: [
                    {text: 'Java & Spring', url: '/coming-soon'},
                    {text: 'Vue & Frontend', url: '/coming-soon'},
                    {text: 'Unity & Blender', url: '/coming-soon'}
                ]
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
