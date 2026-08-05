export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  INSTRUCTOR: 'Instructor'
};

export const PERMISSION_LIST = [
  { id: 'manage_users', name: 'User & Staff Management', category: 'Administration' },
  { id: 'manage_roles', name: 'Role & Permissions Matrix', category: 'Administration' },
  { id: 'create_course', name: 'Create & Publish Courses', category: 'Course Management' },
  { id: 'delete_course', name: 'Delete Courses', category: 'Course Management' },
  { id: 'create_assessment', name: 'Create & Publish Assessments', category: 'Assessments' },
  { id: 'delete_assessment', name: 'Delete Assessments', category: 'Assessments' },
  { id: 'manage_live_sessions', name: 'Manage Live Class Links', category: 'Live Sessions' },
  { id: 'manage_jobs', name: 'Post & Sync Job Openings', category: 'Job Portal' },
  { id: 'manage_recordings', name: 'Upload Video Recordings', category: 'Library' },
  { id: 'manage_placement', name: 'Manage Placement Content', category: 'Placement Prep' },
  { id: 'inspect_api_feed', name: 'Student LMS API Feed Sync', category: 'System Integration' }
];

export const INITIAL_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: PERMISSION_LIST.map(p => p.id),
  [ROLES.ADMIN]: [
    'create_course',
    'delete_course',
    'create_assessment',
    'delete_assessment',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'manage_placement',
    'inspect_api_feed'
  ],
  [ROLES.MANAGER]: [
    'create_course',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'inspect_api_feed'
  ],
  [ROLES.INSTRUCTOR]: [
    'create_course',
    'create_assessment',
    'manage_live_sessions',
    'manage_recordings',
    'inspect_api_feed'
  ]
};

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Sarah Connor',
    email: 'sarah.admin@aspirelms.io',
    role: ROLES.SUPER_ADMIN,
    department: 'Executive Leadership',
    status: 'Active',
    joinedDate: '2025-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@aspirelms.io',
    role: ROLES.ADMIN,
    department: 'Curriculum Operations',
    status: 'Active',
    joinedDate: '2025-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Priya Sharma',
    email: 'priya.s@aspirelms.io',
    role: ROLES.MANAGER,
    department: 'Engineering Training',
    status: 'Active',
    joinedDate: '2025-03-10',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'David Chen',
    email: 'david.chen@aspirelms.io',
    role: ROLES.INSTRUCTOR,
    department: 'Frontend Systems',
    status: 'Active',
    joinedDate: '2025-03-22',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COURSES = [
  {
    id: 'crs-101',
    title: 'Full-Stack React & Node.js Mastery',
    category: 'Web Development',
    level: 'Intermediate',
    instructor: 'David Chen',
    publishStatus: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 342,
    rating: 4.9,
    description: 'Master modern full-stack web applications with React 18, Tailwind CSS, Express, and PostgreSQL.',
    topics: [
      {
        id: 'top-1',
        title: 'React 18 Concurrent Features & Hooks',
        liveClasses: 3,
        practice: 5,
        assessments: 2
      },
      {
        id: 'top-2',
        title: 'State Management with Context & Redux Toolkit',
        liveClasses: 2,
        practice: 4,
        assessments: 1
      },
      {
        id: 'top-3',
        title: 'REST API & GraphQL Backend Integration',
        liveClasses: 4,
        practice: 6,
        assessments: 2
      }
    ]
  },
  {
    id: 'crs-102',
    title: 'Cloud Architecture & DevOps Essentials',
    category: 'Cloud & Infrastructure',
    level: 'Advanced',
    instructor: 'Alex Rivera',
    publishStatus: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 218,
    rating: 4.8,
    description: 'Learn Docker containerization, Kubernetes orchestration, AWS Cloud infra, and automated CI/CD pipelines.',
    topics: [
      {
        id: 'top-4',
        title: 'Containerizing Apps with Docker Multi-Stage Builds',
        liveClasses: 2,
        practice: 3,
        assessments: 1
      },
      {
        id: 'top-5',
        title: 'Kubernetes Cluster Deployment & HPA',
        liveClasses: 3,
        practice: 5,
        assessments: 2
      }
    ]
  },
  {
    id: 'crs-103',
    title: 'Data Structures & System Design for Tech Interviews',
    category: 'Computer Science',
    level: 'All Levels',
    instructor: 'Priya Sharma',
    publishStatus: 'Published',
    thumbnail: 'https://images.unsplash.com/photo-1516116211223-4c7141467477?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 520,
    rating: 4.95,
    description: 'Comprehensive preparation for high-frequency DSA patterns, microservice architecture, and high scalability design.',
    topics: [
      {
        id: 'top-6',
        title: 'Dynamic Programming & Graph Algorithms',
        liveClasses: 5,
        practice: 12,
        assessments: 3
      },
      {
        id: 'top-7',
        title: 'Distributed Caching & Load Balancing Architecture',
        liveClasses: 3,
        practice: 4,
        assessments: 2
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'asm-1',
    title: 'React Hooks & State Architecture Evaluation',
    courseId: 'crs-101',
    courseName: 'Full-Stack React & Node.js Mastery',
    topicId: 'top-1',
    topicName: 'React 18 Concurrent Features & Hooks',
    durationMinutes: 45,
    totalMarks: 100,
    mcqCount: 5,
    codingCount: 1,
    status: 'Active',
    publishStatus: 'Published',
    dueDate: '2026-08-10',
    mcqs: [
      {
        question: 'Which React hook should be used to memoize expensive calculation values?',
        options: ['useCallback', 'useMemo', 'useEffect', 'useRef'],
        correctIndex: 1
      }
    ],
    codingQuestions: [
      {
        title: 'Custom `useLocalStorage` Hook Implementation',
        description: 'Write a React custom hook named `useLocalStorage` that syncs state updates to window.localStorage with error handling.',
        starterCode: 'function useLocalStorage(key, initialValue) {\n  // Implement logic here\n}'
      }
    ]
  },
  {
    id: 'asm-2',
    title: 'Docker & Microservices Deployment Quiz',
    courseId: 'crs-102',
    courseName: 'Cloud Architecture & DevOps Essentials',
    topicId: 'top-4',
    topicName: 'Containerizing Apps with Docker Multi-Stage Builds',
    durationMinutes: 30,
    totalMarks: 50,
    mcqCount: 4,
    codingCount: 1,
    status: 'Active',
    publishStatus: 'Published',
    dueDate: '2026-08-12',
    mcqs: [
      {
        question: 'Which Docker command creates an image layer optimization?',
        options: ['docker build --no-cache', 'Multi-stage dockerfile FROM instructions', 'docker run -d', 'docker commit'],
        correctIndex: 1
      }
    ],
    codingQuestions: [
      {
        title: 'Multi-stage Dockerfile for Node App',
        description: 'Write a multi-stage Dockerfile that builds a React application and serves static files using Nginx alpine image.',
        starterCode: 'FROM node:18-alpine AS builder\n# Add your steps'
      }
    ]
  }
];

export const INITIAL_LIVE_SESSIONS = [
  {
    id: 'sess-1',
    programName: 'Senior Engineering Cohort #4',
    technology: 'React 18 & TypeScript',
    sessionTitle: 'Deep Dive into React Server Components & Micro-frontends',
    date: '2026-08-05',
    time: '18:00 - 19:30 EST',
    meetingLink: 'https://meet.google.com/aspire-lms-live-1',
    status: 'Live Soon',
    publishStatus: 'Published to Student LMS',
    instructor: 'David Chen',
    description: 'Interactive session building scalable micro-frontend architectures with Webpack Module Federation and React Server Components.'
  },
  {
    id: 'sess-2',
    programName: 'Cloud Infrastructure Mastery',
    technology: 'AWS & Kubernetes',
    sessionTitle: 'Zero-Downtime Blue/Green Deployments on AWS EKS',
    date: '2026-08-06',
    time: '14:00 - 15:30 EST',
    meetingLink: 'https://meet.google.com/aspire-lms-live-2',
    status: 'Upcoming',
    publishStatus: 'Published to Student LMS',
    instructor: 'Alex Rivera',
    description: 'Hands-on live lab configuring ingress controllers, Prometheus monitoring, and automated canary deployments.'
  },
  {
    id: 'sess-3',
    programName: 'Career Accelerator Series',
    technology: 'System Design',
    sessionTitle: 'High Throughput Architecture: Designing Twitter/X Newsfeed',
    date: '2026-08-03',
    time: '19:00 - 20:30 EST',
    meetingLink: 'https://meet.google.com/aspire-lms-live-3',
    status: 'Completed',
    publishStatus: 'Published to Student LMS',
    instructor: 'Priya Sharma',
    description: 'Comprehensive breakdown of Fan-out on Write vs Fan-out on Read strategy, Redis caching patterns, and database sharding.'
  }
];

export const INITIAL_JOBS = [
  {
    id: 'job-1',
    company: 'Stripe',
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    jobType: 'Full-Time / Remote',
    salary: '₹16,50,000 - ₹22,00,000 / yr',
    location: 'Bengaluru / Hyderabad (Remote)',
    postedDate: '2026-08-01',
    publishStatus: 'Live Feed',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80',
    description: 'Looking for a Senior Frontend Developer to lead dashboard user experience, high performance component libraries, and checkout widget architecture.'
  },
  {
    id: 'job-2',
    company: 'Datadog',
    jobTitle: 'Full-Stack Software Engineer',
    jobType: 'Full-Time',
    salary: '₹14,00,000 - ₹18,00,000 / yr',
    location: 'Bengaluru, KA',
    postedDate: '2026-08-02',
    publishStatus: 'Live Feed',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    description: 'Join our telemetry dashboard squad building real-time monitoring charts, distributed log visualizers, and node graph analytics.'
  },
  {
    id: 'job-3',
    company: 'Vercel',
    jobTitle: 'Developer Relations & Educator',
    jobType: 'Contract / Remote',
    salary: '₹12,00,000 - ₹16,00,000 / yr',
    location: 'Remote India',
    postedDate: '2026-07-28',
    publishStatus: 'Live Feed',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    description: 'Create world-class technical guides, interactive sample applications, and conduct webinars on Next.js performance optimizations.'
  }
];

export const INITIAL_RECORDINGS = [
  {
    id: 'rec-1',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=80',
    title: 'Advanced React State Management Masterclass',
    conceptName: 'Zustand vs Redux Toolkit vs Context',
    duration: '1h 45m',
    instructor: 'David Chen',
    publishStatus: 'Available in Student Library',
    postedDate: '2026-07-25',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'An in-depth comparative architectural analysis of global state solutions in high-scale single page applications.',
    instructions: '1. Clone the starter code repo\n2. Run `npm install` and review the baseline context file\n3. Complete the exercise in branch `exercise-01`.'
  },
  {
    id: 'rec-2',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    title: 'Building CI/CD Pipelines with GitHub Actions',
    conceptName: 'Automated Testing & AWS ECS Deployments',
    duration: '2h 10m',
    instructor: 'Alex Rivera',
    publishStatus: 'Available in Student Library',
    postedDate: '2026-07-20',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Step-by-step walk-through setting up secure GitHub secrets, matrix builds, automated Cypress end-to-end tests, and zero-downtime ECS updates.',
    instructions: 'Make sure you have AWS CLI installed locally and configured with IAM read/write credentials before running script exercises.'
  }
];

export const INITIAL_PLACEMENT_RESOURCES = [
  {
    id: 'plc-1',
    category: 'Interview Tips',
    title: 'Cracking the FAANG Technical Interview: Behavioral STAR Method',
    type: 'Guide',
    author: 'Career Success Team',
    publishStatus: 'Published',
    readTime: '10 min read',
    snippet: 'Master how to frame complex engineering challenges, conflict resolutions, and project ownership using the STAR technique.',
    linkUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'plc-2',
    category: 'Coding Practice',
    title: 'Top 75 High-Frequency LeetCode Patterns Cheatsheet',
    type: 'Cheatsheet',
    author: 'David Chen',
    publishStatus: 'Published',
    readTime: '15 min read',
    snippet: 'Categorized list of Two Pointers, Sliding Window, Fast & Slow Pointers, Backtracking, and Dynamic Programming templates.',
    linkUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

export const MOCK_ACTIVITIES = [
  { id: 'act-1', text: 'Sarah Connor updated role permissions for Admin role', time: '10 mins ago', type: 'security' },
  { id: 'act-2', text: 'David Chen published new Live Class Link: "React Server Components"', time: '45 mins ago', type: 'session' },
  { id: 'act-3', text: 'Alex Rivera synced new job opening: "Senior Frontend Engineer at Stripe"', time: '2 hours ago', type: 'job' },
  { id: 'act-4', text: 'Priya Sharma published recording: "System Design: Rate Limiter"', time: '1 day ago', type: 'library' }
];

export const API_FEED_STATUS = {
  status: 'Connected & Syncing',
  endpoint: 'https://api.aspirelms.io/v1/student-feed',
  lastSynced: '2 mins ago',
  totalCoursesLive: 3,
  liveClassesActive: 3,
  jobPostingsLive: 3,
  recordingsPublished: 2
};
