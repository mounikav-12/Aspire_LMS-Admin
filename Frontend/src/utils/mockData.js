export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  INSTRUCTOR: 'Instructor'
};

export const PERMISSION_LIST = [
  // Executive & Admin Access
  { id: 'view_dashboard', name: 'Executive Analytics Dashboard', category: 'Administration' },
  { id: 'manage_users', name: 'User & Staff Directory Management', category: 'Administration' },
  { id: 'manage_roles', name: 'Role & Permissions Matrix', category: 'Administration' },

  // Batch & Student Operations
  { id: 'manage_batches', name: 'Batch Management & Schedule Tracking', category: 'Batch & Student Ops' },
  { id: 'manage_milestones', name: 'Curriculum Milestones & Roadmap', category: 'Batch & Student Ops' },
  { id: 'manage_students', name: 'Student Directory & Progress Tracking', category: 'Batch & Student Ops' },

  // Courseware & Academic Content
  { id: 'create_course', name: 'Course Management & Topics', category: 'Courseware & Learning' },
  { id: 'delete_course', name: 'Delete Courses', category: 'Courseware & Learning' },
  { id: 'create_assessment', name: 'Assessments & Quizzes', category: 'Courseware & Learning' },
  { id: 'delete_assessment', name: 'Delete Assessments', category: 'Courseware & Learning' },
  { id: 'manage_coding', name: 'Coding Question Bank & Test Cases', category: 'Courseware & Learning' },
  { id: 'manage_projects', name: 'Real-World Projects Portal', category: 'Courseware & Learning' },
  { id: 'manage_rewards', name: 'Rewards & Merchandise Store', category: 'Live & Placement' },

  // Live Classes & Career Enablement
  { id: 'manage_live_sessions', name: 'Live Sessions & Schedule Links', category: 'Live & Placement' },
  { id: 'manage_jobs', name: 'Job Portal & Hiring Pipeline', category: 'Live & Placement' },
  { id: 'manage_recordings', name: 'Recording Video Library', category: 'Live & Placement' },
  { id: 'manage_placement', name: 'Placement Prep & Career Content', category: 'Live & Placement' },
  { id: 'inspect_api_feed', name: 'Student LMS Feed Sync API', category: 'Live & Placement' }
];

export const INITIAL_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: PERMISSION_LIST.map(p => p.id),
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_batches',
    'manage_milestones',
    'manage_students',
    'manage_users',
    'create_course',
    'delete_course',
    'create_assessment',
    'delete_assessment',
    'manage_coding',
    'manage_projects',
    'manage_rewards',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'manage_placement',
    'inspect_api_feed'
  ],
  [ROLES.MANAGER]: [
    'view_dashboard',
    'manage_batches',
    'manage_milestones',
    'manage_students',
    'create_course',
    'manage_coding',
    'manage_projects',
    'manage_rewards',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'inspect_api_feed'
  ],
  [ROLES.INSTRUCTOR]: [
    'view_dashboard',
    'manage_batches',
    'manage_milestones',
    'manage_students',
    'create_course',
    'create_assessment',
    'manage_coding',
    'manage_projects',
    'manage_rewards',
    'manage_live_sessions',
    'manage_recordings',
    'inspect_api_feed'
  ]
};

export const INITIAL_REWARDS = [
  {
    id: 'rew-1',
    title: 'Developer Sticker Pack',
    category: 'ACCESSORIES',
    requiredXp: 1000,
    image: '/rewards/stickers.jpg',
    description: 'Pro Developer Laptop Sticker Pack with custom Aspire Next branding and developer badges.',
    isReleased: false,
    stock: 150,
    unlockedCount: 0
  },
  {
    id: 'rew-2',
    title: 'Aspire Next Coffee Mug',
    category: 'DRINKWARE',
    requiredXp: 2000,
    image: '/rewards/mug.jpg',
    description: 'Ceramic matte-finish coffee mug featuring the Aspire Next emblem and inspiring tagline.',
    isReleased: false,
    stock: 80,
    unlockedCount: 0
  },
  {
    id: 'rew-3',
    title: 'Reusable Smart Notebook',
    category: 'STATIONERY',
    requiredXp: 3800,
    image: '/rewards/notebook.jpg',
    description: 'Smart erasable executive notebook with precision pen and companion cleaning cloth.',
    isReleased: false,
    stock: 50,
    unlockedCount: 0
  },
  {
    id: 'rew-4',
    title: 'Smart LED Flask',
    category: 'DRINKWARE',
    requiredXp: 5000,
    image: '/rewards/flask.jpg',
    description: 'Insulated vacuum flask with real-time digital LED temperature indicator and hot/cold insulation.',
    isReleased: false,
    stock: 45,
    unlockedCount: 0
  },
  {
    id: 'rew-5',
    title: 'Premium Developer T-Shirt',
    category: 'APPAREL',
    requiredXp: 8000,
    image: '/rewards/tshirt.jpg',
    description: 'High quality breathable navy cotton developer tee with dual-sided Aspire Next insignia.',
    isReleased: false,
    stock: 60,
    unlockedCount: 0
  },
  {
    id: 'rew-6',
    title: 'Tech Backpack',
    category: 'GEAR',
    requiredXp: 15000,
    image: '/rewards/backpack.jpg',
    description: 'Ergonomic water-resistant tech backpack with dedicated laptop sleeve and security pockets.',
    isReleased: false,
    stock: 25,
    unlockedCount: 0
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    email: 'aspireAdmin@gmail.com',
    role: ROLES.SUPER_ADMIN,
    department: 'Executive Leadership',
    status: 'Active',
    joinedDate: '2025-01-15',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Super%20Admin&backgroundColor=2563eb&textColor=ffffff&bold=true'
  }
];

export const INITIAL_STUDENTS = [];

export const INITIAL_COURSES = [
  {
    id: 'crs-1786624019154-w',
    title: 'Python Full Stack + DSA with AI',
    category: 'Web Development',
    level: 'Intermediate',
    instructor: 'Siva V',
    publishStatus: 'Published',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR7h4hMnOE1xKQCdKGZZklh73d-b8uFU0xnBzVnUTtXA&s=10',
    enrolledCount: 0,
    rating: 5,
    description: 'Master Python programming, full-stack web development, Data Structures & Algorithms (DSA), and AI technologies to build modern, intelligent applications. Gain hands-on experience through real-world projects and become industry-ready for software engineering careers.',
    targetBatch: 'All Batches'
  }
];

export const INITIAL_ASSESSMENTS = [];

export const INITIAL_LIVE_SESSIONS = [];

export const INITIAL_JOBS = [];

export const INITIAL_RECORDINGS = [];

export const INITIAL_PLACEMENT_RESOURCES = [];

export const MOCK_ACTIVITIES = [];

export const API_FEED_STATUS = {
  status: 'Connected & Syncing',
  endpoint: 'https://api.aspirelms.io/v1/student-feed',
  lastSynced: 'Just now',
  totalCoursesLive: 0,
  liveClassesActive: 0,
  jobPostingsLive: 0,
  recordingsPublished: 0
};

export const INITIAL_PROJECTS = [];

export const INITIAL_CODING_QUESTIONS = [];

export const INITIAL_MILESTONES = {
  "overview": {
    "trackTitle": "Python full stack + DSA with AI",
    "headline": "Master core engineering fundamentals, advanced AI models, full-stack frameworks, and real-world project deployments.",
    "completedCount": 6,
    "totalCount": 31,
    "unlockedLevel": 3,
    "completionPercentage": 45
  },
  "stages": [
    {
      "id": "stage-1",
      "stageNumber": "STAGE 01",
      "phaseTag": "Phase 1 • Frontend & Version Control",
      "title": "Stage 1: Front End + Repository",
      "status": "IN PROGRESS",
      "statusType": "in-progress",
      "isLocked": false,
      "subtopics": [
        {
          "id": "git-github",
          "title": "Git & GitHub Version Control",
          "description": "Click to view subtopics",
          "duration": "Git Architecture, Commands (init, add, commit, push, pull), Branching Strategy, Merge Conflicts, GitHub Pull Requests & Collaboration",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-git-github-1",
              "title": "Git Architecture & Core Commands",
              "items": [
                {
                  "id": "git-github-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Git Architecture & Commands Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                }
              ]
            },
            {
              "id": "mod-git-github-2",
              "title": "Branching Strategies & Conflict Resolution",
              "items": [
                {
                  "id": "git-github-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Branching, PRs & Merge Conflicts Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "html5-web-arch",
          "title": "HTML5 & Web Architecture",
          "description": "Click to view subtopics",
          "duration": "Web Architecture, Client-Server Model, HTML5 Document Structure, Semantic Elements, Forms, Input Types, Validation, Tables, Media Tags",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-html5-web-arch-1",
              "title": "Web Architecture & Document Structure",
              "items": [
                {
                  "id": "html5-web-arch-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Web Architecture & Client-Server Model",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "HTML5 Semantic Layout & Document Structure",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "html5-web-arch-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "HTML5 Structure Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-2",
              "title": "HTML5 Forms, Validation & Media Tags",
              "items": [
                {
                  "id": "html5-web-arch-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "HTML5 Forms, Validation & Media Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building Validated Forms & Media Gallery",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "html5-web-arch-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Forms & Accessibility Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "css3-box-model",
          "title": "CSS3 Fundamentals & Box Model",
          "description": "Click to view subtopics",
          "duration": "CSS Syntax, Selectors (Element, Class, ID, Pseudo), Box Model (Margin, Padding, Border, Content), Colors, Typography, Backgrounds",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-css3-box-model-1",
              "title": "CSS Selectors & Styling Rules",
              "items": [
                {
                  "id": "css3-box-model-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS Syntax & Selectors Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Styling Text & Backgrounds Exercises",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "css3-box-model-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "CSS Selectors Knowledge Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-css3-box-model-2",
              "title": "CSS Box Model & Typography",
              "items": [
                {
                  "id": "css3-box-model-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS Box Model & Spacing Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Card Layout & Box Model Styling Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "css3-box-model-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "CSS Box Model Evaluation Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "advanced-css-responsive",
          "title": "Advanced CSS Layouts & Responsive Design",
          "description": "Click to view subtopics",
          "duration": "Flexbox Architecture, CSS Grid System, Positioning (Relative, Absolute, Fixed, Sticky), Media Queries, Responsive UI Patterns",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-advanced-css-responsive-1",
              "title": "Flexbox & CSS Grid Layouts",
              "items": [
                {
                  "id": "advanced-css-responsive-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Flexbox & CSS Grid Architecture Live Class",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Grid Dashboard & Flexbox Navigation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "advanced-css-responsive-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "CSS Layout Systems Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-css-responsive-2",
              "title": "Positioning & Media Queries",
              "items": [
                {
                  "id": "advanced-css-responsive-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Responsive Media Queries & Mobile-First Design",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Responsive Web Page Layout Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "advanced-css-responsive-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Responsive CSS Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "bootstrap-5",
          "title": "Bootstrap 5 Framework",
          "description": "Click to view subtopics",
          "duration": "Bootstrap Grid System, Responsive Utilities, Components (Navbar, Modals, Cards, Forms), Customizing Bootstrap",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-bootstrap-5-1",
              "title": "Bootstrap Grid & Responsive Utilities",
              "items": [
                {
                  "id": "bootstrap-5-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Bootstrap 5 Grid System Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building Layouts with Bootstrap Grid",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "bootstrap-5-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Bootstrap Grid Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-bootstrap-5-2",
              "title": "Bootstrap Components & Customization",
              "items": [
                {
                  "id": "bootstrap-5-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Bootstrap UI Components Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Interactive Modal & Card Component Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "bootstrap-5-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Bootstrap 5 Framework Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "js-essentials",
          "title": "JavaScript Essentials & Control Flow",
          "description": "Click to view subtopics",
          "duration": "Variables (var, let, const), Data Types, Operators, Conditional Statements (if-else, switch), Loops (for, while, forEach)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-js-essentials-1",
              "title": "Variables & Data Types",
              "items": [
                {
                  "id": "js-essentials-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "JavaScript Variables & Data Types Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Variables & Primitive Types Practice Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "js-essentials-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "JS Variables & Types Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-js-essentials-2",
              "title": "Control Statements & Loops",
              "items": [
                {
                  "id": "js-essentials-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Conditional Statements & Iteration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Loops & Decision Logic Exercises",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "js-essentials-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Control Flow Evaluation Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "js-functions-objects",
          "title": "JavaScript Functions, Objects & Arrays",
          "description": "Click to view subtopics",
          "duration": "Function Declarations, Expressions, Arrow Functions, Array Methods (map, filter, reduce), Object Manipulation, Higher-Order Functions",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-js-functions-objects-1",
              "title": "Function Expressions & Arrow Syntax",
              "items": [
                {
                  "id": "js-functions-objects-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Functions & Arrow Syntax Live Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Functional Logic Exercises Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "js-functions-objects-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "JS Functions Knowledge Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-2",
              "title": "Array Methods & Object Manipulation",
              "items": [
                {
                  "id": "js-functions-objects-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Array Methods (map, filter, reduce) Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Data Transformation & Object Manipulation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "js-functions-objects-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Array Methods & Objects Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "dom-events",
          "title": "DOM Manipulation & Event Handling",
          "description": "Click to view subtopics",
          "duration": "Selecting Elements, Modifying DOM, Event Listeners, Form Validation, Event Bubbling & Delegation, Dynamic HTML Creation",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-dom-events-1",
              "title": "DOM Selection & Element Manipulation",
              "items": [
                {
                  "id": "dom-events-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DOM Selection & Dynamic Styling Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Interactive DOM Element Editor Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dom-events-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DOM Selection Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-dom-events-2",
              "title": "Event Listeners & Form Validation",
              "items": [
                {
                  "id": "dom-events-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Event Bubbling & Form Validation Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Interactive Event-Driven UI Project",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dom-events-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DOM & Events Evaluation Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "es6-async-js",
          "title": "Modern ES6+ & Asynchronous JS",
          "description": "Click to view subtopics",
          "duration": "Destructuring, Spread/Rest Operators, Modules, Promises, Async/Await, Fetch API, Handling JSON Data",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-es6-async-js-1",
              "title": "ES6+ Syntax & Modules",
              "items": [
                {
                  "id": "es6-async-js-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Modern ES6+ Features & Destructuring",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "ES6 Spread/Rest & Modules Practice",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "es6-async-js-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "ES6 Syntax Knowledge Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-es6-async-js-2",
              "title": "Promises & Async/Await",
              "items": [
                {
                  "id": "es6-async-js-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Asynchronous JS & Fetch API Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "REST API Fetch & JSON Rendering Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "es6-async-js-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Async JS & Promises Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "stage-2",
      "stageNumber": "STAGE 02",
      "phaseTag": "Phase 2 • Backend Systems & DSA",
      "title": "Stage 2: Backend + DSA",
      "status": "AVAILABLE",
      "statusType": "available",
      "isLocked": false,
      "subtopics": [
        {
          "id": "py-fundamentals",
          "title": "Python Programming Fundamentals",
          "description": "Click to view subtopics",
          "duration": "Python Setup, Variables, Data Types, Control Flow, Functions, Variable Scope, Built-in Data Structures (Lists, Tuples, Sets, Dicts)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-py-fundamentals-1",
              "title": "Python Syntax & Data Types",
              "items": [
                {
                  "id": "py-fundamentals-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Python Basics & Built-in Types Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-fundamentals-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-fundamentals-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Python Environment Setup & Syntax Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-fundamentals-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-fundamentals-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Python Fundamentals Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-py-fundamentals-2",
              "title": "Functions & Data Structures",
              "items": [
                {
                  "id": "py-fundamentals-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Lists, Tuples, Sets & Dicts Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-fundamentals-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-fundamentals-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Data Structure Manipulation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-fundamentals-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-fundamentals-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Python Data Structures Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "py-advanced-exceptions",
          "title": "Advanced Python & Exception Handling",
          "description": "Click to view subtopics",
          "duration": "Decorators, Generators, Iterators, File I/O, Error Handling (try-except-finally), Context Managers, Custom Exceptions",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-py-advanced-exceptions-1",
              "title": "Decorators & Generators",
              "items": [
                {
                  "id": "py-advanced-exceptions-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Python Decorators & Generators Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-advanced-exceptions-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-advanced-exceptions-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Custom Decorator Implementation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-advanced-exceptions-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-advanced-exceptions-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Decorators & Iterators Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-py-advanced-exceptions-2",
              "title": "Exception Handling & File I/O",
              "items": [
                {
                  "id": "py-advanced-exceptions-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Error Handling (try-except) & Context Managers",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-advanced-exceptions-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-advanced-exceptions-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "File Processing & Custom Exception Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-advanced-exceptions-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-advanced-exceptions-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Exception Handling Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "py-oop",
          "title": "Object-Oriented Programming (OOP)",
          "description": "Click to view subtopics",
          "duration": "Classes, Objects, Constructors (__init__), Inheritance, Polymorphism, Encapsulation, Abstraction, Dunder Methods",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-py-oop-1",
              "title": "Classes & Inheritance",
              "items": [
                {
                  "id": "py-oop-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "OOP Principles: Classes & Inheritance",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-oop-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-oop-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building Class Hierarchies Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-oop-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-oop-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "OOP Concepts Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-py-oop-2",
              "title": "Encapsulation & Dunder Methods",
              "items": [
                {
                  "id": "py-oop-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Polymorphism, Abstraction & Magic Methods",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-py-oop-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "py-oop-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Bank Account OOP Simulation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/py-oop-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "py-oop-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Advanced OOP Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "sql-mysql",
          "title": "SQL & Relational Databases (MySQL)",
          "description": "Click to view subtopics",
          "duration": "RDBMS Concepts, SQL DDL (CREATE, ALTER), DML (INSERT, UPDATE, DELETE), Select Queries, Filtering, Aggregations, GROUP BY",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-sql-mysql-1",
              "title": "SQL DDL & Basic Queries",
              "items": [
                {
                  "id": "sql-mysql-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "RDBMS Concepts & SQL DDL Commands",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Table Creation & Schema Design Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "sql-mysql-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "SQL DDL & DML Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-2",
              "title": "Filtering, Aggregations & GROUP BY",
              "items": [
                {
                  "id": "sql-mysql-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "SQL Aggregations & GROUP BY Queries",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Sales Data Querying & Filtering Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "sql-mysql-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "SQL Queries Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "adv-sql-postgres",
          "title": "Advanced SQL & PostgreSQL Integration",
          "description": "Click to view subtopics",
          "duration": "SQL Joins (Inner, Left, Right, Full), Subqueries, Indexing, Transactions (ACID), Foreign Keys, PostgreSQL Setup & Commands",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-adv-sql-postgres-1",
              "title": "SQL Joins & Subqueries",
              "items": [
                {
                  "id": "adv-sql-postgres-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Mastering SQL Joins & Subqueries",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-adv-sql-postgres-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "adv-sql-postgres-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Multi-Table Relational Query Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/adv-sql-postgres-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "adv-sql-postgres-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "SQL Joins Knowledge Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-adv-sql-postgres-2",
              "title": "PostgreSQL Transactions & Indexing",
              "items": [
                {
                  "id": "adv-sql-postgres-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ACID Transactions & Database Indexing",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-adv-sql-postgres-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "adv-sql-postgres-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "PostgreSQL Database Performance Tuning",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/adv-sql-postgres-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "adv-sql-postgres-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "PostgreSQL & Transactions Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "django-setup-arch",
          "title": "Django Framework Setup & Architecture",
          "description": "Click to view subtopics",
          "duration": "MVT Architecture, Creating Django Projects/Apps, Directory Structure, Settings Configuration, Request-Response Lifecycle, Views & Routing",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-django-setup-arch-1",
              "title": "Django MVT & Project Initialization",
              "items": [
                {
                  "id": "django-setup-arch-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django MVT Architecture Live Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-setup-arch-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-setup-arch-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Creating Django Project & App Setup",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-setup-arch-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-setup-arch-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Architecture Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-django-setup-arch-2",
              "title": "URL Routing & View Handlers",
              "items": [
                {
                  "id": "django-setup-arch-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Request-Response Lifecycle & Views",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-setup-arch-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-setup-arch-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building URL Routes & View Controllers",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-setup-arch-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-setup-arch-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Views & Routing Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "django-templates-static",
          "title": "Django Templates & Static Files Setup",
          "description": "Click to view subtopics",
          "duration": "Django Template Language (DTL), Filters, Tags, Template Inheritance, Handling Static Files & Media Uploads",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-django-templates-static-1",
              "title": "DTL & Template Inheritance",
              "items": [
                {
                  "id": "django-templates-static-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Template Language Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building Base Layout & Dynamic Templates",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-templates-static-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DTL Syntax & Tags Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-django-templates-static-2",
              "title": "Static & Media Files Configuration",
              "items": [
                {
                  "id": "django-templates-static-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Handling Static Assets & User Media Uploads",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Image Upload & Media Files Gallery Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-templates-static-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Static Files Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "django-models-orm",
          "title": "Django Models & Database ORM",
          "description": "Click to view subtopics",
          "duration": "Model Fields, Relationships (OneToOne, ForeignKey, ManyToMany), Django ORM Queries, Migrations Management, Admin Interface Customization",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-django-models-orm-1",
              "title": "Model Fields & Relationships",
              "items": [
                {
                  "id": "django-models-orm-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django ORM Models & Relationships Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Designing E-Commerce Data Models",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-models-orm-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Models & Relationships Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-2",
              "title": "ORM Queries & Admin Customization",
              "items": [
                {
                  "id": "django-models-orm-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django ORM QuerySets & Admin Customization",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Advanced Database Queries & Admin Dashboard",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-models-orm-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django ORM Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "django-forms-auth",
          "title": "Django Forms, Authentication & Auth",
          "description": "Click to view subtopics",
          "duration": "Django Forms, ModelForms, CSRF Protection, User Authentication System (Login, Logout, Register), Permission Management",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-django-forms-auth-1",
              "title": "Django Forms & ModelForms",
              "items": [
                {
                  "id": "django-forms-auth-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Forms & CSRF Protection Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building Validated User Input Forms",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-forms-auth-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Forms Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-2",
              "title": "User Authentication & Permissions",
              "items": [
                {
                  "id": "django-forms-auth-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "User Auth System: Login, Logout & Register",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Role-Based User Permissions System",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "django-forms-auth-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Django Auth Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "drf-core",
          "title": "Django REST Framework (DRF) Core",
          "description": "Click to view subtopics",
          "duration": "REST API Architecture, DRF Setup, Serializers, ModelSerializers, Function & Class-Based Views (APIView, Generic Views)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-drf-core-1",
              "title": "REST Principles & Serializers",
              "items": [
                {
                  "id": "drf-core-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "RESTful API Architecture & DRF Serializers",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Building ModelSerializers for CRUD Operations",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "drf-core-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DRF Serializers Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-2",
              "title": "API Views & Generic Endpoints",
              "items": [
                {
                  "id": "drf-core-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "APIView & Generic Class-Based Views",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Creating RESTful API Endpoints Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "drf-core-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DRF Core Architecture Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "drf-advanced",
          "title": "DRF Advanced: ViewSets, JWT Auth & Testing",
          "description": "Click to view subtopics",
          "duration": "ViewSets, Routers, JWT Authentication (SimpleJWT), Permissions, Filtering, Pagination, API Testing with Postman & pytest",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-drf-advanced-1",
              "title": "ViewSets & JWT Authentication",
              "items": [
                {
                  "id": "drf-advanced-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ModelViewSets & SimpleJWT Auth Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "JWT Authentication API Integration Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "drf-advanced-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "JWT & ViewSets Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-2",
              "title": "Pagination, Filtering & Testing",
              "items": [
                {
                  "id": "drf-advanced-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Filtering, Pagination & API Testing with pytest",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Postman & pytest Automated API Suite",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "drf-advanced-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DRF Advanced Testing Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "redis-aws-s3",
          "title": "Redis Caching & AWS S3 Cloud Storage",
          "description": "Click to view subtopics",
          "duration": "Redis Installation, Caching Django Views/Queries, File Uploads, Cloud Storage Integration (AWS S3 / Cloudinary)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-redis-aws-s3-1",
              "title": "Redis Caching Integration",
              "items": [
                {
                  "id": "redis-aws-s3-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Redis In-Memory Caching for High Performance",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Django View Caching with Redis Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "redis-aws-s3-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Redis Caching Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-redis-aws-s3-2",
              "title": "AWS S3 & Cloud Storage Uploads",
              "items": [
                {
                  "id": "redis-aws-s3-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "AWS S3 Cloud Bucket Configuration",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "S3 Media Storage Integration Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "redis-aws-s3-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Cloud Storage & Uploads Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "dsa-python-1",
          "title": "Data Structures using Python - Part 1",
          "description": "Click to view subtopics",
          "duration": "Arrays, Matrix Operations, Linked Lists (Singly & Doubly), Stacks & Queues, Time & Space Complexity (Big-O Notation)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-dsa-python-1-1",
              "title": "Complexity & Linear Data Structures",
              "items": [
                {
                  "id": "dsa-python-1-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Big-O Analysis & Arrays vs Linked Lists",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-1-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-1-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Singly & Doubly Linked List Implementation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-1-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dsa-python-1-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Big-O & Linked Lists Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-1-2",
              "title": "Stacks & Queue Implementations",
              "items": [
                {
                  "id": "dsa-python-1-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Stacks & Queues Data Structures Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-1-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-1-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Stack-Based Expression Evaluation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-1-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dsa-python-1-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Linear Data Structures Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "dsa-python-2",
          "title": "Data Structures & Algorithms - Part 2",
          "description": "Click to view subtopics",
          "duration": "Trees (Binary Trees, BST Traversals), Recursion, Searching (Linear, Binary Search), Sorting Algorithms (Bubble, Quick, Merge Sort)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-dsa-python-2-1",
              "title": "Trees & BST Traversals",
              "items": [
                {
                  "id": "dsa-python-2-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Binary Search Trees & Traversal Algorithms",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-2-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-2-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "BST Search & Insertion Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-2-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dsa-python-2-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Binary Trees Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-2-2",
              "title": "Sorting & Searching Algorithms",
              "items": [
                {
                  "id": "dsa-python-2-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Quick Sort, Merge Sort & Binary Search",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-2-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-2-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Algorithmic Efficiency & Sorting Suite",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-2-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "dsa-python-2-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "DSA Part 2 Comprehensive Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "stage-3",
      "stageNumber": "STAGE 03",
      "phaseTag": "Phase 3 • Artificial Intelligence & Cloud",
      "title": "Stage 3: AI",
      "status": "AVAILABLE",
      "statusType": "available",
      "isLocked": false,
      "subtopics": [
        {
          "id": "ai-prompt-llm",
          "title": "Introduction to AI, Prompt Engineering & LLMs",
          "description": "Click to view subtopics",
          "duration": "What is AI/ML/DL/LLM, Generative AI Ecosystem, Google Gemini & OpenAI API Setup, Prompt Engineering Strategies & Few-Shot Prompting",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-ai-prompt-llm-1",
              "title": "Generative AI & LLM Ecosystem",
              "items": [
                {
                  "id": "ai-prompt-llm-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Intro to Generative AI & OpenAI/Gemini APIs",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-prompt-llm-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-prompt-llm-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Connecting Python to Gemini API Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-prompt-llm-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "ai-prompt-llm-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Generative AI Ecosystem Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-prompt-llm-2",
              "title": "Prompt Engineering Strategies",
              "items": [
                {
                  "id": "ai-prompt-llm-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Zero-Shot, Few-Shot & Chain-of-Thought Prompting",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-prompt-llm-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-prompt-llm-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Prompt Engineering Optimization Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-prompt-llm-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "ai-prompt-llm-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Prompt Engineering Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "ai-python-langchain",
          "title": "AI Integration with Python & LangChain",
          "description": "Click to view subtopics",
          "duration": "LangChain Framework Basics, Prompt Templates, Chains, Integrating OpenAI/Gemini APIs in Django Backend, Building Chatbots",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-ai-python-langchain-1",
              "title": "LangChain Basics & Prompt Templates",
              "items": [
                {
                  "id": "ai-python-langchain-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LangChain Framework & Prompt Pipelines",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "LangChain Chains Implementation Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "ai-python-langchain-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "LangChain Core Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-2",
              "title": "RAG Pipelines & AI Chatbots",
              "items": [
                {
                  "id": "ai-python-langchain-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Building RAG Chatbots with Django & Vector DBs",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Full-Stack AI Assistant Integration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "ai-python-langchain-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "LangChain & RAG Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "docker-cloud-deploy",
          "title": "Docker Containerization & Cloud Deployment",
          "description": "Click to view subtopics",
          "duration": "Docker Concepts, Dockerfile, Containerizing Django & Apps, Docker Compose, Deploying Full Stack App to Cloud (Render/AWS/Vercel)",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-docker-cloud-deploy-1",
              "title": "Docker Concepts & Dockerfiles",
              "items": [
                {
                  "id": "docker-cloud-deploy-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Docker Fundamentals & Containerization",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Dockerizing Full-Stack Python App Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "docker-cloud-deploy-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Docker Core Concepts Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-docker-cloud-deploy-2",
              "title": "Docker Compose & Production Cloud Deploy",
              "items": [
                {
                  "id": "docker-cloud-deploy-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Docker Compose & Cloud Deployment Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Deploying Full Stack App to Render/AWS",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "docker-cloud-deploy-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Cloud Container Deployment Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "stage-4",
      "stageNumber": "STAGE 04",
      "phaseTag": "Phase 4 • Industry Placement & Portfolio",
      "title": "Stage 4: Career Launchpad",
      "status": "LOCKED",
      "statusType": "locked",
      "isLocked": true,
      "subtopics": [
        {
          "id": "sys-design-arch",
          "title": "System Design & Software Architecture",
          "description": "Click to view subtopics",
          "duration": "System Design Fundamentals, High-Level vs Low-Level Design, Load Balancing, Database Sharding, Caching Strategies, Scalable Web Architecture",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-sys-design-arch-1",
              "title": "High-Level Design (HLD) Principles",
              "items": [
                {
                  "id": "sys-design-arch-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "System Design Fundamentals & HLD Architecture",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sys-design-arch-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sys-design-arch-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Designing Scalable System Architecture Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sys-design-arch-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "sys-design-arch-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "System Design HLD Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-sys-design-arch-2",
              "title": "Low-Level Design & Caching",
              "items": [
                {
                  "id": "sys-design-arch-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Load Balancing, Database Sharding & Caching",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sys-design-arch-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sys-design-arch-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Microservices & Database Sharding Simulation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sys-design-arch-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "sys-design-arch-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Scalable Software Architecture Evaluation",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "capstone-review-1",
          "title": "Capstone Project Mentoring & Review - 1",
          "description": "Click to view subtopics",
          "duration": "Project Scope Finalization, Architecture Validation, Database Design Review, API Contract Definition",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-capstone-review-1-1",
              "title": "Project Scope & Database Design",
              "items": [
                {
                  "id": "capstone-review-1-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Capstone Proposal & Schema Design Review",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-review-1-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-review-1-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Database ER Diagram & Architecture Specs",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-review-1-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "capstone-review-1-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Capstone Phase 1 Milestones Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-review-1-2",
              "title": "API Contracts & Setup Validation",
              "items": [
                {
                  "id": "capstone-review-1-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "API Contracts & Backend Architecture Sign-off",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-review-1-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-review-1-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "API Endpoints Mocking & Contract Testing",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-review-1-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "capstone-review-1-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Capstone Architecture Readiness Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "capstone-review-2",
          "title": "Capstone Project Development & Mentoring - 2",
          "description": "Click to view subtopics",
          "duration": "Frontend-Backend Integration, AI Feature Tuning, Bug Fixing, Security Auditing, Performance Optimization",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-capstone-review-2-1",
              "title": "Full-Stack Integration & AI Tuning",
              "items": [
                {
                  "id": "capstone-review-2-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Frontend-Backend Integration & AI Mentoring",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-review-2-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-review-2-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Connecting React UI with DRF APIs & Gemini AI",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-review-2-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "capstone-review-2-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Integration & AI Verification Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-review-2-2",
              "title": "Security Audit & Live Demo",
              "items": [
                {
                  "id": "capstone-review-2-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Security Audit, Bug Fixing & Code Refactoring",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-review-2-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-review-2-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Production Build & Final Demo Recording",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-review-2-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "capstone-review-2-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Capstone Completion Audit",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "resume-portfolio",
          "title": "Resume Building, LinkedIn & GitHub Portfolio",
          "description": "Click to view subtopics",
          "duration": "Creating ATS-Compliant Resume, GitHub Repository Presentation, README Design, LinkedIn Profile Optimization & Branding",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-resume-portfolio-1",
              "title": "ATS Resume & GitHub Branding",
              "items": [
                {
                  "id": "resume-portfolio-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ATS-Compliant Resume & GitHub Presentation",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Crafting Developer Resume & README Showcase",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "resume-portfolio-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "ATS Resume Best Practices Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-resume-portfolio-2",
              "title": "LinkedIn Optimization & Personal Branding",
              "items": [
                {
                  "id": "resume-portfolio-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LinkedIn Branding & Portfolio Showcase Workshop",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Publishing Developer Portfolio & Profile",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "resume-portfolio-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Personal Branding Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "mock-interviews",
          "title": "Mock Technical Interviews & Valedictory",
          "description": "Click to view subtopics",
          "duration": "Technical Coding Practice, DSA Live Problem Solving, HR Interview Prep, Capstone Project Demonstrations & Certification",
          "modulesCount": 2,
          "modules": [
            {
              "id": "mod-mock-interviews-1",
              "title": "DSA Coding & System Design Interviews",
              "items": [
                {
                  "id": "mock-interviews-m1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "1-on-1 Mock Technical Coding Interview",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Live Problem Solving & Whiteboarding",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "mock-interviews-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Technical Interview Readiness Check",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            },
            {
              "id": "mod-mock-interviews-2",
              "title": "HR Interview & Valedictory Ceremony",
              "items": [
                {
                  "id": "mock-interviews-m2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "HR Interview Prep & Graduation Ceremony",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Capstone Project Final Presentation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "mock-interviews-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Full-Stack Certification Award",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
