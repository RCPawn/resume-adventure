/** English copy; section comments map to on-site components (same as cn.js) */
export default {
    /** NavBar */
    nav: {
        logo: 'RCPAWN',
        intro: 'Intro',
        journey: 'Learning Trail',
        works: 'Works & Visuals',
        contact: 'Contact',
        game: 'My Game'
    },

    /** Chatbot */
    chatbot: {
        title: 'AI Assistant',
        placeholder: 'Type a message…',
        ariaFab: 'AI Assistant',
        ariaDialog: 'AI chat',
        emptyHint: 'Drop a line — I’ll pick it up.',
        send: 'Send'
    },

    /** HeroSection: headline, tagline, profession chips */
    title: 'HEY, I AM RCPAWN',
    subtitle: 'A SOFTWARE ENGINEERING STUDENT',
    professions: [
        { icon: 'code', label: 'Java Backend Developer' },
        { icon: 'cloud', label: 'Microservice Architecture Explorer' },
        { icon: 'cube', label: 'Enthusiast of 3D & Interactive Design' }
    ],

    /** HeroSection: scroll hint */
    hero: {
        scrollHint: 'Scroll down'
    },

    /** ProjectsSection (projects.json nameKey; new cards without art may use `/images/projects/玄武岩黑.png`) */
    projects: {
        internship: {
            name: '📋 On-site internship (enterprise IT & planning)',
            description:
                'Manufacturing-side delivery and iteration around planning-related capabilities: aligned requirements with planners, commercial, and IT; contributed to backend work such as tightening master-data references and cross-system identity checks. Customer environments, vendor products, and internal details are omitted under NDA.',
        },
        items: [
            {
                name: '🛡️ Microservices Traffic Governance & Unified Access Gateway',
                description:
                    'A self-developed microservices gateway integrating full-link authentication, dynamic routing, traffic shaping, security, async logging, and visual configuration/monitoring—building a secure, observable traffic edge.',
            },
            {
                name: '🎪 ICH Virtual Exhibition & Data Monitoring Platform',
                description:
                    'Digital platform for intangible cultural heritage: 3D exhibits, UGC community, and lineage graphs; a digital cockpit tracks engagement across assets for an end-to-end loop from cloud capture to cross-modal interaction.',
            },
            {
                name: '🌿 Olive Guardian',
                description:
                    'Integrated olive-grove platform combining data visualization, WebGIS, and blockchain for whole-region asset management.',
            },
            {
                name: '☁️ Weather App',
                description: 'Backend not deployed yet—stay tuned 😊',
            },
            {
                name: '🚗 Resume Adventure',
                description:
                    'Unity3D mini-game: drive a car through a world that maps to my learning journey (work in progress—stay tuned 😊)',
            },
            {
                name: '🍩 Web 3D Model Lab',
                description:
                    'GLB showcase with model-viewer: camera controls, loading progress, and auto-rotate.',
            },
        ],
        title: 'Learning Trail',
        subtitle: 'From hello world to hello bug',
        viewDetails: 'View Details',
        dateUnknown: 'Date TBD',
        dateCaption: 'Created',
        indexHint: 'Use the index on the left to jump to a card',
        indexRailAria: 'Learning trail card index',
        /** Short rail labels; keys match projects.json id */
        indexLabels: {
            'enterprise-internship': 'Zhejiang',
            gateway: 'Gateway',
            exhibition: 'Heritage',
            'olive-ppt': 'Olive',
            'resume-game': 'Game',
            'weather-app': 'Weather',
            'model-viewer-page': '3D Lab'
        },
        indexJumpAria: 'Item {n} of {total}: {short}'
    },

    /** GallerySection (gallery.items order matches GallerySection image list) */
    gallery: {
        title: 'Works & Visuals',
        subtitle: 'Snapshots of implemented modules and core system functionalities.',
        streamPrefix: '// VISUAL_ARCHIVE',
        snapCounter: '{current} / {total}',
        snapRegionAria: 'Works visual showcase',
        snapPrevAria: 'Previous slide',
        snapNextAria: 'Next slide',
        snapDotsAria: 'Current page slots',
        progressAria: 'Overall progress',
        indicatorSegAria: 'Slide {n}: {title}',
        toolbarAria: 'Gallery filters and navigation',
        searchPlaceholder: 'Search…',
        searchAria: 'Filter by text',
        categoryGroupAria: 'Filter by category',
        categoryAll: 'All',
        categoryExhibition: 'Heritage',
        categoryGateway: 'Gateway',
        categoryOther: 'Other',
        jumpPlaceholder: 'Go to…',
        jumpAria: 'Jump to slide',
        pagePrevAria: 'Previous page',
        pageNextAria: 'Next page',
        pageIndicator: '{current}/{total}',
        emptyFiltered: 'No matches. Clear search or change category.',
        viewDetail: 'View Details',
        items: {
            work0: { title: 'Digital Twin Dashboard', desc: 'Dark-theme twin dashboard: resource mix, category breakdown, interaction bars, word cloud, centered on the top exhibit 3D model.' },
            work1: { title: 'Immersive Portal Home', desc: 'Light hero with live KPIs for exhibits, views, and engagement; featured Sanheyuan digital twin on the right.' },
            work2: { title: 'Online Hall · Exhibit Detail', desc: 'Exhibit page for Sanheyuan: Three.js viewer, narrative sections, and threaded discussion panel.' },
            work3: { title: 'Paper Universe · Photo Column', desc: 'Masonry grid of heritage photo essays: tie-dye, architecture, wood carving, tea culture, and more.' },
            work4: { title: 'Gateway Console', desc: 'Admin interface for managing microservices gateway, including route forwarding and status monitoring.' },
            work5: { title: 'Traffic Defense Monitor', desc: 'Real-time visualization of QPS, concurrency, and error rates with threshold alerting.' },
            work6: { title: 'Route Matrix Config', desc: 'Module for dynamic route configuration, supporting environment-specific mapping and hot deployment.' },
            work7: { title: 'Audit Logs', desc: 'Operation auditing system featuring multi-criteria filtering, traceability, and data export.' },
            work8: { title: '3D Render Practice', desc: '3D scene rendering practice covering lighting, material textures, and geometric modeling.' },
            work10: { title: 'Gateway Architecture', desc: 'Logical diagram illustrating the request lifecycle: interception, authentication, and routing.' },
            work11: { title: 'Security Policy Config', desc: 'Management of rate-limiting, whitelisting, and circuit-breaking policies to ensure system stability.' },
            work12: { title: 'Route Topology', desc: 'Service routing topology showing the complete request path from client through gateway to downstream services.' },
            work13: { title: 'Async Logging System', desc: 'Asynchronous log collection and storage module designed to minimize main thread latency.' },
            work14: { title: 'Inheritance Graph', desc: 'Force-directed lineage graph for crafts: projects, sub-categories, and inheritor nodes with pan/zoom.' },
            work15: { title: 'Graph Cover Page', desc: 'Entry screen for the inheritance map: 3D book motif and CTA, subtitle Interwoven · Universe on Paper.' },
            work16: { title: 'Live Traffic Waveform', desc: 'ECharts dynamic rendering of gateway QPS, error rates, and response time curves for real-time health monitoring.' },
            work17: { title: 'Heritage Article View', desc: 'Long-form heritage story with image carousel, thumbnails, and caption overlay for tie-dye and similar topics.' },
        }
    },

    /** FooterSection */
    footer: {
        appName: 'Dev Space',
        tagline: 'Where code meets creativity',
        techTitle: 'Powering this site',
        downloadResume: 'Download résumé',
        downloadResumeAria: 'Download résumé file',
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
                title: 'On this site',
                links: [
                    {text: 'GitHub', url: 'https://github.com/RCPawn'},
                    {text: 'My Game', url: '/game'}
                ]
            }
        ]
    }
}
