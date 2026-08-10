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
    "trackTitle": "Fullstack Python + DSA",
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
                },
                {
                  "id": "git-github-m1-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "Git Repository Init, Commits & Push Lab",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-1",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "git-github-m1-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Git Core Commands Evaluation Quiz",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
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
                },
                {
                  "id": "git-github-m2-lab",
                  "type": "PRACTICAL LAB",
                  "typeColor": "bg-amber-100 text-amber-700 border-amber-200",
                  "iconName": "Code",
                  "iconBg": "bg-amber-500 text-white",
                  "title": "GitHub PR & Team Collaboration Practice",
                  "actionText": "VIEW",
                  "url": "https://lab.aspirelms.io/git-github-2",
                  "btnStyle": "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                },
                {
                  "id": "git-github-m2-quiz",
                  "type": "ASSESSMENT",
                  "typeColor": "bg-blue-100 text-blue-700 border-blue-200",
                  "iconName": "FileCheck",
                  "iconBg": "bg-blue-600 text-white",
                  "title": "Git Branching & PR Assessment",
                  "actionText": "TAKE",
                  "url": "/assessments",
                  "btnStyle": "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30"
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
