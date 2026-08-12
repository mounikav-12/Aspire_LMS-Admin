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
  { id: 'manage_projects', name: 'Manage Real-World Projects', category: 'Projects Portal' },
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
    'manage_projects',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'manage_placement',
    'inspect_api_feed'
  ],
  [ROLES.MANAGER]: [
    'create_course',
    'manage_projects',
    'manage_live_sessions',
    'manage_jobs',
    'manage_recordings',
    'inspect_api_feed'
  ],
  [ROLES.INSTRUCTOR]: [
    'create_course',
    'create_assessment',
    'manage_projects',
    'manage_live_sessions',
    'manage_recordings',
    'inspect_api_feed'
  ]
};

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    email: 'aspireAdmin@gmail.com',
    password: 'password@123',
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

export const INITIAL_STUDENTS = [
  // 5 Weekday Batch Students (Registration IDs: A26WXXXX)
  {
    id: 'std-w1',
    registrationId: 'A26W0001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    batch: 'Weekday Batch',
    status: 'Active',
    joinedDate: '2026-01-10',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-101', 'crs-103'],
    unlockedStages: ['stg-1', 'stg-2']
  },
  {
    id: 'std-w2',
    registrationId: 'A26W0002',
    name: 'Ananya Verma',
    email: 'ananya.verma@gmail.com',
    batch: 'Weekday Batch',
    status: 'Active',
    joinedDate: '2026-01-12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-101'],
    unlockedStages: ['stg-1', 'stg-2', 'stg-3']
  },
  {
    id: 'std-w3',
    registrationId: 'A26W0003',
    name: 'Vikram Patel',
    email: 'vikram.patel@gmail.com',
    batch: 'Weekday Batch',
    status: 'Active',
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-101', 'crs-102'],
    unlockedStages: ['stg-1']
  },
  {
    id: 'std-w4',
    registrationId: 'A26W0004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    batch: 'Weekday Batch',
    status: 'Active',
    joinedDate: '2026-01-18',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-101'],
    unlockedStages: ['stg-1', 'stg-2']
  },
  {
    id: 'std-w5',
    registrationId: 'A26W0005',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@gmail.com',
    batch: 'Weekday Batch',
    status: 'Active',
    joinedDate: '2026-01-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-101', 'crs-103'],
    unlockedStages: ['stg-1']
  },

  // 5 Weekend Batch Students (Registration IDs: A26SXXXX)
  {
    id: 'std-s1',
    registrationId: 'A26S0001',
    name: 'Karthik Nair',
    email: 'karthik.nair@gmail.com',
    batch: 'Weekend Batch',
    status: 'Active',
    joinedDate: '2026-01-11',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-102'],
    unlockedStages: ['stg-1', 'stg-2']
  },
  {
    id: 'std-s2',
    registrationId: 'A26S0002',
    name: 'Meera Iyer',
    email: 'meera.iyer@gmail.com',
    batch: 'Weekend Batch',
    status: 'Active',
    joinedDate: '2026-01-14',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-102', 'crs-103'],
    unlockedStages: ['stg-1']
  },
  {
    id: 'std-s3',
    registrationId: 'A26S0003',
    name: 'Aditya Kulkarni',
    email: 'aditya.kulkarni@gmail.com',
    batch: 'Weekend Batch',
    status: 'Active',
    joinedDate: '2026-01-16',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-102'],
    unlockedStages: ['stg-1', 'stg-2']
  },
  {
    id: 'std-s4',
    registrationId: 'A26S0004',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@gmail.com',
    batch: 'Weekend Batch',
    status: 'Active',
    joinedDate: '2026-01-19',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-102', 'crs-101'],
    unlockedStages: ['stg-1']
  },
  {
    id: 'std-s5',
    registrationId: 'A26S0005',
    name: 'Siddharth Joshi',
    email: 'siddharth.joshi@gmail.com',
    batch: 'Weekend Batch',
    status: 'Active',
    joinedDate: '2026-01-22',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    enrolledCourses: ['crs-102'],
    unlockedStages: ['stg-1']
  }
];

export const INITIAL_COURSES = [
  {
    id: 'crs-python-ai',
    title: 'Python Full Stack + DSA with AI',
    category: 'Web Development',
    level: 'Comprehensive',
    instructor: 'Senior Engineering Team',
    publishStatus: 'Published',
    targetBatch: 'All Batches',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 480,
    rating: 4.95,
    description: 'Master core engineering fundamentals, Python backend with Django & FastAPI, Data Structures & Algorithms, modern frontend, and real-world AI integrations.',
    topics: [
      {
        id: 'top-p1',
        title: 'Stage 1: Front End + Repository (Git & Web Architecture)',
        liveClasses: 31,
        practice: 45,
        assessments: 12
      },
      {
        id: 'top-p2',
        title: 'Stage 2: Backend + DSA (Python, SQL, Django & Algorithms)',
        liveClasses: 81,
        practice: 110,
        assessments: 25
      },
      {
        id: 'top-p3',
        title: 'Stage 3: AI & Cloud Integration (LangChain, Prompt Engineering & Docker)',
        liveClasses: 17,
        practice: 25,
        assessments: 8
      },
      {
        id: 'top-p4',
        title: 'Stage 4: Career Launchpad (System Design, Capstone & Mock Interviews)',
        liveClasses: 23,
        practice: 30,
        assessments: 10
      }
    ]
  },
  {
    id: 'crs-101',
    title: 'Full-Stack React & Node.js Mastery',
    category: 'Web Development',
    level: 'Intermediate',
    instructor: 'David Chen',
    publishStatus: 'Published',
    targetBatch: 'All Batches',
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
    mcqCount: 3,
    codingCount: 1,
    status: 'Active',
    publishStatus: 'Published',
    dueDate: '2026-08-10',
    mcqs: [
      {
        question: 'Which React hook should be used to memoize expensive calculation values?',
        options: ['useCallback', 'useMemo', 'useEffect', 'useRef'],
        correctIndex: 1
      },
      {
        question: 'What is the primary purpose of React.useCallback?',
        options: ['Memoize function instances between renders', 'Create persistent DOM references', 'Manage async side-effects', 'Trigger synchronous re-renders'],
        correctIndex: 0
      },
      {
        question: 'Which hook should be used for imperative DOM manipulations that require layout measurement?',
        options: ['useTransition', 'useDeferredValue', 'useLayoutEffect', 'useImperativeHandle'],
        correctIndex: 2
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
    mcqCount: 2,
    codingCount: 1,
    status: 'Active',
    publishStatus: 'Published',
    dueDate: '2026-08-12',
    mcqs: [
      {
        question: 'Which Docker command creates an image layer optimization?',
        options: ['docker build --no-cache', 'Multi-stage dockerfile FROM instructions', 'docker run -d', 'docker commit'],
        correctIndex: 1
      },
      {
        question: 'What is the default isolation mechanism used by Docker containers?',
        options: ['Virtual Machines', 'Linux Namespaces and cgroups', 'Chroot Jail', 'Hyper-V Partition'],
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

export const INITIAL_PROJECTS = [
  {
    id: 'proj-101',
    title: 'E-commerce Platform',
    type: 'Capstone',
    category: 'Full-Stack Web Dev',
    difficulty: 'Advanced',
    description: 'Build a complete e-commerce platform with cart, checkout, and admin dashboard.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    dueDate: 'Due Aug 20',
    dueDateRaw: '2026-08-20',
    assignedCount: 1,
    submittedCount: 1,
    feedbackCount: 1,
    avgGrade: 89,
    status: 'Published',
    templateUrl: 'https://github.com/aspire-lms/ecommerce-starter',
    guidelines: 'Ensure unit test coverage is above 80%. Include deployment instructions in README.',
    submissions: [
      {
        id: 'sub-101',
        studentName: 'Aarav Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        submittedAt: '2026-08-05',
        repoUrl: 'https://github.com/aarav-sharma/ecommerce-capstone',
        liveDemoUrl: 'https://ecommerce-aarav.vercel.app',
        grade: 89,
        status: 'Graded',
        mentorFeedback: 'Great cart implementation, clean state management, and clear documentation!'
      }
    ]
  },
  {
    id: 'proj-102',
    title: 'AI Customer Support Chatbot',
    type: 'Major',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    description: 'Develop an intelligent support agent powered by OpenAI GPT-4, vector embeddings, and React.',
    techStack: ['Python', 'OpenAI', 'LangChain', 'React'],
    dueDate: 'Due Aug 28',
    dueDateRaw: '2026-08-28',
    assignedCount: 42,
    submittedCount: 28,
    feedbackCount: 20,
    avgGrade: 92,
    status: 'Published',
    templateUrl: 'https://github.com/aspire-lms/ai-chatbot-starter',
    guidelines: 'Integrate pinecone vector database for context retrieval. Provide fallback responses.',
    submissions: [
      {
        id: 'sub-102',
        studentName: 'Priya Verma',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        submittedAt: '2026-08-04',
        repoUrl: 'https://github.com/priya-v/ai-chatbot',
        liveDemoUrl: 'https://ai-support-demo.vercel.app',
        grade: 92,
        status: 'Graded',
        mentorFeedback: 'Excellent prompt engineering and error handling in edge cases.'
      }
    ]
  },
  {
    id: 'proj-103',
    title: 'Real-Time Financial Dashboard',
    type: 'Mini',
    category: 'Frontend Systems',
    difficulty: 'Intermediate',
    description: 'Create a high-performance live trading & analytics dashboard with WebSockets and Tailwind CSS.',
    techStack: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    dueDate: 'Due Sep 05',
    dueDateRaw: '2026-09-05',
    assignedCount: 65,
    submittedCount: 14,
    feedbackCount: 10,
    avgGrade: 85,
    status: 'Published',
    templateUrl: 'https://github.com/aspire-lms/analytics-starter',
    guidelines: 'Implement smooth charting rendering without layout shifts during fast market data stream.',
    submissions: []
  },
  {
    id: 'proj-104',
    title: 'Microservices Auth & API Gateway',
    type: 'Major',
    category: 'Backend & DevOps',
    difficulty: 'Advanced',
    description: 'Architect a scalable JWT auth service and rate-limited API Gateway using Redis, Docker, and Express.',
    techStack: ['Node.js', 'Redis', 'Docker', 'JWT'],
    dueDate: 'Due Sep 15',
    dueDateRaw: '2026-09-15',
    assignedCount: 30,
    submittedCount: 5,
    feedbackCount: 2,
    avgGrade: 95,
    status: 'Draft',
    templateUrl: 'https://github.com/aspire-lms/microservices-starter',
    guidelines: 'Provide docker-compose.yml file to spin up all services seamlessly with one command.',
    submissions: []
  }
];

export const INITIAL_CODING_QUESTIONS = [
  {
    id: 'cq-101',
    title: 'Two Sum Algorithm',
    category: 'Algorithms & Data Structures',
    difficulty: 'Easy',
    marks: 20,
    timeLimitMinutes: 15,
    language: 'JavaScript',
    courseId: 'course-101',
    tags: ['Arrays', 'Hash Map', 'LeetCode'],
    problemStatement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
    inputFormat: 'nums = [2, 7, 11, 15], target = 9',
    outputFormat: '[0, 1]',
    sampleTestCases: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  return [];\n}`,
    solutionCode: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    createdDate: '2026-08-01',
    postedBy: 'Admin Console'
  },
  {
    id: 'cq-102',
    title: 'Custom useLocalStorage React Hook',
    category: 'React & Frontend Engineering',
    difficulty: 'Medium',
    marks: 30,
    timeLimitMinutes: 25,
    language: 'TypeScript',
    courseId: 'course-101',
    tags: ['React', 'Hooks', 'Web Storage'],
    problemStatement: 'Create a custom React hook named `useLocalStorage<T>(key: string, initialValue: T)` that persists state to `window.localStorage` and gracefully handles JSON serialization errors.',
    inputFormat: 'key = "user_theme", initialValue = "dark"',
    outputFormat: '[storedValue, setValue]',
    sampleTestCases: [
      {
        input: 'useLocalStorage("theme", "light")',
        output: '["light", Function]',
        explanation: 'Returns stored value or initial value if key does not exist.'
      }
    ],
    starterCode: `import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  // Implement custom hook\n}`,
    solutionCode: `import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    try {\n      const item = localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (e) {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n    } catch (e) {}\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}`,
    createdDate: '2026-08-03',
    postedBy: 'Alex Rivera'
  },
  {
    id: 'cq-103',
    title: 'LRU Cache Design',
    category: 'Backend & System Design',
    difficulty: 'Hard',
    marks: 50,
    timeLimitMinutes: 40,
    language: 'JavaScript',
    courseId: 'course-102',
    tags: ['Data Structures', 'HashMap', 'Doubly LinkedList'],
    problemStatement: 'Design and implement a data structure for Least Recently Used (LRU) cache. It should support get and put operations in O(1) time complexity.',
    inputFormat: 'LRUCache(capacity = 2)',
    outputFormat: 'get(key) returns value or -1',
    sampleTestCases: [
      {
        input: 'put(1, 1), put(2, 2), get(1), put(3, 3), get(2)',
        output: '1, -1',
        explanation: 'get(2) returns -1 because key 2 was evicted when key 3 was inserted.'
      }
    ],
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n\n  get(key) {\n    // Implement get\n  }\n\n  put(key, value) {\n    // Implement put\n  }\n}`,
    solutionCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) {\n      this.map.delete(key);\n    } else if (this.map.size >= this.capacity) {\n      const firstKey = this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n    this.map.set(key, value);\n  }\n}`,
    createdDate: '2026-08-05',
    postedBy: 'David Chen'
  }
];

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
      "phaseTag": "Phase 1 \u2022 Frontend & Version Control",
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-git-github-1",
              "title": "Session 1: Git Architecture & Core Concepts",
              "items": [
                {
                  "id": "git-github-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Git Architecture & Core Concepts Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "git-github-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Git Architecture & Core Concepts",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-git-github-2",
              "title": "Session 2: Core Git Commands & Three-Tree State",
              "items": [
                {
                  "id": "git-github-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Core Git Commands & Three-Tree State Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "git-github-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Core Git Commands & Three-Tree State",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-git-github-3",
              "title": "Session 3: Remote Repositories & Syncing",
              "items": [
                {
                  "id": "git-github-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Remote Repositories & Syncing Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "git-github-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Remote Repositories & Syncing",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-git-github-4",
              "title": "Session 4: Branching Strategies & Merging",
              "items": [
                {
                  "id": "git-github-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Branching Strategies & Merging Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "git-github-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Branching Strategies & Merging",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-git-github-5",
              "title": "Session 5: Merge Conflicts, PRs & Collaboration",
              "items": [
                {
                  "id": "git-github-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Merge Conflicts, PRs & Collaboration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-git-github-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "git-github-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Merge Conflicts, PRs & Collaboration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-html5-web-arch-1",
              "title": "Session 1: Web Architecture & Client-Server Model",
              "items": [
                {
                  "id": "html5-web-arch-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Web Architecture & Client-Server Model Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Web Architecture & Client-Server Model",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-2",
              "title": "Session 2: HTML5 Document Structure & Meta Tags",
              "items": [
                {
                  "id": "html5-web-arch-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "HTML5 Document Structure & Meta Tags Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: HTML5 Document Structure & Meta Tags",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-3",
              "title": "Session 3: Text Formatting, Lists & Hyperlinks",
              "items": [
                {
                  "id": "html5-web-arch-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Text Formatting, Lists & Hyperlinks Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Text Formatting, Lists & Hyperlinks",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-4",
              "title": "Session 4: Working with Media & Embedded Elements",
              "items": [
                {
                  "id": "html5-web-arch-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Working with Media & Embedded Elements Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Working with Media & Embedded Elements",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-5",
              "title": "Session 5: Semantic HTML5 Layouts & Tables",
              "items": [
                {
                  "id": "html5-web-arch-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Semantic HTML5 Layouts & Tables Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Semantic HTML5 Layouts & Tables",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-html5-web-arch-6",
              "title": "Session 6: HTML5 Forms, Validation & Accessibility",
              "items": [
                {
                  "id": "html5-web-arch-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "HTML5 Forms, Validation & Accessibility Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-html5-web-arch-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "html5-web-arch-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: HTML5 Forms, Validation & Accessibility",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/html5-web-arch-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-css3-box-model-1",
              "title": "Session 1: CSS3 Syntax & Inclusion Methods",
              "items": [
                {
                  "id": "css3-box-model-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS3 Syntax & Inclusion Methods Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: CSS3 Syntax & Inclusion Methods",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-css3-box-model-2",
              "title": "Session 2: Selectors, Combinators & Specificity Rules",
              "items": [
                {
                  "id": "css3-box-model-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Selectors, Combinators & Specificity Rules Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Selectors, Combinators & Specificity Rules",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-css3-box-model-3",
              "title": "Session 3: Pseudo-Classes & Pseudo-Elements",
              "items": [
                {
                  "id": "css3-box-model-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Pseudo-Classes & Pseudo-Elements Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Pseudo-Classes & Pseudo-Elements",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-css3-box-model-4",
              "title": "Session 4: CSS Box Model & Sizing Mechanics",
              "items": [
                {
                  "id": "css3-box-model-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS Box Model & Sizing Mechanics Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: CSS Box Model & Sizing Mechanics",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-css3-box-model-5",
              "title": "Session 5: Typography & Background Styling",
              "items": [
                {
                  "id": "css3-box-model-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Typography & Background Styling Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-css3-box-model-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "css3-box-model-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Typography & Background Styling",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/css3-box-model-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-advanced-css-responsive-1",
              "title": "Session 1: CSS Display, Positioning & Stacking Context",
              "items": [
                {
                  "id": "advanced-css-responsive-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS Display, Positioning & Stacking Context Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: CSS Display, Positioning & Stacking Context",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-css-responsive-2",
              "title": "Session 2: Flexbox Container Properties & Alignment",
              "items": [
                {
                  "id": "advanced-css-responsive-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Flexbox Container Properties & Alignment Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Flexbox Container Properties & Alignment",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-css-responsive-3",
              "title": "Session 3: Flexbox Item Properties & Layout Patterns",
              "items": [
                {
                  "id": "advanced-css-responsive-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Flexbox Item Properties & Layout Patterns Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Flexbox Item Properties & Layout Patterns",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-css-responsive-4",
              "title": "Session 4: CSS Grid System & Template Areas",
              "items": [
                {
                  "id": "advanced-css-responsive-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "CSS Grid System & Template Areas Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: CSS Grid System & Template Areas",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-css-responsive-5",
              "title": "Session 5: Mobile-First Responsive Design & Media Queries",
              "items": [
                {
                  "id": "advanced-css-responsive-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Mobile-First Responsive Design & Media Queries Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-css-responsive-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-css-responsive-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Mobile-First Responsive Design & Media Queries",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-css-responsive-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 4,
          "modules": [
            {
              "id": "mod-bootstrap-5-1",
              "title": "Session 1: Bootstrap 5 Setup & Grid Architecture",
              "items": [
                {
                  "id": "bootstrap-5-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Bootstrap 5 Setup & Grid Architecture Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Bootstrap 5 Setup & Grid Architecture",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-bootstrap-5-2",
              "title": "Session 2: Utility Classes & Responsive Spacing",
              "items": [
                {
                  "id": "bootstrap-5-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Utility Classes & Responsive Spacing Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Utility Classes & Responsive Spacing",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-bootstrap-5-3",
              "title": "Session 3: Core UI Components (Navbar, Cards, Modals)",
              "items": [
                {
                  "id": "bootstrap-5-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Core UI Components (Navbar, Cards, Modals) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Core UI Components (Navbar, Cards, Modals)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-bootstrap-5-4",
              "title": "Session 4: Interactive JS Components & Customization",
              "items": [
                {
                  "id": "bootstrap-5-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Interactive JS Components & Customization Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-bootstrap-5-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "bootstrap-5-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Interactive JS Components & Customization",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/bootstrap-5-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-js-essentials-1",
              "title": "Session 1: JS Execution Context, Variables & Hoisting",
              "items": [
                {
                  "id": "js-essentials-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "JS Execution Context, Variables & Hoisting Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: JS Execution Context, Variables & Hoisting",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-essentials-2",
              "title": "Session 2: Primitive Data Types & Type Conversion",
              "items": [
                {
                  "id": "js-essentials-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Primitive Data Types & Type Conversion Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Primitive Data Types & Type Conversion",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-essentials-3",
              "title": "Session 3: Operators & Expressions",
              "items": [
                {
                  "id": "js-essentials-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Operators & Expressions Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Operators & Expressions",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-essentials-4",
              "title": "Session 4: Control Flow (if-else, switch & Guard Clauses)",
              "items": [
                {
                  "id": "js-essentials-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Control Flow (if-else, switch & Guard Clauses) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Control Flow (if-else, switch & Guard Clauses)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-essentials-5",
              "title": "Session 5: Iteration & Loop Structures",
              "items": [
                {
                  "id": "js-essentials-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Iteration & Loop Structures Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-essentials-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-essentials-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Iteration & Loop Structures",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-essentials-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-js-functions-objects-1",
              "title": "Session 1: Function Declarations, Expressions & Scope",
              "items": [
                {
                  "id": "js-functions-objects-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Function Declarations, Expressions & Scope Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Function Declarations, Expressions & Scope",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-2",
              "title": "Session 2: Arrow Functions & Lexical Scope",
              "items": [
                {
                  "id": "js-functions-objects-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Arrow Functions & Lexical Scope Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Arrow Functions & Lexical Scope",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-3",
              "title": "Session 3: Array Fundamentals & Mutating Methods",
              "items": [
                {
                  "id": "js-functions-objects-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Array Fundamentals & Mutating Methods Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Array Fundamentals & Mutating Methods",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-4",
              "title": "Session 4: Advanced Array Higher-Order Functions",
              "items": [
                {
                  "id": "js-functions-objects-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Advanced Array Higher-Order Functions Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Advanced Array Higher-Order Functions",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-5",
              "title": "Session 5: Object Literals & Property Access",
              "items": [
                {
                  "id": "js-functions-objects-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Object Literals & Property Access Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Object Literals & Property Access",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-js-functions-objects-6",
              "title": "Session 6: Advanced Object Manipulation & Cloning",
              "items": [
                {
                  "id": "js-functions-objects-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Advanced Object Manipulation & Cloning Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-js-functions-objects-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "js-functions-objects-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Advanced Object Manipulation & Cloning",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/js-functions-objects-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-dom-events-1",
              "title": "Session 1: DOM Tree & Element Selection",
              "items": [
                {
                  "id": "dom-events-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DOM Tree & Element Selection Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DOM Tree & Element Selection",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dom-events-2",
              "title": "Session 2: Modifying Content, Styles & Attributes",
              "items": [
                {
                  "id": "dom-events-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Modifying Content, Styles & Attributes Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Modifying Content, Styles & Attributes",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dom-events-3",
              "title": "Session 3: Creating & Removing Nodes",
              "items": [
                {
                  "id": "dom-events-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Creating & Removing Nodes Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Creating & Removing Nodes",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dom-events-4",
              "title": "Session 4: Event Listeners & Common Event Handling",
              "items": [
                {
                  "id": "dom-events-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Event Listeners & Common Event Handling Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Event Listeners & Common Event Handling",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dom-events-5",
              "title": "Session 5: Event Propagation & Event Delegation",
              "items": [
                {
                  "id": "dom-events-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Event Propagation & Event Delegation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dom-events-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dom-events-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Event Propagation & Event Delegation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dom-events-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-es6-async-js-1",
              "title": "Session 1: ES6 Destructuring & Spread/Rest Operators",
              "items": [
                {
                  "id": "es6-async-js-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ES6 Destructuring & Spread/Rest Operators Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: ES6 Destructuring & Spread/Rest Operators",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-es6-async-js-2",
              "title": "Session 2: ES Modules (Import / Export)",
              "items": [
                {
                  "id": "es6-async-js-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ES Modules (Import / Export) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: ES Modules (Import / Export)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-es6-async-js-3",
              "title": "Session 3: Asynchronous JS & Event Loop",
              "items": [
                {
                  "id": "es6-async-js-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Asynchronous JS & Event Loop Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Asynchronous JS & Event Loop",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-es6-async-js-4",
              "title": "Session 4: JavaScript Promises & Error Handling",
              "items": [
                {
                  "id": "es6-async-js-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "JavaScript Promises & Error Handling Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: JavaScript Promises & Error Handling",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-es6-async-js-5",
              "title": "Session 5: Async/Await & Fetch API Integration",
              "items": [
                {
                  "id": "es6-async-js-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Async/Await & Fetch API Integration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-es6-async-js-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "es6-async-js-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Async/Await & Fetch API Integration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/es6-async-js-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
      "phaseTag": "Phase 2 \u2022 Backend Systems & DSA",
      "title": "Stage 2: Backend + DSA",
      "status": "LOCKED",
      "statusType": "locked",
      "isLocked": true,
      "subtopics": [
        {
          "id": "python-fundamentals",
          "title": "Python Programming Fundamentals",
          "description": "Click to view subtopics",
          "duration": "Python Setup, Variables, Data Types, Control Flow, Functions, Variable Scope, Built-in Data Structures (Lists, Tuples, Sets, Dicts)",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-python-fundamentals-1",
              "title": "Session 1: Python Setup, Interpreter & Syntax Rules",
              "items": [
                {
                  "id": "python-fundamentals-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Python Setup, Interpreter & Syntax Rules Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Python Setup, Interpreter & Syntax Rules",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-fundamentals-2",
              "title": "Session 2: Variables, Data Types & Type Casting",
              "items": [
                {
                  "id": "python-fundamentals-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Variables, Data Types & Type Casting Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Variables, Data Types & Type Casting",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-fundamentals-3",
              "title": "Session 3: Operators & Expressions",
              "items": [
                {
                  "id": "python-fundamentals-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Operators & Expressions Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Operators & Expressions",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-fundamentals-4",
              "title": "Session 4: Control Flow & Loop Structures",
              "items": [
                {
                  "id": "python-fundamentals-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Control Flow & Loop Structures Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Control Flow & Loop Structures",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-fundamentals-5",
              "title": "Session 5: Functions, Arguments & Scope Rules",
              "items": [
                {
                  "id": "python-fundamentals-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Functions, Arguments & Scope Rules Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Functions, Arguments & Scope Rules",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-fundamentals-6",
              "title": "Session 6: Built-in Data Structures (Lists, Tuples, Sets, Dicts)",
              "items": [
                {
                  "id": "python-fundamentals-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Built-in Data Structures (Lists, Tuples, Sets, Dicts) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-fundamentals-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-fundamentals-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Built-in Data Structures (Lists, Tuples, Sets, Dicts)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-fundamentals-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "advanced-python-exceptions",
          "title": "Advanced Python & Exception Handling",
          "description": "Click to view subtopics",
          "duration": "Decorators, Generators, Iterators, File I/O, Error Handling (try-except-finally), Context Managers, Custom Exceptions",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-advanced-python-exceptions-1",
              "title": "Session 1: Advanced Functions, Lambda & HOFs",
              "items": [
                {
                  "id": "advanced-python-exceptions-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Advanced Functions, Lambda & HOFs Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-python-exceptions-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-python-exceptions-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Advanced Functions, Lambda & HOFs",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-python-exceptions-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-python-exceptions-2",
              "title": "Session 2: Python Decorators & Metaprogramming",
              "items": [
                {
                  "id": "advanced-python-exceptions-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Python Decorators & Metaprogramming Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-python-exceptions-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-python-exceptions-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Python Decorators & Metaprogramming",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-python-exceptions-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-python-exceptions-3",
              "title": "Session 3: Generators & Iterators",
              "items": [
                {
                  "id": "advanced-python-exceptions-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Generators & Iterators Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-python-exceptions-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-python-exceptions-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Generators & Iterators",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-python-exceptions-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-python-exceptions-4",
              "title": "Session 4: Exception Handling & Custom Exceptions",
              "items": [
                {
                  "id": "advanced-python-exceptions-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Exception Handling & Custom Exceptions Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-python-exceptions-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-python-exceptions-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Exception Handling & Custom Exceptions",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-python-exceptions-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-python-exceptions-5",
              "title": "Session 5: File I/O & Context Managers",
              "items": [
                {
                  "id": "advanced-python-exceptions-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "File I/O & Context Managers Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-python-exceptions-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-python-exceptions-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: File I/O & Context Managers",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-python-exceptions-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "python-oop",
          "title": "Object-Oriented Programming (OOP)",
          "description": "Click to view subtopics",
          "duration": "Classes, Objects, Constructors (__init__), Inheritance, Polymorphism, Encapsulation, Abstraction, Dunder Methods",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-python-oop-1",
              "title": "Session 1: OOP Principles, Classes & Instance Creation",
              "items": [
                {
                  "id": "python-oop-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "OOP Principles, Classes & Instance Creation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: OOP Principles, Classes & Instance Creation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-oop-2",
              "title": "Session 2: Attributes, Methods & Dunder Methods",
              "items": [
                {
                  "id": "python-oop-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Attributes, Methods & Dunder Methods Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Attributes, Methods & Dunder Methods",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-oop-3",
              "title": "Session 3: Encapsulation & Property Decorators",
              "items": [
                {
                  "id": "python-oop-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Encapsulation & Property Decorators Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Encapsulation & Property Decorators",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-oop-4",
              "title": "Session 4: Inheritance & Super Function",
              "items": [
                {
                  "id": "python-oop-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Inheritance & Super Function Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Inheritance & Super Function",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-oop-5",
              "title": "Session 5: Polymorphism & Operator Overloading",
              "items": [
                {
                  "id": "python-oop-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Polymorphism & Operator Overloading Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Polymorphism & Operator Overloading",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-python-oop-6",
              "title": "Session 6: Abstraction & Abstract Base Classes",
              "items": [
                {
                  "id": "python-oop-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Abstraction & Abstract Base Classes Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-python-oop-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "python-oop-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Abstraction & Abstract Base Classes",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/python-oop-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "sql-mysql-relational",
          "title": "SQL & Relational Databases (MySQL)",
          "description": "Click to view subtopics",
          "duration": "RDBMS Concepts, SQL DDL (CREATE, ALTER), DML (INSERT, UPDATE, DELETE), Select Queries, Filtering, Aggregations, GROUP BY",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-sql-mysql-relational-1",
              "title": "Session 1: RDBMS Concepts & Database Setup",
              "items": [
                {
                  "id": "sql-mysql-relational-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "RDBMS Concepts & Database Setup Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: RDBMS Concepts & Database Setup",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-relational-2",
              "title": "Session 2: Data Definition Language (DDL Commands)",
              "items": [
                {
                  "id": "sql-mysql-relational-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Data Definition Language (DDL Commands) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Data Definition Language (DDL Commands)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-relational-3",
              "title": "Session 3: Table Constraints & Foreign Key Rules",
              "items": [
                {
                  "id": "sql-mysql-relational-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Table Constraints & Foreign Key Rules Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Table Constraints & Foreign Key Rules",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-relational-4",
              "title": "Session 4: Data Manipulation Language (DML Commands)",
              "items": [
                {
                  "id": "sql-mysql-relational-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Data Manipulation Language (DML Commands) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Data Manipulation Language (DML Commands)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-relational-5",
              "title": "Session 5: Filtering, Sorting & Pattern Matching",
              "items": [
                {
                  "id": "sql-mysql-relational-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Filtering, Sorting & Pattern Matching Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Filtering, Sorting & Pattern Matching",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-sql-mysql-relational-6",
              "title": "Session 6: SQL Aggregations & Grouping",
              "items": [
                {
                  "id": "sql-mysql-relational-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "SQL Aggregations & Grouping Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-sql-mysql-relational-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "sql-mysql-relational-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: SQL Aggregations & Grouping",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/sql-mysql-relational-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "advanced-sql-postgresql",
          "title": "Advanced SQL & PostgreSQL Integration",
          "description": "Click to view subtopics",
          "duration": "SQL Joins (Inner, Left, Right, Full), Subqueries, Indexing, Transactions (ACID), Foreign Keys, PostgreSQL Setup & Commands",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-advanced-sql-postgresql-1",
              "title": "Session 1: SQL Joins (Inner, Outer, Self Joins)",
              "items": [
                {
                  "id": "advanced-sql-postgresql-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "SQL Joins (Inner, Outer, Self Joins) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-sql-postgresql-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-sql-postgresql-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: SQL Joins (Inner, Outer, Self Joins)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-sql-postgresql-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-sql-postgresql-2",
              "title": "Session 2: Subqueries & Common Table Expressions",
              "items": [
                {
                  "id": "advanced-sql-postgresql-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Subqueries & Common Table Expressions Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-sql-postgresql-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-sql-postgresql-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Subqueries & Common Table Expressions",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-sql-postgresql-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-sql-postgresql-3",
              "title": "Session 3: Database Indexing & Query Optimization",
              "items": [
                {
                  "id": "advanced-sql-postgresql-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Database Indexing & Query Optimization Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-sql-postgresql-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-sql-postgresql-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Database Indexing & Query Optimization",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-sql-postgresql-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-sql-postgresql-4",
              "title": "Session 4: Database Transactions & ACID Compliance",
              "items": [
                {
                  "id": "advanced-sql-postgresql-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Database Transactions & ACID Compliance Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-sql-postgresql-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-sql-postgresql-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Database Transactions & ACID Compliance",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-sql-postgresql-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-advanced-sql-postgresql-5",
              "title": "Session 5: PostgreSQL Setup & Python Integration",
              "items": [
                {
                  "id": "advanced-sql-postgresql-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "PostgreSQL Setup & Python Integration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-advanced-sql-postgresql-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "advanced-sql-postgresql-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: PostgreSQL Setup & Python Integration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/advanced-sql-postgresql-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "django-architecture",
          "title": "Django Framework Setup & Architecture",
          "description": "Click to view subtopics",
          "duration": "MVT Architecture, Creating Django Projects/Apps, Directory Structure, Settings Configuration, Request-Response Lifecycle, Views & Routing",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-django-architecture-1",
              "title": "Session 1: Web Frameworks & MVT Architecture",
              "items": [
                {
                  "id": "django-architecture-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Web Frameworks & MVT Architecture Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-architecture-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-architecture-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Web Frameworks & MVT Architecture",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-architecture-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-architecture-2",
              "title": "Session 2: Creating Django Projects & Directory Analysis",
              "items": [
                {
                  "id": "django-architecture-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Creating Django Projects & Directory Analysis Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-architecture-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-architecture-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Creating Django Projects & Directory Analysis",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-architecture-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-architecture-3",
              "title": "Session 3: Creating & Registering Django Apps",
              "items": [
                {
                  "id": "django-architecture-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Creating & Registering Django Apps Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-architecture-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-architecture-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Creating & Registering Django Apps",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-architecture-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-architecture-4",
              "title": "Session 4: URL Routing & Request-Response Lifecycle",
              "items": [
                {
                  "id": "django-architecture-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "URL Routing & Request-Response Lifecycle Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-architecture-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-architecture-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: URL Routing & Request-Response Lifecycle",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-architecture-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-architecture-5",
              "title": "Session 5: Function-Based Views (FBVs) & Responses",
              "items": [
                {
                  "id": "django-architecture-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Function-Based Views (FBVs) & Responses Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-architecture-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-architecture-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Function-Based Views (FBVs) & Responses",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-architecture-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-django-templates-static-1",
              "title": "Session 1: Django Template Engine Configuration",
              "items": [
                {
                  "id": "django-templates-static-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Template Engine Configuration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django Template Engine Configuration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-templates-static-2",
              "title": "Session 2: DTL Syntax, Variables & Tags",
              "items": [
                {
                  "id": "django-templates-static-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DTL Syntax, Variables & Tags Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DTL Syntax, Variables & Tags",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-templates-static-3",
              "title": "Session 3: DTL Control Flow & Loops",
              "items": [
                {
                  "id": "django-templates-static-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DTL Control Flow & Loops Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DTL Control Flow & Loops",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-templates-static-4",
              "title": "Session 4: Template Filters & Custom Filters",
              "items": [
                {
                  "id": "django-templates-static-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Template Filters & Custom Filters Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Template Filters & Custom Filters",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-templates-static-5",
              "title": "Session 5: Template Inheritance & Static/Media Setup",
              "items": [
                {
                  "id": "django-templates-static-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Template Inheritance & Static/Media Setup Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-templates-static-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-templates-static-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Template Inheritance & Static/Media Setup",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-templates-static-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-django-models-orm-1",
              "title": "Session 1: Defining Models & Field Types",
              "items": [
                {
                  "id": "django-models-orm-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Defining Models & Field Types Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Defining Models & Field Types",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-2",
              "title": "Session 2: Field Options & Model String Representation",
              "items": [
                {
                  "id": "django-models-orm-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Field Options & Model String Representation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Field Options & Model String Representation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-3",
              "title": "Session 3: Model Relationships (ForeignKey, OneToOne, ManyToMany)",
              "items": [
                {
                  "id": "django-models-orm-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Model Relationships (ForeignKey, OneToOne, ManyToMany) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Model Relationships (ForeignKey, OneToOne, ManyToMany)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-4",
              "title": "Session 4: Django Migrations Management",
              "items": [
                {
                  "id": "django-models-orm-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Migrations Management Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django Migrations Management",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-5",
              "title": "Session 5: Django ORM QuerySet API Basics",
              "items": [
                {
                  "id": "django-models-orm-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django ORM QuerySet API Basics Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django ORM QuerySet API Basics",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-models-orm-6",
              "title": "Session 6: Advanced ORM Lookups, Aggregations & Admin",
              "items": [
                {
                  "id": "django-models-orm-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Advanced ORM Lookups, Aggregations & Admin Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-models-orm-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-models-orm-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Advanced ORM Lookups, Aggregations & Admin",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-models-orm-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-django-forms-auth-1",
              "title": "Session 1: Django Forms & Validation",
              "items": [
                {
                  "id": "django-forms-auth-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Forms & Validation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django Forms & Validation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-2",
              "title": "Session 2: ModelForms & Data Binding",
              "items": [
                {
                  "id": "django-forms-auth-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ModelForms & Data Binding Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: ModelForms & Data Binding",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-3",
              "title": "Session 3: Custom Form Validation & CSRF Protection",
              "items": [
                {
                  "id": "django-forms-auth-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Custom Form Validation & CSRF Protection Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Custom Form Validation & CSRF Protection",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-4",
              "title": "Session 4: Django Built-in User Authentication",
              "items": [
                {
                  "id": "django-forms-auth-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django Built-in User Authentication Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django Built-in User Authentication",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-5",
              "title": "Session 5: Authentication Views & Password Reset",
              "items": [
                {
                  "id": "django-forms-auth-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Authentication Views & Password Reset Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Authentication Views & Password Reset",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-django-forms-auth-6",
              "title": "Session 6: User Permissions, Groups & Custom User Models",
              "items": [
                {
                  "id": "django-forms-auth-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "User Permissions, Groups & Custom User Models Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-django-forms-auth-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "django-forms-auth-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: User Permissions, Groups & Custom User Models",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/django-forms-auth-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-drf-core-1",
              "title": "Session 1: REST API Principles & HTTP Methods",
              "items": [
                {
                  "id": "drf-core-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "REST API Principles & HTTP Methods Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: REST API Principles & HTTP Methods",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-2",
              "title": "Session 2: DRF Serializers & Data Conversion",
              "items": [
                {
                  "id": "drf-core-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DRF Serializers & Data Conversion Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DRF Serializers & Data Conversion",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-3",
              "title": "Session 3: DRF ModelSerializers & Nested Serialization",
              "items": [
                {
                  "id": "drf-core-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DRF ModelSerializers & Nested Serialization Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DRF ModelSerializers & Nested Serialization",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-4",
              "title": "Session 4: Function-Based API Views (@api_view)",
              "items": [
                {
                  "id": "drf-core-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Function-Based API Views (@api_view) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Function-Based API Views (@api_view)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-5",
              "title": "Session 5: Class-Based API Views (APIView)",
              "items": [
                {
                  "id": "drf-core-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Class-Based API Views (APIView) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Class-Based API Views (APIView)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-core-6",
              "title": "Session 6: Generic Views & DRF Mixins",
              "items": [
                {
                  "id": "drf-core-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Generic Views & DRF Mixins Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-core-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-core-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Generic Views & DRF Mixins",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-core-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "drf-advanced-jwt-testing",
          "title": "DRF Advanced: ViewSets, JWT Auth & Testing",
          "description": "Click to view subtopics",
          "duration": "ViewSets, Routers, JWT Authentication (SimpleJWT), Permissions, Filtering, Pagination, API Testing with Postman & pytest",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-drf-advanced-jwt-testing-1",
              "title": "Session 1: ViewSets & Routers Architecture",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ViewSets & Routers Architecture Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: ViewSets & Routers Architecture",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-jwt-testing-2",
              "title": "Session 2: DRF Token Authentication",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DRF Token Authentication Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DRF Token Authentication",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-jwt-testing-3",
              "title": "Session 3: JWT Authentication & Token Refresh",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "JWT Authentication & Token Refresh Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: JWT Authentication & Token Refresh",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-jwt-testing-4",
              "title": "Session 4: DRF Permissions & Custom Permission Classes",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "DRF Permissions & Custom Permission Classes Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: DRF Permissions & Custom Permission Classes",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-jwt-testing-5",
              "title": "Session 5: API Filtering, Search, Ordering & Pagination",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "API Filtering, Search, Ordering & Pagination Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: API Filtering, Search, Ordering & Pagination",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-drf-advanced-jwt-testing-6",
              "title": "Session 6: Automated API Testing & Postman Documentation",
              "items": [
                {
                  "id": "drf-advanced-jwt-testing-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Automated API Testing & Postman Documentation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-drf-advanced-jwt-testing-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "drf-advanced-jwt-testing-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Automated API Testing & Postman Documentation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/drf-advanced-jwt-testing-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-redis-aws-s3-1",
              "title": "Session 1: Caching Fundamentals & Redis Setup",
              "items": [
                {
                  "id": "redis-aws-s3-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Caching Fundamentals & Redis Setup Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Caching Fundamentals & Redis Setup",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-redis-aws-s3-2",
              "title": "Session 2: Connecting Django to Redis Cache",
              "items": [
                {
                  "id": "redis-aws-s3-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Connecting Django to Redis Cache Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Connecting Django to Redis Cache",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-redis-aws-s3-3",
              "title": "Session 3: View Caching & Low-Level Cache API",
              "items": [
                {
                  "id": "redis-aws-s3-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "View Caching & Low-Level Cache API Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: View Caching & Low-Level Cache API",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-redis-aws-s3-4",
              "title": "Session 4: AWS S3 Cloud Storage Configuration",
              "items": [
                {
                  "id": "redis-aws-s3-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "AWS S3 Cloud Storage Configuration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: AWS S3 Cloud Storage Configuration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-redis-aws-s3-5",
              "title": "Session 5: Integrating AWS S3 for Django Media Uploads",
              "items": [
                {
                  "id": "redis-aws-s3-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Integrating AWS S3 for Django Media Uploads Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-redis-aws-s3-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "redis-aws-s3-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Integrating AWS S3 for Django Media Uploads",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/redis-aws-s3-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "dsa-python-part1",
          "title": "Data Structures using Python - Part 1",
          "description": "Click to view subtopics",
          "duration": "Arrays, Matrix Operations, Linked Lists (Singly & Doubly), Stacks & Queues, Time & Space Complexity (Big-O Notation)",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-dsa-python-part1-1",
              "title": "Session 1: Algorithm Analysis & Big-O Complexity",
              "items": [
                {
                  "id": "dsa-python-part1-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Algorithm Analysis & Big-O Complexity Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Algorithm Analysis & Big-O Complexity",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part1-2",
              "title": "Session 2: Dynamic Arrays & Memory Allocation",
              "items": [
                {
                  "id": "dsa-python-part1-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Dynamic Arrays & Memory Allocation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Dynamic Arrays & Memory Allocation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part1-3",
              "title": "Session 3: 2D Arrays & Matrix Manipulation",
              "items": [
                {
                  "id": "dsa-python-part1-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "2D Arrays & Matrix Manipulation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: 2D Arrays & Matrix Manipulation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part1-4",
              "title": "Session 4: Singly Linked Lists Implementation",
              "items": [
                {
                  "id": "dsa-python-part1-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Singly Linked Lists Implementation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Singly Linked Lists Implementation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part1-5",
              "title": "Session 5: Doubly & Circular Linked Lists",
              "items": [
                {
                  "id": "dsa-python-part1-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Doubly & Circular Linked Lists Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Doubly & Circular Linked Lists",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part1-6",
              "title": "Session 6: Stacks & Queues Implementation",
              "items": [
                {
                  "id": "dsa-python-part1-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Stacks & Queues Implementation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part1-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part1-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Stacks & Queues Implementation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part1-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "dsa-python-part2",
          "title": "Data Structures & Algorithms - Part 2",
          "description": "Click to view subtopics",
          "duration": "Trees (Binary Trees, BST Traversals), Recursion, Searching (Linear, Binary Search), Sorting Algorithms (Bubble, Quick, Merge Sort)",
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-dsa-python-part2-1",
              "title": "Session 1: Recursion & Call Stack Analysis",
              "items": [
                {
                  "id": "dsa-python-part2-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Recursion & Call Stack Analysis Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Recursion & Call Stack Analysis",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part2-2",
              "title": "Session 2: Searching Algorithms (Linear & Binary Search)",
              "items": [
                {
                  "id": "dsa-python-part2-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Searching Algorithms (Linear & Binary Search) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Searching Algorithms (Linear & Binary Search)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part2-3",
              "title": "Session 3: Elementary Sorting (Bubble, Selection, Insertion)",
              "items": [
                {
                  "id": "dsa-python-part2-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Elementary Sorting (Bubble, Selection, Insertion) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Elementary Sorting (Bubble, Selection, Insertion)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part2-4",
              "title": "Session 4: Divide-and-Conquer Sorting (Merge & Quick Sort)",
              "items": [
                {
                  "id": "dsa-python-part2-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Divide-and-Conquer Sorting (Merge & Quick Sort) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Divide-and-Conquer Sorting (Merge & Quick Sort)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part2-5",
              "title": "Session 5: Binary Trees & Tree Traversals",
              "items": [
                {
                  "id": "dsa-python-part2-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Binary Trees & Tree Traversals Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Binary Trees & Tree Traversals",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-dsa-python-part2-6",
              "title": "Session 6: Binary Search Trees (BST) Operations",
              "items": [
                {
                  "id": "dsa-python-part2-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Binary Search Trees (BST) Operations Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-dsa-python-part2-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "dsa-python-part2-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Binary Search Trees (BST) Operations",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/dsa-python-part2-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
      "phaseTag": "Phase 3 \u2022 Artificial Intelligence & Cloud",
      "title": "Stage 3: AI",
      "status": "LOCKED",
      "statusType": "locked",
      "isLocked": true,
      "subtopics": [
        {
          "id": "intro-ai-llms",
          "title": "Introduction to AI, Prompt Engineering & LLMs",
          "description": "Click to view subtopics",
          "duration": "What is AI/ML/DL/LLM, Generative AI Ecosystem, Google Gemini & OpenAI API Setup, Prompt Engineering Strategies & Few-Shot Prompting",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-intro-ai-llms-1",
              "title": "Session 1: AI, ML, DL & LLM Fundamentals",
              "items": [
                {
                  "id": "intro-ai-llms-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "AI, ML, DL & LLM Fundamentals Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-intro-ai-llms-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "intro-ai-llms-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: AI, ML, DL & LLM Fundamentals",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/intro-ai-llms-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-intro-ai-llms-2",
              "title": "Session 2: Generative AI Ecosystem & Model Selection",
              "items": [
                {
                  "id": "intro-ai-llms-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Generative AI Ecosystem & Model Selection Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-intro-ai-llms-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "intro-ai-llms-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Generative AI Ecosystem & Model Selection",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/intro-ai-llms-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-intro-ai-llms-3",
              "title": "Session 3: Gemini & OpenAI API Setup",
              "items": [
                {
                  "id": "intro-ai-llms-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Gemini & OpenAI API Setup Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-intro-ai-llms-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "intro-ai-llms-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Gemini & OpenAI API Setup",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/intro-ai-llms-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-intro-ai-llms-4",
              "title": "Session 4: Prompt Engineering Core Principles",
              "items": [
                {
                  "id": "intro-ai-llms-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Prompt Engineering Core Principles Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-intro-ai-llms-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "intro-ai-llms-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Prompt Engineering Core Principles",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/intro-ai-llms-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-intro-ai-llms-5",
              "title": "Session 5: Advanced Prompting (Few-Shot & Chain-of-Thought)",
              "items": [
                {
                  "id": "intro-ai-llms-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Advanced Prompting (Few-Shot & Chain-of-Thought) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-intro-ai-llms-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "intro-ai-llms-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Advanced Prompting (Few-Shot & Chain-of-Thought)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/intro-ai-llms-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 6,
          "modules": [
            {
              "id": "mod-ai-python-langchain-1",
              "title": "Session 1: LangChain Framework Architecture",
              "items": [
                {
                  "id": "ai-python-langchain-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LangChain Framework Architecture Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: LangChain Framework Architecture",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-2",
              "title": "Session 2: LangChain Prompt Templates & Parsers",
              "items": [
                {
                  "id": "ai-python-langchain-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LangChain Prompt Templates & Parsers Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: LangChain Prompt Templates & Parsers",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-3",
              "title": "Session 3: LangChain Expression Language (LCEL)",
              "items": [
                {
                  "id": "ai-python-langchain-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LangChain Expression Language (LCEL) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: LangChain Expression Language (LCEL)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-4",
              "title": "Session 4: Conversation Memory Systems",
              "items": [
                {
                  "id": "ai-python-langchain-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Conversation Memory Systems Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Conversation Memory Systems",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-5",
              "title": "Session 5: Django REST Framework AI Endpoint Integration",
              "items": [
                {
                  "id": "ai-python-langchain-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Django REST Framework AI Endpoint Integration Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Django REST Framework AI Endpoint Integration",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-ai-python-langchain-6",
              "title": "Session 6: Building Real-Time AI Chatbot Interface",
              "items": [
                {
                  "id": "ai-python-langchain-s6-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Building Real-Time AI Chatbot Interface Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-ai-python-langchain-s6",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "ai-python-langchain-s6-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Building Real-Time AI Chatbot Interface",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/ai-python-langchain-s6",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-docker-cloud-deploy-1",
              "title": "Session 1: Containerization vs Virtualization Fundamentals",
              "items": [
                {
                  "id": "docker-cloud-deploy-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Containerization vs Virtualization Fundamentals Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Containerization vs Virtualization Fundamentals",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-docker-cloud-deploy-2",
              "title": "Session 2: Writing Dockerfiles for Django Apps",
              "items": [
                {
                  "id": "docker-cloud-deploy-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Writing Dockerfiles for Django Apps Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Writing Dockerfiles for Django Apps",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-docker-cloud-deploy-3",
              "title": "Session 3: Building & Running Docker Containers",
              "items": [
                {
                  "id": "docker-cloud-deploy-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Building & Running Docker Containers Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Building & Running Docker Containers",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-docker-cloud-deploy-4",
              "title": "Session 4: Multi-Container Orchestration with Docker Compose",
              "items": [
                {
                  "id": "docker-cloud-deploy-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Multi-Container Orchestration with Docker Compose Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Multi-Container Orchestration with Docker Compose",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-docker-cloud-deploy-5",
              "title": "Session 5: Cloud Deployment to Render / AWS / Vercel",
              "items": [
                {
                  "id": "docker-cloud-deploy-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Cloud Deployment to Render / AWS / Vercel Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-docker-cloud-deploy-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "docker-cloud-deploy-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Cloud Deployment to Render / AWS / Vercel",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/docker-cloud-deploy-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
      "phaseTag": "Phase 4 \u2022 Capstone & Career Placement",
      "title": "Stage 4: Career Launchpad",
      "status": "LOCKED",
      "statusType": "locked",
      "isLocked": true,
      "subtopics": [
        {
          "id": "system-design-architecture",
          "title": "System Design & Software Architecture",
          "description": "Click to view subtopics",
          "duration": "System Design Fundamentals, High-Level vs Low-Level Design, Load Balancing, Database Sharding, Caching Strategies, Scalable Web Architecture",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-system-design-architecture-1",
              "title": "Session 1: Scalability & High Availability Fundamentals",
              "items": [
                {
                  "id": "system-design-architecture-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Scalability & High Availability Fundamentals Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-system-design-architecture-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "system-design-architecture-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Scalability & High Availability Fundamentals",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/system-design-architecture-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-system-design-architecture-2",
              "title": "Session 2: Load Balancing & API Gateways",
              "items": [
                {
                  "id": "system-design-architecture-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Load Balancing & API Gateways Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-system-design-architecture-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "system-design-architecture-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Load Balancing & API Gateways",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/system-design-architecture-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-system-design-architecture-3",
              "title": "Session 3: Database Scaling & Sharding Strategies",
              "items": [
                {
                  "id": "system-design-architecture-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Database Scaling & Sharding Strategies Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-system-design-architecture-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "system-design-architecture-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Database Scaling & Sharding Strategies",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/system-design-architecture-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-system-design-architecture-4",
              "title": "Session 4: Distributed Caching & Message Queues",
              "items": [
                {
                  "id": "system-design-architecture-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Distributed Caching & Message Queues Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-system-design-architecture-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "system-design-architecture-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Distributed Caching & Message Queues",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/system-design-architecture-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-system-design-architecture-5",
              "title": "Session 5: Object-Oriented Low-Level Design (LLD)",
              "items": [
                {
                  "id": "system-design-architecture-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Object-Oriented Low-Level Design (LLD) Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-system-design-architecture-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "system-design-architecture-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Object-Oriented Low-Level Design (LLD)",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/system-design-architecture-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "capstone-mentoring-1",
          "title": "Capstone Project Mentoring & Review - 1",
          "description": "Click to view subtopics",
          "duration": "Project Scope Finalization, Architecture Validation, Database Design Review, API Contract Definition",
          "modulesCount": 4,
          "modules": [
            {
              "id": "mod-capstone-mentoring-1-1",
              "title": "Session 1: Project Scope & PRD Finalization",
              "items": [
                {
                  "id": "capstone-mentoring-1-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Project Scope & PRD Finalization Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-1-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-1-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Project Scope & PRD Finalization",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-1-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-1-2",
              "title": "Session 2: Database Schema & ER Diagram Review",
              "items": [
                {
                  "id": "capstone-mentoring-1-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Database Schema & ER Diagram Review Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-1-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-1-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Database Schema & ER Diagram Review",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-1-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-1-3",
              "title": "Session 3: REST API Contract & Tech Stack Definition",
              "items": [
                {
                  "id": "capstone-mentoring-1-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "REST API Contract & Tech Stack Definition Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-1-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-1-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: REST API Contract & Tech Stack Definition",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-1-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-1-4",
              "title": "Session 4: Sprint 1 MVP Development Review",
              "items": [
                {
                  "id": "capstone-mentoring-1-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Sprint 1 MVP Development Review Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-1-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-1-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Sprint 1 MVP Development Review",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-1-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        },
        {
          "id": "capstone-mentoring-2",
          "title": "Capstone Project Development & Mentoring - 2",
          "description": "Click to view subtopics",
          "duration": "Frontend-Backend Integration, AI Feature Tuning, Bug Fixing, Security Auditing, Performance Optimization",
          "modulesCount": 5,
          "modules": [
            {
              "id": "mod-capstone-mentoring-2-1",
              "title": "Session 1: Backend API & Authentication Mentoring",
              "items": [
                {
                  "id": "capstone-mentoring-2-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Backend API & Authentication Mentoring Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-2-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-2-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Backend API & Authentication Mentoring",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-2-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-2-2",
              "title": "Session 2: AI Feature Integration & Prompt Tuning",
              "items": [
                {
                  "id": "capstone-mentoring-2-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "AI Feature Integration & Prompt Tuning Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-2-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-2-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: AI Feature Integration & Prompt Tuning",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-2-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-2-3",
              "title": "Session 3: Full-Stack Integration & State Debugging",
              "items": [
                {
                  "id": "capstone-mentoring-2-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Full-Stack Integration & State Debugging Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-2-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-2-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Full-Stack Integration & State Debugging",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-2-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-2-4",
              "title": "Session 4: Security Audit & Code Refactoring",
              "items": [
                {
                  "id": "capstone-mentoring-2-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Security Audit & Code Refactoring Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-2-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-2-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Security Audit & Code Refactoring",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-2-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-capstone-mentoring-2-5",
              "title": "Session 5: Cloud Deployment & Final Project Review",
              "items": [
                {
                  "id": "capstone-mentoring-2-s5-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Cloud Deployment & Final Project Review Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-capstone-mentoring-2-s5",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "capstone-mentoring-2-s5-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Cloud Deployment & Final Project Review",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/capstone-mentoring-2-s5",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 4,
          "modules": [
            {
              "id": "mod-resume-portfolio-1",
              "title": "Session 1: ATS Technical Resume Creation",
              "items": [
                {
                  "id": "resume-portfolio-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "ATS Technical Resume Creation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: ATS Technical Resume Creation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-resume-portfolio-2",
              "title": "Session 2: GitHub Portfolio & README Documentation",
              "items": [
                {
                  "id": "resume-portfolio-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "GitHub Portfolio & README Documentation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: GitHub Portfolio & README Documentation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-resume-portfolio-3",
              "title": "Session 3: LinkedIn Profile Optimization & Branding",
              "items": [
                {
                  "id": "resume-portfolio-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "LinkedIn Profile Optimization & Branding Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: LinkedIn Profile Optimization & Branding",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-resume-portfolio-4",
              "title": "Session 4: Tech Job Application Strategies & Outreach",
              "items": [
                {
                  "id": "resume-portfolio-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Tech Job Application Strategies & Outreach Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-resume-portfolio-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "resume-portfolio-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Tech Job Application Strategies & Outreach",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/resume-portfolio-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
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
          "modulesCount": 4,
          "modules": [
            {
              "id": "mod-mock-interviews-1",
              "title": "Session 1: Data Structures & Live Coding Practice",
              "items": [
                {
                  "id": "mock-interviews-s1-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Data Structures & Live Coding Practice Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-s1",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-s1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Data Structures & Live Coding Practice",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-s1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-mock-interviews-2",
              "title": "Session 2: Full-Stack Tech Stack Mock Interview",
              "items": [
                {
                  "id": "mock-interviews-s2-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Full-Stack Tech Stack Mock Interview Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-s2",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-s2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Full-Stack Tech Stack Mock Interview",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-s2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-mock-interviews-3",
              "title": "Session 3: HR & Behavioral Interview Preparation",
              "items": [
                {
                  "id": "mock-interviews-s3-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "HR & Behavioral Interview Preparation Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-s3",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-s3-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: HR & Behavioral Interview Preparation",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-s3",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            },
            {
              "id": "mod-mock-interviews-4",
              "title": "Session 4: Capstone Demonstrations & Certification Ceremony",
              "items": [
                {
                  "id": "mock-interviews-s4-live",
                  "type": "LIVE CLASS",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "iconName": "Video",
                  "iconBg": "bg-purple-600 text-white",
                  "title": "Capstone Demonstrations & Certification Ceremony Masterclass",
                  "actionText": "JOIN",
                  "url": "https://zoom.us/live-mock-interviews-s4",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30"
                },
                {
                  "id": "mock-interviews-s4-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Hands-on Lab: Capstone Demonstrations & Certification Ceremony",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/mock-interviews-s4",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
