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
    completedCount: 6,
    totalCount: 31,
    unlockedLevel: 3,
    completionPercentage: 45
  },
  stages: [
    {
      id: 's1',
      stageNumber: 'STAGE 01',
      phaseTag: 'Python Full Stack + DSA with AI • Stage 1',
      title: 'Stage 1: Frontend & Programming Foundations',
      duration: '9 Modules Included',
      subtopics: [
        {
          id: 'm1_git',
          title: 'Git & GitHub Version Control',
          duration: '5 hrs',
          modules: [
            {
              id: 'l_git_1',
              title: 'Git Architecture & Version Control Concepts',
              topics: [
                {
                  id: 'git-top-1',
                  title: 'What is Version Control?',
                  description: 'What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?',
                  agenda: 'What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?'
                },
                {
                  id: 'git-top-2',
                  title: 'How Does Git Work?',
                  description: 'Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.',
                  agenda: 'Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.'
                },
                {
                  id: 'git-top-3',
                  title: 'How Do We Install & Configure Git?',
                  description: 'Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.',
                  agenda: 'Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.'
                },
                {
                  id: 'git-top-4',
                  title: 'How Do We Create a Git Repository?',
                  description: 'Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.',
                  agenda: 'Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.'
                },
                {
                  id: 'git-top-5',
                  title: 'How Do We Track & Commit Changes?',
                  description: 'Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.',
                  agenda: 'Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.'
                }
              ],
              items: [
                {
                  id: 'git-top-1',
                  type: 'LIVE CLASS',
                  title: 'What is Version Control?',
                  agenda: 'What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?',
                  description: 'What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?'
                },
                {
                  id: 'git-top-2',
                  type: 'LIVE CLASS',
                  title: 'How Does Git Work?',
                  agenda: 'Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.',
                  description: 'Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.'
                },
                {
                  id: 'git-top-3',
                  type: 'LIVE CLASS',
                  title: 'How Do We Install & Configure Git?',
                  agenda: 'Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.',
                  description: 'Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.'
                },
                {
                  id: 'git-top-4',
                  type: 'LIVE CLASS',
                  title: 'How Do We Create a Git Repository?',
                  agenda: 'Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.',
                  description: 'Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.'
                },
                {
                  id: 'git-top-5',
                  type: 'LIVE CLASS',
                  title: 'How Do We Track & Commit Changes?',
                  agenda: 'Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.',
                  description: 'Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.'
                },
                {
                  id: 'git-intro-m1-lab',
                  type: 'PRACTICAL LAB',
                  title: 'Git Repository Creation & Commit History Lab',
                  url: 'https://lab.aspirelms.io/git-intro-1',
                  agenda: 'Hands-on practice initializing repositories, adding commits, examining git status, and exploring git history.',
                  description: 'Hands-on practice initializing repositories, adding commits, examining git status, and exploring git history.'
                },
                {
                  id: 'git-intro-m1-quiz',
                  type: 'ASSESSMENT',
                  title: 'Git & Version Control Core Quiz',
                  url: '/assessments',
                  agenda: 'Multiple-choice and practical knowledge test covering version control principles and basic Git commands.',
                  description: 'Multiple-choice and practical knowledge test covering version control principles and basic Git commands.'
                }
              ]
            },
            { id: 'l_git_2', title: 'Core Git Commands: init, add, commit, push, pull' },
            { id: 'l_git_3', title: 'Branching Strategy & Merge Conflicts' },
            { id: 'l_git_4', title: 'GitHub Pull Requests & Collaboration Workflows' }
          ],
          lessons: [
            { id: 'l_git_1', title: 'Git Architecture & Version Control Concepts' },
            { id: 'l_git_2', title: 'Core Git Commands: init, add, commit, push, pull' },
            { id: 'l_git_3', title: 'Branching Strategy & Merge Conflicts' },
            { id: 'l_git_4', title: 'GitHub Pull Requests & Collaboration Workflows' }
          ]
        },
        {
          id: 'm1_html',
          title: 'HTML5 & Web Architecture',
          duration: '1 Week',
          modules: [
            { id: 'l_html_1', title: 'Web Architecture & Client-Server Communication Model' },
            { id: 'l_html_2', title: 'HTML5 Document Structure & Semantic Elements' },
            { id: 'l_html_3', title: 'HTML Forms, Input Types, & Client-Side Validation' },
            { id: 'l_html_4', title: 'HTML Tables, Media Tags & Accessibility' }
          ],
          lessons: [
            { id: 'l_html_1', title: 'Web Architecture & Client-Server Communication Model' },
            { id: 'l_html_2', title: 'HTML5 Document Structure & Semantic Elements' },
            { id: 'l_html_3', title: 'HTML Forms, Input Types, & Client-Side Validation' },
            { id: 'l_html_4', title: 'HTML Tables, Media Tags & Accessibility' }
          ]
        },
        {
          id: 'm1_css_fund',
          title: 'CSS3 Fundamentals & Box Model',
          duration: '1 Week',
          modules: [
            { id: 'l_css_1', title: 'CSS Syntax, Rules, and Element/Class/ID Selectors' },
            { id: 'l_css_2', title: 'The CSS Box Model: Margin, Padding, Border, & Content' },
            { id: 'l_css_3', title: 'CSS Colors, Typography, & Visual Backgrounds' }
          ],
          lessons: [
            { id: 'l_css_1', title: 'CSS Syntax, Rules, and Element/Class/ID Selectors' },
            { id: 'l_css_2', title: 'The CSS Box Model: Margin, Padding, Border, & Content' },
            { id: 'l_css_3', title: 'CSS Colors, Typography, & Visual Backgrounds' }
          ]
        },
        {
          id: 'm1_css_adv',
          title: 'Advanced CSS Layouts & Responsive Design',
          duration: '1 Week',
          modules: [
            { id: 'l_css_adv_1', title: 'Flexbox Architecture & Practical Alignments' },
            { id: 'l_css_adv_2', title: 'CSS Grid System & Multi-Column Layouts' },
            { id: 'l_css_adv_3', title: 'Positioning: Relative, Absolute, Fixed, Sticky' },
            { id: 'l_css_adv_4', title: 'Media Queries & Responsive UI Design Patterns' }
          ],
          lessons: [
            { id: 'l_css_adv_1', title: 'Flexbox Architecture & Practical Alignments' },
            { id: 'l_css_adv_2', title: 'CSS Grid System & Multi-Column Layouts' },
            { id: 'l_css_adv_3', title: 'Positioning: Relative, Absolute, Fixed, Sticky' },
            { id: 'l_css_adv_4', title: 'Media Queries & Responsive UI Design Patterns' }
          ]
        },
        {
          id: 'm1_bootstrap',
          title: 'Bootstrap 5 Framework',
          duration: '1 Week',
          modules: [
            { id: 'l_boot_1', title: 'Bootstrap 5 Grid System & Responsive Utilities' },
            { id: 'l_boot_2', title: 'Bootstrap Components (Navbar, Modals, Cards, Forms)' },
            { id: 'l_boot_3', title: 'Customizing Bootstrap Styles & Themes' }
          ],
          lessons: [
            { id: 'l_boot_1', title: 'Bootstrap 5 Grid System & Responsive Utilities' },
            { id: 'l_boot_2', title: 'Bootstrap Components (Navbar, Modals, Cards, Forms)' },
            { id: 'l_boot_3', title: 'Customizing Bootstrap Styles & Themes' }
          ]
        },
        {
          id: 'm1_js_ess',
          title: 'JavaScript Essentials & Control Flow',
          duration: '1 Week',
          modules: [
            { id: 'l_js_1', title: 'JS Setup, Variables (var, let, const), & Data Types' },
            { id: 'l_js_2', title: 'Operators, Expressions, and Conditional Statements' },
            { id: 'l_js_3', title: 'Loops: for, while, forEach, & Iterations' }
          ],
          lessons: [
            { id: 'l_js_1', title: 'JS Setup, Variables (var, let, const), & Data Types' },
            { id: 'l_js_2', title: 'Operators, Expressions, and Conditional Statements' },
            { id: 'l_js_3', title: 'Loops: for, while, forEach, & Iterations' }
          ]
        },
        {
          id: 'm1_js_func',
          title: 'JavaScript Functions, Objects & Arrays',
          duration: '1 Week',
          modules: [
            { id: 'l_js_func_1', title: 'Function Declarations, Expressions, & Arrow Functions' },
            { id: 'l_js_func_2', title: 'Advanced Array Methods (map, filter, reduce)' },
            { id: 'l_js_func_3', title: 'Object Manipulation & Higher-Order Functions' }
          ],
          lessons: [
            { id: 'l_js_func_1', title: 'Function Declarations, Expressions, & Arrow Functions' },
            { id: 'l_js_func_2', title: 'Advanced Array Methods (map, filter, reduce)' },
            { id: 'l_js_func_3', title: 'Object Manipulation & Higher-Order Functions' }
          ]
        },
        {
          id: 'm1_dom',
          title: 'DOM Manipulation & Event Handling',
          duration: '1 Week',
          modules: [
            { id: 'l_dom_1', title: 'Selecting and Modifying DOM Elements Dynamically' },
            { id: 'l_dom_2', title: 'Event Listeners, Bubbling, and Delegation Patterns' },
            { id: 'l_dom_3', title: 'Form Validation & Dynamic HTML Creation' }
          ],
          lessons: [
            { id: 'l_dom_1', title: 'Selecting and Modifying DOM Elements Dynamically' },
            { id: 'l_dom_2', title: 'Event Listeners, Bubbling, and Delegation Patterns' },
            { id: 'l_dom_3', title: 'Form Validation & Dynamic HTML Creation' }
          ]
        },
        {
          id: 'm1_es6',
          title: 'Modern ES6+ & Asynchronous JS',
          duration: '1 Week',
          modules: [
            { id: 'l_es6_1', title: 'Destructuring, Spread/Rest Operators, and Modules' },
            { id: 'l_es6_2', title: 'Promises, Async/Await, and Fetch API Integration' },
            { id: 'l_es6_3', title: 'Handling JSON Data & Dynamic API Integrations' }
          ],
          lessons: [
            { id: 'l_es6_1', title: 'Destructuring, Spread/Rest Operators, and Modules' },
            { id: 'l_es6_2', title: 'Promises, Async/Await, and Fetch API Integration' },
            { id: 'l_es6_3', title: 'Handling JSON Data & Dynamic API Integrations' }
          ]
        }
      ]
    },
    {
      id: 's2',
      stageNumber: 'STAGE 02',
      phaseTag: 'Python Full Stack + DSA with AI • Stage 2',
      title: 'Stage 2: Backend + DSA',
      duration: '8 Modules Included',
      subtopics: [
        {
          id: 'm2_py_fund',
          title: 'Python Fundamentals & Control Flow',
          duration: '1 Week',
          modules: [
            { id: 'l_py_1', title: 'Python Setup, Variables, Data Types & Control Flow' },
            { id: 'l_py_2', title: 'Functions & Variable Scope in Python' },
            { id: 'l_py_3', title: 'Built-in Data Structures: Lists, Tuples, Sets, Dicts' }
          ],
          lessons: [
            { id: 'l_py_1', title: 'Python Setup, Variables, Data Types & Control Flow' },
            { id: 'l_py_2', title: 'Functions & Variable Scope in Python' },
            { id: 'l_py_3', title: 'Built-in Data Structures: Lists, Tuples, Sets, Dicts' }
          ]
        },
        {
          id: 'm2_py_oop',
          title: 'Python OOP & Advanced Concepts',
          duration: '1 Week',
          modules: [
            { id: 'l_py_oop_1', title: 'Object-Oriented Programming (Classes, Objects, Inheritance)' },
            { id: 'l_py_oop_2', title: 'Encapsulation, Polymorphism & Magic Methods' },
            { id: 'l_py_oop_3', title: 'Exception Handling, File I/O & Custom Decorators' }
          ],
          lessons: [
            { id: 'l_py_oop_1', title: 'Object-Oriented Programming (Classes, Objects, Inheritance)' },
            { id: 'l_py_oop_2', title: 'Encapsulation, Polymorphism & Magic Methods' },
            { id: 'l_py_oop_3', title: 'Exception Handling, File I/O & Custom Decorators' }
          ]
        },
        {
          id: 'm2_postgres',
          title: 'PostgreSQL & Database Architecture',
          duration: '1 Week',
          modules: [
            { id: 'l_db_1', title: 'Relational Database Design & Schema Normalization' },
            { id: 'l_db_2', title: 'Complex SQL Queries, Subqueries & Window Functions' },
            { id: 'l_db_3', title: 'Indexes, Transactions, ACID Properties & Query Optimization' }
          ],
          lessons: [
            { id: 'l_db_1', title: 'Relational Database Design & Schema Normalization' },
            { id: 'l_db_2', title: 'Complex SQL Queries, Subqueries & Window Functions' },
            { id: 'l_db_3', title: 'Indexes, Transactions, ACID Properties & Query Optimization' }
          ]
        },
        {
          id: 'm2_django_api',
          title: 'Django & REST API Development',
          duration: '1 Week',
          modules: [
            { id: 'l_dj_1', title: 'Django Architecture, MTV Pattern & Project Setup' },
            { id: 'l_dj_2', title: 'Django ORM, Models, Migrations & Admin Panel' },
            { id: 'l_dj_3', title: 'Django REST Framework (DRF) Serializers & ViewSets' },
            { id: 'l_dj_4', title: 'JWT Authentication, Permissions & Middleware' }
          ],
          lessons: [
            { id: 'l_dj_1', title: 'Django Architecture, MTV Pattern & Project Setup' },
            { id: 'l_dj_2', title: 'Django ORM, Models, Migrations & Admin Panel' },
            { id: 'l_dj_3', title: 'Django REST Framework (DRF) Serializers & ViewSets' },
            { id: 'l_dj_4', title: 'JWT Authentication, Permissions & Middleware' }
          ]
        },
        {
          id: 'm2_dsa_arrays',
          title: 'DSA: Arrays, Strings & Pointers',
          duration: '1 Week',
          modules: [
            { id: 'l_dsa_arr_1', title: 'Two Pointers & Sliding Window Techniques' },
            { id: 'l_dsa_arr_2', title: 'Prefix Sum, Kadane\'s Algorithm & Subarray Problems' },
            { id: 'l_dsa_arr_3', title: 'String Manipulation & Pattern Matching Algorithms' }
          ],
          lessons: [
            { id: 'l_dsa_arr_1', title: 'Two Pointers & Sliding Window Techniques' },
            { id: 'l_dsa_arr_2', title: 'Prefix Sum, Kadane\'s Algorithm & Subarray Problems' },
            { id: 'l_dsa_arr_3', title: 'String Manipulation & Pattern Matching Algorithms' }
          ]
        },
        {
          id: 'm2_dsa_linkedlist',
          title: 'DSA: Stacks, Queues & Linked Lists',
          duration: '1 Week',
          modules: [
            { id: 'l_dsa_ll_1', title: 'Singly & Doubly Linked List Operations' },
            { id: 'l_dsa_ll_2', title: 'Monotonic Stack, Parenthesis Matching & Next Greater Element' },
            { id: 'l_dsa_ll_3', title: 'Queue, Deque & Priority Queue Implementations' }
          ],
          lessons: [
            { id: 'l_dsa_ll_1', title: 'Singly & Doubly Linked List Operations' },
            { id: 'l_dsa_ll_2', title: 'Monotonic Stack, Parenthesis Matching & Next Greater Element' },
            { id: 'l_dsa_ll_3', title: 'Queue, Deque & Priority Queue Implementations' }
          ]
        },
        {
          id: 'm2_dsa_trees',
          title: 'DSA: Trees, BST & Graphs',
          duration: '1 Week',
          modules: [
            { id: 'l_dsa_tree_1', title: 'Binary Trees: Inorder, Preorder, Postorder & Level Order' },
            { id: 'l_dsa_tree_2', title: 'Binary Search Tree (BST) Validation, Insertion & Deletion' },
            { id: 'l_dsa_tree_3', title: 'Graph BFS, DFS, Cycle Detection & Dijkstra\'s Algorithm' }
          ],
          lessons: [
            { id: 'l_dsa_tree_1', title: 'Binary Trees: Inorder, Preorder, Postorder & Level Order' },
            { id: 'l_dsa_tree_2', title: 'Binary Search Tree (BST) Validation, Insertion & Deletion' },
            { id: 'l_dsa_tree_3', title: 'Graph BFS, DFS, Cycle Detection & Dijkstra\'s Algorithm' }
          ]
        },
        {
          id: 'm2_dsa_dp',
          title: 'DSA: Recursion, Backtracking & DP',
          duration: '1 Week',
          modules: [
            { id: 'l_dsa_dp_1', title: 'Recursion Trees, Subset Generation & Backtracking' },
            { id: 'l_dsa_dp_2', title: '1D Dynamic Programming: Fib, Climbing Stairs, House Robber' },
            { id: 'l_dsa_dp_3', title: '2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS' }
          ],
          lessons: [
            { id: 'l_dsa_dp_1', title: 'Recursion Trees, Subset Generation & Backtracking' },
            { id: 'l_dsa_dp_2', title: '1D Dynamic Programming: Fib, Climbing Stairs, House Robber' },
            { id: 'l_dsa_dp_3', title: '2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS' }
          ]
        }
      ]
    },
    {
      id: 's3',
      stageNumber: 'STAGE 03',
      phaseTag: 'Python Full Stack + DSA with AI • Stage 3',
      title: 'Stage 3: AI, Integration & Deployment',
      duration: '3 Modules Included',
      subtopics: [
        {
          id: 'mod-stg3-m1',
          title: 'Module 1: Introduction to AI, Prompt Engineering & LLMs',
          duration: '1 Week',
          modules: [
            { id: 'stg3-m1-mod1', title: 'What is AI/ML/DL/LLM & Generative AI Ecosystem' },
            { id: 'stg3-m1-mod2', title: 'Google Gemini & OpenAI API Setup and Access' },
            { id: 'stg3-m1-mod3', title: 'Prompt Engineering Strategies & Few-Shot Prompting' }
          ],
          lessons: [
            { id: 'stg3-m1-mod1', title: 'What is AI/ML/DL/LLM & Generative AI Ecosystem' },
            { id: 'stg3-m1-mod2', title: 'Google Gemini & OpenAI API Setup and Access' },
            { id: 'stg3-m1-mod3', title: 'Prompt Engineering Strategies & Few-Shot Prompting' }
          ]
        },
        {
          id: 'mod-stg3-m2',
          title: 'Module 2: AI Integration with Python & LangChain',
          duration: '1 Week',
          modules: [
            { id: 'stg3-m2-mod1', title: 'LangChain Framework Basics, Prompt Templates & Chains' },
            { id: 'stg3-m2-mod2', title: 'Integrating OpenAI/Gemini APIs in Django Backend' },
            { id: 'stg3-m2-mod3', title: 'Building Intelligent AI Chatbots & LLM Interfaces' }
          ],
          lessons: [
            { id: 'stg3-m2-mod1', title: 'LangChain Framework Basics, Prompt Templates & Chains' },
            { id: 'stg3-m2-mod2', title: 'Integrating OpenAI/Gemini APIs in Django Backend' },
            { id: 'stg3-m2-mod3', title: 'Building Intelligent AI Chatbots & LLM Interfaces' }
          ]
        },
        {
          id: 'mod-stg3-m3',
          title: 'Module 3: Docker Containerization & Cloud Deployment',
          duration: '1 Week',
          modules: [
            { id: 'stg3-m3-mod1', title: 'Docker Concepts & Creating Dockerfiles' },
            { id: 'stg3-m3-mod2', title: 'Containerizing Django Applications & Docker Compose' },
            { id: 'stg3-m3-mod3', title: 'Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)' }
          ],
          lessons: [
            { id: 'stg3-m3-mod1', title: 'Docker Concepts & Creating Dockerfiles' },
            { id: 'stg3-m3-mod2', title: 'Containerizing Django Applications & Docker Compose' },
            { id: 'stg3-m3-mod3', title: 'Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)' }
          ]
        }
      ]
    },
    {
      id: 's4',
      stageNumber: 'STAGE 04',
      phaseTag: 'Python Full Stack + DSA with AI • Stage 4',
      title: 'Stage 4: Career Launchpad',
      duration: '5 Modules Included',
      subtopics: [
        {
          id: 'mod-stg4-m1',
          title: 'Module 1: System Design & Software Architecture',
          duration: '1 Week',
          modules: [
            { id: 'stg4-m1-mod1', title: 'System Design Fundamentals: HLD vs LLD' },
            { id: 'stg4-m1-mod2', title: 'Load Balancing & Database Sharding' },
            { id: 'stg4-m1-mod3', title: 'Caching Strategies & Scalable Web Architecture' }
          ],
          lessons: [
            { id: 'stg4-m1-mod1', title: 'System Design Fundamentals: HLD vs LLD' },
            { id: 'stg4-m1-mod2', title: 'Load Balancing & Database Sharding' },
            { id: 'stg4-m1-mod3', title: 'Caching Strategies & Scalable Web Architecture' }
          ]
        },
        {
          id: 'mod-stg4-m2',
          title: 'Module 2: Capstone Project Mentoring & Review - 1',
          duration: '1 Week',
          modules: [
            { id: 'stg4-m2-mod1', title: 'Project Scope Finalization & Architecture Validation' },
            { id: 'stg4-m2-mod2', title: 'Database Design Review & API Contract Definition' }
          ],
          lessons: [
            { id: 'stg4-m2-mod1', title: 'Project Scope Finalization & Architecture Validation' },
            { id: 'stg4-m2-mod2', title: 'Database Design Review & API Contract Definition' }
          ]
        },
        {
          id: 'mod-stg4-m3',
          title: 'Module 3: Capstone Project Development & Mentoring - 2',
          duration: '1 Week',
          modules: [
            { id: 'stg4-m3-mod1', title: 'Frontend-Backend Integration & AI Feature Tuning' },
            { id: 'stg4-m3-mod2', title: 'Bug Fixing & Security Auditing' },
            { id: 'stg4-m3-mod3', title: 'Performance Optimization' }
          ],
          lessons: [
            { id: 'stg4-m3-mod1', title: 'Frontend-Backend Integration & AI Feature Tuning' },
            { id: 'stg4-m3-mod2', title: 'Bug Fixing & Security Auditing' },
            { id: 'stg4-m3-mod3', title: 'Performance Optimization' }
          ]
        },
        {
          id: 'mod-stg4-m4',
          title: 'Module 4: Resume Building, LinkedIn & GitHub Portfolio',
          duration: '1 Week',
          modules: [
            { id: 'stg4-m4-mod1', title: 'Creating ATS-Compliant Resume & GitHub Presentation' },
            { id: 'stg4-m4-mod2', title: 'README Design, Linkedin Profile Optimization & Branding' }
          ],
          lessons: [
            { id: 'stg4-m4-mod1', title: 'Creating ATS-Compliant Resume & GitHub Presentation' },
            { id: 'stg4-m4-mod2', title: 'README Design, Linkedin Profile Optimization & Branding' }
          ]
        },
        {
          id: 'mod-stg4-m5',
          title: 'Module 5: Mock Technical Interviews & Valedictory',
          duration: '1 Week',
          modules: [
            { id: 'stg4-m5-mod1', title: 'Technical Coding Practice & DSA Live Problem Solving' },
            { id: 'stg4-m5-mod2', title: 'HR Interview Prep, Capstone Demos, & Certification' }
          ],
          lessons: [
            { id: 'stg4-m5-mod1', title: 'Technical Coding Practice & DSA Live Problem Solving' },
            { id: 'stg4-m5-mod2', title: 'HR Interview Prep, Capstone Demos, & Certification' }
          ]
        }
      ]
    }
  ]
};
