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
  overview: {
    trackTitle: 'Milestone Curriculum Roadmap',
    headline: 'Master core engineering fundamentals, advanced AI models, full-stack frameworks, and real-world project deployments.',
    completedCount: 6,
    totalCount: 31,
    unlockedLevel: 3,
    completionPercentage: 45
  },
  stages: [
    {
      id: 'stage-1',
      stageNumber: 'STAGE 01',
      phaseTag: 'Phase 1 • Frontend & Version Control',
      title: 'Stage 1: Front End + Repository',
      status: 'IN PROGRESS',
      statusType: 'in-progress',
      isLocked: false,
      subtopics: [
        {
          id: 'git-github',
          title: 'Git & GitHub Version Control',
          description: 'Click to view subtopics',
          duration: 'Master Git commits, branching strategies, pull requests, merge conflict resolution, and GitHub Actions workflows.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-git-1',
              title: 'Git Core Concepts & Branching',
              items: [
                {
                  id: 'git-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Git & GitHub Essentials Live Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-git-github',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'git-item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  iconName: 'Code',
                  iconBg: 'bg-amber-500 text-white',
                  title: 'Git Branching & Merge Conflicts Practice Lab',
                  actionText: 'VIEW',
                  url: 'https://lab.aspirelms.io/git-branching',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                },
                {
                  id: 'git-item-3',
                  type: 'ASSESSMENT',
                  typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
                  iconName: 'FileCheck',
                  iconBg: 'bg-blue-600 text-white',
                  title: 'Git & GitHub Knowledge Evaluation',
                  actionText: 'TAKE',
                  url: '/assessments',
                  btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'html5-web-arch',
          title: 'HTML5 & Web Architecture',
          description: 'Click to view subtopics',
          duration: 'Semantic HTML5, DOM structure, browser rendering pipeline, web accessibility (a11y), and SEO best practices.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-html-1',
              title: 'Semantic HTML5 & Accessibility',
              items: [
                {
                  id: 'html-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'HTML5 Semantic Web Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-html5-masterclass',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'html-item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  iconName: 'Code',
                  iconBg: 'bg-amber-500 text-white',
                  title: 'Building Accessible HTML5 Landing Page',
                  actionText: 'VIEW',
                  url: 'https://lab.aspirelms.io/html5-lab',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'css3-box-model',
          title: 'CSS3 Fundamentals & Box Model',
          description: 'Click to view subtopics',
          duration: 'CSS selectors, box model, margins, padding, borders, typography, position property, and specificity rules.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-css-1',
              title: 'CSS Box Model & Styling',
              items: [
                {
                  id: 'css-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'CSS Box Model Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-css-boxmodel',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'css-item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  iconName: 'Code',
                  iconBg: 'bg-amber-500 text-white',
                  title: 'CSS Layout Styling Lab',
                  actionText: 'VIEW',
                  url: 'https://lab.aspirelms.io/css-boxmodel',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'advanced-css-responsive',
          title: 'Advanced CSS Layouts & Responsive Design',
          description: 'Click to view subtopics',
          duration: 'Flexbox, CSS Grid, media queries, mobile-first design, CSS custom properties, and animations.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-advcss-1',
              title: 'Flexbox & CSS Grid Mastery',
              items: [
                {
                  id: 'advcss-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Responsive Design & Grid Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-flexbox-grid',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'advcss-item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  iconName: 'Code',
                  iconBg: 'bg-amber-500 text-white',
                  title: 'Responsive Dashboard Grid Lab',
                  actionText: 'VIEW',
                  url: 'https://lab.aspirelms.io/css-grid',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'bootstrap-5',
          title: 'Bootstrap 5 Framework',
          description: 'Click to view subtopics',
          duration: 'Bootstrap 5 grid system, component library, utility classes, forms, modals, and customization.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-bs-1',
              title: 'Bootstrap Components & Utility Classes',
              items: [
                {
                  id: 'bs-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Bootstrap 5 Live UI Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-bootstrap5',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'js-essentials',
          title: 'JavaScript Essentials & Control Flow',
          description: 'Click to view subtopics',
          duration: 'Variables, data types, type coercion, operators, conditional logic, loops, and debugging techniques.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-js-1',
              title: 'JS Basics & Control Statements',
              items: [
                {
                  id: 'js-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'JavaScript Fundamentals Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-js-basics',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'js-item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  iconName: 'Code',
                  iconBg: 'bg-amber-500 text-white',
                  title: 'Control Flow & Logic Exercises Lab',
                  actionText: 'VIEW',
                  url: 'https://lab.aspirelms.io/js-controlflow',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'js-functions-objects',
          title: 'JavaScript Functions, Objects & Arrays',
          description: 'Click to view subtopics',
          duration: 'Function expressions, arrow functions, scope, closures, object manipulation, and array methods (map, filter, reduce).',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-js-2',
              title: 'Arrays, Objects & Functional Methods',
              items: [
                {
                  id: 'jsfn-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'JS Higher-Order Functions Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-js-functions',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'dom-events',
          title: 'DOM Manipulation & Event Handling',
          description: 'Click to view subtopics',
          duration: 'Document Object Model, element selection, event listeners, bubbling, delegation, and dynamic UI updates.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-dom-1',
              title: 'DOM Tree & Event Propagation',
              items: [
                {
                  id: 'dom-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Interactive DOM & Events Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-dom-events',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'es6-async-js',
          title: 'Modern ES6+ & Asynchronous JS',
          description: 'Click to view subtopics',
          duration: 'Destructuring, spread/rest, Promises, async/await, Fetch API, and Event Loop internals.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-es6-1',
              title: 'Promises & Async/Await',
              items: [
                {
                  id: 'es6-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Asynchronous JavaScript Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-async-js',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'es6-item-2',
                  type: 'ASSESSMENT',
                  typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
                  iconName: 'FileCheck',
                  iconBg: 'bg-blue-600 text-white',
                  title: 'ES6+ & Async JS Evaluation Quiz',
                  actionText: 'TAKE',
                  url: '/assessments',
                  btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stage-2',
      stageNumber: 'STAGE 02',
      phaseTag: 'Phase 2 • Backend Systems & DSA',
      title: 'Stage 2: Backend + DSA',
      status: 'AVAILABLE',
      statusType: 'available',
      isLocked: false,
      subtopics: [
        {
          id: 'py-fundamentals',
          title: 'Python Programming Fundamentals',
          description: 'Click to view subtopics',
          duration: 'Python syntax, variables, data structures (lists, tuples, dicts, sets), control flow, and functions.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-py-1',
              title: 'Variables & Data Structures',
              items: [
                {
                  id: 'py-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Python Core Fundamentals Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-python-fundamentals',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'py-advanced-exceptions',
          title: 'Advanced Python & Exception Handling',
          description: 'Click to view subtopics',
          duration: 'Decorators, generators, context managers, list comprehensions, try-except blocks, and custom errors.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-pyadv-1',
              title: 'Decorators & Error Handling',
              items: [
                {
                  id: 'pyadv-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Advanced Python Patterns Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-adv-python',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'py-oop',
          title: 'Object-Oriented Programming (OOP)',
          description: 'Click to view subtopics',
          duration: 'Classes, objects, inheritance, polymorphism, encapsulation, abstraction, and magic methods in Python.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-oop-1',
              title: 'Classes & Inheritance',
              items: [
                {
                  id: 'oop-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'OOP Architecture Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-python-oop',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'sql-mysql',
          title: 'SQL & Relational Databases (MySQL)',
          description: 'Click to view subtopics',
          duration: 'RDBMS concepts, DDL/DML queries, SELECT filters, JOINs, group by, indexing, and MySQL workbench.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-sql-1',
              title: 'SQL Queries & Table Design',
              items: [
                {
                  id: 'sql-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Relational Database & SQL Live Class',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-sql-mysql',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'adv-sql-postgres',
          title: 'Advanced SQL & PostgreSQL Integration',
          description: 'Click to view subtopics',
          duration: 'Subqueries, window functions, CTEs, transactions, ACID properties, and PostgreSQL features.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-pg-1',
              title: 'PostgreSQL & Window Functions',
              items: [
                {
                  id: 'pg-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Advanced PostgreSQL Queries Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-adv-sql',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'django-setup-arch',
          title: 'Django Framework Setup & Architecture',
          description: 'Click to view subtopics',
          duration: 'MVT (Model-View-Template) pattern, Django project initialization, settings configuration, and URLs routing.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-dj-1',
              title: 'Django Project & MVT Basics',
              items: [
                {
                  id: 'dj-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Django MVT Architecture Live Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-django-setup',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'django-templates-static',
          title: 'Django Templates & Static Files Setup',
          description: 'Click to view subtopics',
          duration: 'Template inheritance, DTL tags & filters, static files collection, and dynamic HTML rendering.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-djt-1',
              title: 'Django Templates Engine',
              items: [
                {
                  id: 'djt-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Django Templates Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-django-templates',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'django-models-orm',
          title: 'Django Models & Database ORM',
          description: 'Click to view subtopics',
          duration: 'Django ORM, model fields, foreign keys, many-to-many relationships, database migrations, and QuerySets.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-orm-1',
              title: 'Django ORM & QuerySets',
              items: [
                {
                  id: 'orm-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Django ORM & Migrations Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-django-orm',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'django-forms-auth',
          title: 'Django Forms, Authentication & Auth',
          description: 'Click to view subtopics',
          duration: 'Django ModelForms, CSRF protection, built-in user auth system, permissions, and custom user models.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-djauth-1',
              title: 'Authentication & Forms Security',
              items: [
                {
                  id: 'djauth-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Django Auth & User Management Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-django-auth',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'drf-core',
          title: 'Django REST Framework (DRF) Core',
          description: 'Click to view subtopics',
          duration: 'RESTful API principles, DRF serializers, APIView, Generic views, status codes, and response formats.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-drf-1',
              title: 'Serializers & API Views',
              items: [
                {
                  id: 'drf-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Django REST Framework Fundamentals',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-drf-core',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'drf-advanced',
          title: 'DRF Advanced: ViewSets, JWT Auth & Testing',
          description: 'Click to view subtopics',
          duration: 'ModelViewSets, Routers, JWT authentication (SimpleJWT), API throttling, filtering, and pytest integration.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-drfadv-1',
              title: 'ViewSets & JWT Security',
              items: [
                {
                  id: 'drfadv-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'DRF JWT Auth & API Testing Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-drf-advanced',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'redis-aws-s3',
          title: 'Redis Caching & AWS S3 Cloud Storage',
          description: 'Click to view subtopics',
          duration: 'Redis in-memory caching, django-redis, AWS S3 bucket configuration, and django-storages media upload.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-cloud-1',
              title: 'Caching & Cloud Media Storage',
              items: [
                {
                  id: 'cloud-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Redis Caching & AWS S3 Live Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-redis-s3',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'dsa-python-1',
          title: 'Data Structures using Python - Part 1',
          description: 'Click to view subtopics',
          duration: 'Big-O notation, Time & Space complexity, Arrays, Linked Lists, Stacks, Queues, and Hash Tables.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-dsa1-1',
              title: 'Linear Data Structures',
              items: [
                {
                  id: 'dsa1-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'DSA Part 1: Stacks & Queues Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-dsa-part1',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'dsa-python-2',
          title: 'Data Structures & Algorithms - Part 2',
          description: 'Click to view subtopics',
          duration: 'Binary Trees, BST, Graphs (BFS/DFS), Recursion, Backtracking, Dynamic Programming, and Greedy Algorithms.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-dsa2-1',
              title: 'Trees, Graphs & Dynamic Programming',
              items: [
                {
                  id: 'dsa2-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'DSA Part 2: Trees & Graphs Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-dsa-part2',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stage-3',
      stageNumber: 'STAGE 03',
      phaseTag: 'Phase 3 • Artificial Intelligence & Cloud',
      title: 'Stage 3: AI',
      status: 'AVAILABLE',
      statusType: 'available',
      isLocked: false,
      subtopics: [
        {
          id: 'ai-prompt-llm',
          title: 'Introduction to AI, Prompt Engineering & LLMs',
          description: 'Click to view subtopics',
          duration: 'AI paradigms, Large Language Models (LLMs), OpenAI API, zero-shot/few-shot prompting, and tokenization.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-ai-1',
              title: 'LLM Architectures & Prompt Engineering',
              items: [
                {
                  id: 'ai-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Prompt Engineering & LLMs Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-ai-prompt',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'ai-python-langchain',
          title: 'AI Integration with Python & LangChain',
          description: 'Click to view subtopics',
          duration: 'LangChain framework, vector databases (ChromaDB / Pinecone), RAG (Retrieval-Augmented Generation), and AI Agents.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-lang-1',
              title: 'LangChain RAG Pipelines & Vector DBs',
              items: [
                {
                  id: 'lang-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'LangChain & RAG Integration Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-langchain',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'docker-cloud-deploy',
          title: 'Docker Containerization & Cloud Deployment',
          description: 'Click to view subtopics',
          duration: 'Dockerfiles, docker-compose, container networking, production deployment on Render / AWS EC2 / Vercel.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-dock-1',
              title: 'Docker & Cloud Deployment',
              items: [
                {
                  id: 'dock-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Docker Containerization & Deployment Workshop',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-docker-deploy',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stage-4',
      stageNumber: 'STAGE 04',
      phaseTag: 'Phase 4 • Industry Placement & Portfolio',
      title: 'Stage 4: Career Launchpad',
      status: 'LOCKED',
      statusType: 'locked',
      isLocked: true,
      subtopics: [
        {
          id: 'sys-design-arch',
          title: 'System Design & Software Architecture',
          description: 'Click to view subtopics',
          duration: 'High-Level Design (HLD), Low-Level Design (LLD), load balancing, microservices, and database sharding.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-sd-1',
              title: 'Scalable System Architecture',
              items: [
                {
                  id: 'sd-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'System Design Masterclass for Tech Interviews',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-system-design',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'capstone-review-1',
          title: 'Capstone Project Mentoring & Review - 1',
          description: 'Click to view subtopics',
          duration: 'Industry Capstone proposal presentation, architecture design feedback, schema approval, and milestone 1 evaluation.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-cap1-1',
              title: 'Project Architecture Review',
              items: [
                {
                  id: 'cap1-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Capstone Project Review Session 1',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-capstone-1',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'capstone-review-2',
          title: 'Capstone Project Development & Mentoring - 2',
          description: 'Click to view subtopics',
          duration: 'Final full-stack application deployment, code quality audit, live demo presentation, and engineering sign-off.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-cap2-1',
              title: 'Final Deployment & Presentation',
              items: [
                {
                  id: 'cap2-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Capstone Demo Day & Evaluation',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-capstone-2',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'resume-portfolio',
          title: 'Resume Building, LinkedIn & GitHub Portfolio',
          description: 'Click to view subtopics',
          duration: 'ATS-friendly resume creation, LinkedIn profile optimization, GitHub README branding, and project showcases.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-port-1',
              title: 'Portfolio & Personal Branding',
              items: [
                {
                  id: 'port-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Resume & Portfolio Building Masterclass',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-portfolio',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        },
        {
          id: 'mock-interviews',
          title: 'Mock Technical Interviews & Valedictory',
          description: 'Click to view subtopics',
          duration: '1-on-1 mock technical interviews, behavioural questions, salary negotiation strategies, and graduation ceremony.',
          modulesCount: 1,
          modules: [
            {
              id: 'mod-mock-1',
              title: '1-on-1 Technical Mock Interviews',
              items: [
                {
                  id: 'mock-item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: 'Video',
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Mock Technical Interview Session',
                  actionText: 'JOIN',
                  url: 'https://zoom.us/live-mock-interviews',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};


