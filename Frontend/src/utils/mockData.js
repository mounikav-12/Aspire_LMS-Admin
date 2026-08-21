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
  { id: 'manage_badges', name: 'Badges', category: 'Live & Placement' },
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
    'manage_badges',
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
    'manage_badges',
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
    'manage_badges',
    'inspect_api_feed'
  ]
};

export const INITIAL_BADGES = [];

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
>>>>>>> origin/manohar

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

export const INITIAL_COURSES = [];

export const INITIAL_ASSESSMENTS = [];

export const INITIAL_LIVE_SESSIONS = [];

export const INITIAL_JOBS = [];

export const INITIAL_RECORDINGS = [];

export const INITIAL_PLACEMENT_RESOURCES = [];

export const INITIAL_PROJECTS = [];

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

export const INITIAL_CODING_QUESTIONS = [];

export const INITIAL_MILESTONES = {
  overview: {
    trackTitle: "Python full stack + DSA with AI",
    headline: "Master core engineering fundamentals, advanced AI models, full-stack frameworks, and real-world project deployments.",
    completedCount: 0,
    totalCount: 0,
    unlockedLevel: 1,
    completionPercentage: 0
  },
  stages: []
};
