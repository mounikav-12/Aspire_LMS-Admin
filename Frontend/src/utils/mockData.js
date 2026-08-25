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

export const INITIAL_ASSESSMENTS = [
  {
    "id": "asmnt-1787590973569-w",
    "title": "Git",
    "courseName": "Python Full Stack + DSA with AI",
    "topicName": "Stage 1: Frontend & Programming Foundations||Git & GitHub Version Control||Git Architecture & Version Control Concepts",
    "durationMinutes": 45,
    "totalMarks": 100,
    "dueDate": "2026-08-30",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "status": "Active"
  }
];

export const INITIAL_LIVE_SESSIONS = [
  {
    "id": "session-1787589337511-w",
    "sessionTitle": "Branching Strategy & Merge Conflicts",
    "title": "Branching Strategy & Merge Conflicts",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_git",
    "subtopicName": "Git & GitHub Version Control",
    "moduleId": "l_git_3",
    "moduleName": "Branching Strategy & Merge Conflicts",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_git\",\"subtopicName\":\"Git & GitHub Version Control\",\"moduleId\":\"l_git_3\",\"moduleName\":\"Branching Strategy & Merge Conflicts\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787587265792-w",
    "sessionTitle": "Core Git Commands: init, add, commit, push, pull",
    "title": "Core Git Commands: init, add, commit, push, pull",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_git",
    "subtopicName": "Git & GitHub Version Control",
    "moduleId": "l_git_2",
    "moduleName": "Core Git Commands: init, add, commit, push, pull",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_git\",\"subtopicName\":\"Git & GitHub Version Control\",\"moduleId\":\"l_git_2\",\"moduleName\":\"Core Git Commands: init, add, commit, push, pull\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787638229564-w",
    "sessionTitle": "Web Architecture & Client-Server Communication Model",
    "title": "Web Architecture & Client-Server Communication Model",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_html",
    "subtopicName": "HTML5 & Web Architecture",
    "moduleId": "l_html_1",
    "moduleName": "Web Architecture & Client-Server Communication Model",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_html\",\"subtopicName\":\"HTML5 & Web Architecture\",\"moduleId\":\"l_html_1\",\"moduleName\":\"Web Architecture & Client-Server Communication Model\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787589566809-w",
    "sessionTitle": "Git Pull Requests & Collaborations Workflows",
    "title": "Git Pull Requests & Collaborations Workflows",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_git",
    "subtopicName": "Git & GitHub Version Control",
    "moduleId": "l_git_4",
    "moduleName": "GitHub Pull Requests & Collaboration Workflows",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_git\",\"subtopicName\":\"Git & GitHub Version Control\",\"moduleId\":\"l_git_4\",\"moduleName\":\"GitHub Pull Requests & Collaboration Workflows\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787640177272-w",
    "sessionTitle": "HTML Tables, Media Tags & Accessibility",
    "title": "HTML Tables, Media Tags & Accessibility",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_html",
    "subtopicName": "HTML5 & Web Architecture",
    "moduleId": "l_html_4",
    "moduleName": "HTML Tables, Media Tags & Accessibility",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_html\",\"subtopicName\":\"HTML5 & Web Architecture\",\"moduleId\":\"l_html_4\",\"moduleName\":\"HTML Tables, Media Tags & Accessibility\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787638823996-w",
    "sessionTitle": "HTML5 Document Structure & Semantic Elements",
    "title": "HTML5 Document Structure & Semantic Elements",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_html",
    "subtopicName": "HTML5 & Web Architecture",
    "moduleId": "l_html_2",
    "moduleName": "HTML5 Document Structure & Semantic Elements",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_html\",\"subtopicName\":\"HTML5 & Web Architecture\",\"moduleId\":\"l_html_2\",\"moduleName\":\"HTML5 Document Structure & Semantic Elements\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787648271007-w",
    "sessionTitle": "Flexbox Architecture & Practical Alignments",
    "title": "Flexbox Architecture & Practical Alignments",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_css_adv",
    "subtopicName": "Advanced CSS Layouts & Responsive Design",
    "moduleId": "l_css_adv_1",
    "moduleName": "Flexbox Architecture & Practical Alignments",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_css_adv\",\"subtopicName\":\"Advanced CSS Layouts & Responsive Design\",\"moduleId\":\"l_css_adv_1\",\"moduleName\":\"Flexbox Architecture & Practical Alignments\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787643475540-w",
    "sessionTitle": "The CSS Box Model: Margin, Padding, Border, & Content",
    "title": "The CSS Box Model: Margin, Padding, Border, & Content",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_css_fund",
    "subtopicName": "CSS3 Fundamentals & Box Model",
    "moduleId": "l_css_2",
    "moduleName": "The CSS Box Model: Margin, Padding, Border, & Content",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_css_fund\",\"subtopicName\":\"CSS3 Fundamentals & Box Model\",\"moduleId\":\"l_css_2\",\"moduleName\":\"The CSS Box Model: Margin, Padding, Border, & Content\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787643722016-w",
    "sessionTitle": "CSS Colors, Typography, & Visual Backgrounds",
    "title": "CSS Colors, Typography, & Visual Backgrounds",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_css_fund",
    "subtopicName": "CSS3 Fundamentals & Box Model",
    "moduleId": "l_css_3",
    "moduleName": "CSS Colors, Typography, & Visual Backgrounds",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_css_fund\",\"subtopicName\":\"CSS3 Fundamentals & Box Model\",\"moduleId\":\"l_css_3\",\"moduleName\":\"CSS Colors, Typography, & Visual Backgrounds\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787586048016-w",
    "sessionTitle": "Git Architecture & Version Control Concepts",
    "title": "Git Architecture & Version Control Concepts",
    "stageId": "s1-w",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_git-w",
    "subtopicName": "Git & GitHub Version Control",
    "moduleId": "l_git_1",
    "moduleName": "Git Architecture & Version Control Concepts",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1-w\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_git-w\",\"subtopicName\":\"Git & GitHub Version Control\",\"moduleId\":\"l_git_1\",\"moduleName\":\"Git Architecture & Version Control Concepts\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787639889057-w",
    "sessionTitle": "HTML Forms, Input Types, & Client-Side Validation",
    "title": "HTML Forms, Input Types, & Client-Side Validation",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_html",
    "subtopicName": "HTML5 & Web Architecture",
    "moduleId": "l_html_3",
    "moduleName": "HTML Forms, Input Types, & Client-Side Validation",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_html\",\"subtopicName\":\"HTML5 & Web Architecture\",\"moduleId\":\"l_html_3\",\"moduleName\":\"HTML Forms, Input Types, & Client-Side Validation\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  },
  {
    "id": "session-1787642896769-w",
    "sessionTitle": "CSS Syntax, Rules, and Element/Class/ID Selectors",
    "title": "CSS Syntax, Rules, and Element/Class/ID Selectors",
    "stageId": "s1",
    "stageName": "Stage 1: Frontend & Programming Foundations",
    "subtopicId": "m1_css_fund",
    "subtopicName": "CSS3 Fundamentals & Box Model",
    "moduleId": "l_css_1",
    "moduleName": "CSS Syntax, Rules, and Element/Class/ID Selectors",
    "instructor": "Siva Veludurthi",
    "mentor": "Siva Veludurthi",
    "date": "2026-08-25",
    "sessionDate": "2026-08-25",
    "time": "10:00 - 11:30 AM",
    "timing": "10:00 - 11:30 AM",
    "status": "Upcoming",
    "joinLink": "https://meet.google.com/aspire-lms-live",
    "meetingLink": "https://meet.google.com/aspire-lms-live",
    "url": "https://meet.google.com/aspire-lms-live",
    "targetBatch": "A26W1, A26W2, A26W3, A26S1, A26S2, A26S3, A26S4",
    "topics": [
      {
        "id": "git-top-1",
        "title": "What is Version Control?",
        "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?",
        "overview": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?"
      },
      {
        "id": "git-top-2",
        "title": "How Does Git Work?",
        "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.",
        "overview": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time."
      },
      {
        "id": "git-top-3",
        "title": "How Do We Install & Configure Git?",
        "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.",
        "overview": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers."
      },
      {
        "id": "git-top-4",
        "title": "How Do We Create a Git Repository?",
        "description": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "agenda": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.",
        "overview": "Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone."
      },
      {
        "id": "git-top-5",
        "title": "How Do We Track & Commit Changes?",
        "description": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "agenda": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.",
        "overview": "Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log."
      }
    ],
    "description": "{\"text\":\"Comprehensive daily masterclass covering core Git concepts and version control architecture.\",\"courseId\":\"crs-1786624019154-w\",\"courseName\":\"Python Full Stack + DSA with AI\",\"stageId\":\"s1\",\"stageName\":\"Stage 1: Frontend & Programming Foundations\",\"subtopicId\":\"m1_css_fund\",\"subtopicName\":\"CSS3 Fundamentals & Box Model\",\"moduleId\":\"l_css_1\",\"moduleName\":\"CSS Syntax, Rules, and Element/Class/ID Selectors\",\"isLocked\":false,\"targetBatches\":[\"A26W1\",\"A26W2\",\"A26W3\",\"A26S1\",\"A26S2\",\"A26S3\",\"A26S4\"],\"topics\":[{\"id\":\"git-top-1\",\"title\":\"What is Version Control?\",\"description\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"agenda\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\",\"overview\":\"What is version control? Why do developers need it? What happens if multiple developers edit the same project? How does Git solve these problems? What is the difference between Git and GitHub?\"},{\"id\":\"git-top-2\",\"title\":\"How Does Git Work?\",\"description\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"agenda\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\",\"overview\":\"Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory). How commits create immutable snapshots in time.\"},{\"id\":\"git-top-3\",\"title\":\"How Do We Install & Configure Git?\",\"description\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"agenda\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\",\"overview\":\"Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity (git config --global user.name and user.email), default branch naming, and credential helpers.\"},{\"id\":\"git-top-4\",\"title\":\"How Do We Create a Git Repository?\",\"description\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"agenda\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\",\"overview\":\"Initializing new local repositories with git init, understanding hidden .git folders, tracking project files, and cloning existing remote repositories with git clone.\"},{\"id\":\"git-top-5\",\"title\":\"How Do We Track & Commit Changes?\",\"description\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"agenda\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\",\"overview\":\"Inspecting file status with git status, adding files to staging with git add, writing clear commit messages with git commit -m, and viewing project commit logs with git log.\"}]}"
  }
];

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
  "overview": {
    "trackTitle": "Python full stack + DSA with AI",
    "programSubtitle": "5 Progressive Milestones • Complete Industry Roadmap • Enterprise AI Architecture",
    "totalStages": 5,
    "totalModules": 31,
    "totalCount": 31,
    "unlockedLevel": 3,
    "completionPercentage": 45
  },
  "stages": [
    {
      "id": "s1",
      "title": "Stage 1: Frontend & Programming Foundations",
      "modules": [
        {
          "id": "m1_git",
          "title": "Git & GitHub Version Control",
          "lessons": [
            {
              "id": "l_git_1",
              "items": [],
              "title": "Git Architecture & Version Control Concepts"
            },
            {
              "id": "l_git_2",
              "items": [],
              "title": "Core Git Commands: init, add, commit, push, pull"
            },
            {
              "id": "l_git_3",
              "items": [],
              "title": "Branching Strategy & Merge Conflicts"
            },
            {
              "id": "l_git_4",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What Are Professional Git Practices?",
                  "agenda": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "Can You Complete a Real GitHub Workflow?",
                  "agenda": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?"
                }
              ],
              "title": "GitHub Pull Requests & Collaboration Workflows",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "modules": [
            {
              "id": "l_git_1",
              "items": [],
              "title": "Git Architecture & Version Control Concepts"
            },
            {
              "id": "l_git_2",
              "items": [],
              "title": "Core Git Commands: init, add, commit, push, pull"
            },
            {
              "id": "l_git_3",
              "items": [],
              "title": "Branching Strategy & Merge Conflicts"
            },
            {
              "id": "l_git_4",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What Are Professional Git Practices?",
                  "agenda": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "Can You Complete a Real GitHub Workflow?",
                  "agenda": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?"
                }
              ],
              "title": "GitHub Pull Requests & Collaboration Workflows",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "duration": "5 hrs"
        },
        {
          "id": "m1_html",
          "title": "HTML5 & Web Architecture",
          "lessons": [
            {
              "id": "l_html_1",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Web?",
                  "agenda": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Does Web Architecture Work?",
                  "agenda": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is HTML5?",
                  "agenda": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Create an HTML Page?",
                  "agenda": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Basic HTML5 Document Structure?",
                  "agenda": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?"
                }
              ],
              "title": "Web Architecture & Client-Server Communication Model",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_2",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Elements & Attributes Work?",
                  "agenda": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Text & Links?",
                  "agenda": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Lists & Images?",
                  "agenda": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Are Semantic HTML Elements?",
                  "agenda": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?"
                }
              ],
              "title": "HTML5 Document Structure & Semantic Elements",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_3",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 AM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Build Tables?",
                  "agenda": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Forms Work?",
                  "agenda": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What HTML5 Input Types Should We Use?",
                  "agenda": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Does HTML5 Form Validation Work?",
                  "agenda": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?"
                }
              ],
              "title": "HTML Forms, Input Types, & Client-Side Validation",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_4",
              "items": [],
              "title": "HTML Tables, Media Tags & Accessibility"
            }
          ],
          "modules": [
            {
              "id": "l_html_1",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Web?",
                  "agenda": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Does Web Architecture Work?",
                  "agenda": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is HTML5?",
                  "agenda": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Create an HTML Page?",
                  "agenda": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Basic HTML5 Document Structure?",
                  "agenda": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?"
                }
              ],
              "title": "Web Architecture & Client-Server Communication Model",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_2",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Elements & Attributes Work?",
                  "agenda": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Text & Links?",
                  "agenda": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Lists & Images?",
                  "agenda": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Are Semantic HTML Elements?",
                  "agenda": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?"
                }
              ],
              "title": "HTML5 Document Structure & Semantic Elements",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_3",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 AM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Build Tables?",
                  "agenda": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Forms Work?",
                  "agenda": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What HTML5 Input Types Should We Use?",
                  "agenda": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Does HTML5 Form Validation Work?",
                  "agenda": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?"
                }
              ],
              "title": "HTML Forms, Input Types, & Client-Side Validation",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_4",
              "items": [],
              "title": "HTML Tables, Media Tags & Accessibility"
            }
          ],
          "duration": "1 Week",
          "modulesCount": 4
        },
        {
          "id": "m1_css_fund",
          "title": "CSS3 Fundamentals & Box Model",
          "lessons": [
            {
              "id": "l_css_1",
              "items": [],
              "title": "CSS Syntax, Rules, and Element/Class/ID Selectors"
            },
            {
              "id": "l_css_2",
              "items": [],
              "title": "The CSS Box Model: Margin, Padding, Border, & Content"
            },
            {
              "id": "l_css_3",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Work With Colors & Backgrounds?",
                  "agenda": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Style Typography?",
                  "agenda": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Combine CSS Concepts to Build a Layout?",
                  "agenda": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Write Maintainable CSS?",
                  "agenda": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "Final Hands-On Project — Styled Landing Page",
                  "agenda": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?"
                }
              ],
              "title": "CSS Colors, Typography, & Visual Backgrounds",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "modules": [
            {
              "id": "l_css_1",
              "items": [],
              "title": "CSS Syntax, Rules, and Element/Class/ID Selectors"
            },
            {
              "id": "l_css_2",
              "items": [],
              "title": "The CSS Box Model: Margin, Padding, Border, & Content"
            },
            {
              "id": "l_css_3",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Work With Colors & Backgrounds?",
                  "agenda": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Style Typography?",
                  "agenda": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Combine CSS Concepts to Build a Layout?",
                  "agenda": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Write Maintainable CSS?",
                  "agenda": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "Final Hands-On Project — Styled Landing Page",
                  "agenda": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?"
                }
              ],
              "title": "CSS Colors, Typography, & Visual Backgrounds",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_css_adv",
          "title": "Advanced CSS Layouts & Responsive Design",
          "lessons": [
            {
              "id": "l_css_adv_1",
              "items": [],
              "title": "Flexbox Architecture & Practical Alignments"
            },
            {
              "id": "l_css_adv_2",
              "items": [],
              "title": "CSS Grid System & Multi-Column Layouts"
            },
            {
              "id": "l_css_adv_3",
              "items": [],
              "title": "Positioning: Relative, Absolute, Fixed, Sticky"
            },
            {
              "id": "l_css_adv_4",
              "items": [],
              "title": "Media Queries & Responsive UI Design Patterns"
            }
          ],
          "modules": [
            {
              "id": "l_css_adv_1",
              "items": [],
              "title": "Flexbox Architecture & Practical Alignments"
            },
            {
              "id": "l_css_adv_2",
              "items": [],
              "title": "CSS Grid System & Multi-Column Layouts"
            },
            {
              "id": "l_css_adv_3",
              "items": [],
              "title": "Positioning: Relative, Absolute, Fixed, Sticky"
            },
            {
              "id": "l_css_adv_4",
              "items": [],
              "title": "Media Queries & Responsive UI Design Patterns"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_bootstrap",
          "title": "Bootstrap 5 Framework",
          "lessons": [
            {
              "id": "l_boot_1",
              "items": [],
              "title": "Bootstrap 5 Grid System & Responsive Utilities"
            },
            {
              "id": "l_boot_2",
              "items": [],
              "title": "Bootstrap Components (Navbar, Modals, Cards, Forms)"
            },
            {
              "id": "l_boot_3",
              "items": [],
              "title": "Customizing Bootstrap Styles & Themes"
            }
          ],
          "modules": [
            {
              "id": "l_boot_1",
              "items": [],
              "title": "Bootstrap 5 Grid System & Responsive Utilities"
            },
            {
              "id": "l_boot_2",
              "items": [],
              "title": "Bootstrap Components (Navbar, Modals, Cards, Forms)"
            },
            {
              "id": "l_boot_3",
              "items": [],
              "title": "Customizing Bootstrap Styles & Themes"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_js_ess",
          "title": "JavaScript Essentials & Control Flow",
          "lessons": [
            {
              "id": "l_js_1",
              "items": [],
              "title": "JS Setup, Variables (var, let, const), & Data Types"
            },
            {
              "id": "l_js_2",
              "items": [],
              "title": "Operators, Expressions, and Conditional Statements"
            },
            {
              "id": "l_js_3",
              "items": [],
              "title": "Loops: for, while, forEach, & Iterations"
            }
          ],
          "modules": [
            {
              "id": "l_js_1",
              "items": [],
              "title": "JS Setup, Variables (var, let, const), & Data Types"
            },
            {
              "id": "l_js_2",
              "items": [],
              "title": "Operators, Expressions, and Conditional Statements"
            },
            {
              "id": "l_js_3",
              "items": [],
              "title": "Loops: for, while, forEach, & Iterations"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_js_func",
          "title": "JavaScript Functions, Objects & Arrays",
          "lessons": [
            {
              "id": "l_js_func_1",
              "items": [],
              "title": "Function Declarations, Expressions, & Arrow Functions"
            },
            {
              "id": "l_js_func_2",
              "items": [],
              "title": "Advanced Array Methods (map, filter, reduce)"
            },
            {
              "id": "l_js_func_3",
              "items": [],
              "title": "Object Manipulation & Higher-Order Functions"
            }
          ],
          "modules": [
            {
              "id": "l_js_func_1",
              "items": [],
              "title": "Function Declarations, Expressions, & Arrow Functions"
            },
            {
              "id": "l_js_func_2",
              "items": [],
              "title": "Advanced Array Methods (map, filter, reduce)"
            },
            {
              "id": "l_js_func_3",
              "items": [],
              "title": "Object Manipulation & Higher-Order Functions"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_dom",
          "title": "DOM Manipulation & Event Handling",
          "lessons": [
            {
              "id": "l_dom_1",
              "items": [],
              "title": "Selecting and Modifying DOM Elements Dynamically"
            },
            {
              "id": "l_dom_2",
              "items": [],
              "title": "Event Listeners, Bubbling, and Delegation Patterns"
            },
            {
              "id": "l_dom_3",
              "items": [],
              "title": "Form Validation & Dynamic HTML Creation"
            }
          ],
          "modules": [
            {
              "id": "l_dom_1",
              "items": [],
              "title": "Selecting and Modifying DOM Elements Dynamically"
            },
            {
              "id": "l_dom_2",
              "items": [],
              "title": "Event Listeners, Bubbling, and Delegation Patterns"
            },
            {
              "id": "l_dom_3",
              "items": [],
              "title": "Form Validation & Dynamic HTML Creation"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_es6",
          "title": "Modern ES6+ & Asynchronous JS",
          "lessons": [
            {
              "id": "l_es6_1",
              "items": [],
              "title": "Destructuring, Spread/Rest Operators, and Modules"
            },
            {
              "id": "l_es6_2",
              "items": [],
              "title": "Promises, Async/Await, and Fetch API Integration"
            },
            {
              "id": "l_es6_3",
              "items": [],
              "title": "Handling JSON Data & Dynamic API Integrations"
            }
          ],
          "modules": [
            {
              "id": "l_es6_1",
              "items": [],
              "title": "Destructuring, Spread/Rest Operators, and Modules"
            },
            {
              "id": "l_es6_2",
              "items": [],
              "title": "Promises, Async/Await, and Fetch API Integration"
            },
            {
              "id": "l_es6_3",
              "items": [],
              "title": "Handling JSON Data & Dynamic API Integrations"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "duration": "9 Modules Included",
      "phaseTag": "Python Full Stack + DSA with AI • Stage 1",
      "subtopics": [
        {
          "id": "m1_git",
          "title": "Git & GitHub Version Control",
          "lessons": [
            {
              "id": "l_git_1",
              "items": [],
              "title": "Git Architecture & Version Control Concepts"
            },
            {
              "id": "l_git_2",
              "items": [],
              "title": "Core Git Commands: init, add, commit, push, pull"
            },
            {
              "id": "l_git_3",
              "items": [],
              "title": "Branching Strategy & Merge Conflicts"
            },
            {
              "id": "l_git_4",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What Are Professional Git Practices?",
                  "agenda": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Why should commits be small and meaningful? Why should developers avoid direct pushes to main? How should branches be named? Why should we pull before starting work? What are protected branches? What makes a good Pull Request?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-24",
                  "time": "10:00 - 11:30 AM",
                  "type": "LIVE CLASS",
                  "title": "Can You Complete a Real GitHub Workflow?",
                  "agenda": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?",
                  "sessionId": "session-1787589566809-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "Git & Github Version Control",
                  "description": "Can you create a repository? Can you initialize Git? Can you configure .gitignore? Can you make and push commits? Can you create a feature branch? Can you push the branch? Can you create a Pull Request? Can you resolve a merge conflict? Can you merge the feature into main? Can you synchronize the local repository with GitHub?"
                }
              ],
              "title": "GitHub Pull Requests & Collaboration Workflows",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "modules": [
            {
              "id": "l_git_1",
              "items": [
                {
                  "id": "top-git1-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "What is Version Control?",
                  "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? Difference between Git and GitHub.",
                  "actionText": "JOIN",
                  "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? Difference between Git and GitHub."
                },
                {
                  "id": "top-git1-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "How Does Git Work?",
                  "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory).",
                  "actionText": "JOIN",
                  "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory)."
                },
                {
                  "id": "top-git1-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "How Do We Install & Configure Git?",
                  "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity and default branch configuration.",
                  "actionText": "JOIN",
                  "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity and default branch configuration."
                },
                {
                  "id": "top-git1-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "How Do We Create a Git Repository?",
                  "agenda": "Initializing new local repositories with git init, hidden .git folder structure, and cloning remote repos with git clone.",
                  "actionText": "JOIN",
                  "description": "Initializing new local repositories with git init, hidden .git folder structure, and cloning remote repos with git clone."
                },
                {
                  "id": "top-git1-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "How Do We Track & Commit Changes?",
                  "agenda": "Inspecting file status with git status, staging with git add, committing with git commit -m, and reading git log history.",
                  "actionText": "JOIN",
                  "description": "Inspecting file status with git status, staging with git add, committing with git commit -m, and reading git log history."
                }
              ],
              "title": "Git Architecture & Version Control Concepts",
              "topics": [
                {
                  "id": "top-git1-1",
                  "title": "What is Version Control?",
                  "agenda": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? Difference between Git and GitHub.",
                  "description": "What is version control? Why do developers need it? What happens if multiple developers edit the same project? Difference between Git and GitHub."
                },
                {
                  "id": "top-git1-2",
                  "title": "How Does Git Work?",
                  "agenda": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory).",
                  "description": "Understanding Git snapshot architecture, working directory, staging area (index), and local repository (.git directory)."
                },
                {
                  "id": "top-git1-3",
                  "title": "How Do We Install & Configure Git?",
                  "agenda": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity and default branch configuration.",
                  "description": "Installing Git CLI on Windows, Mac, and Linux. Setting up global user identity and default branch configuration."
                },
                {
                  "id": "top-git1-4",
                  "title": "How Do We Create a Git Repository?",
                  "agenda": "Initializing new local repositories with git init, hidden .git folder structure, and cloning remote repos with git clone.",
                  "description": "Initializing new local repositories with git init, hidden .git folder structure, and cloning remote repos with git clone."
                },
                {
                  "id": "top-git1-5",
                  "title": "How Do We Track & Commit Changes?",
                  "agenda": "Inspecting file status with git status, staging with git add, committing with git commit -m, and reading git log history.",
                  "description": "Inspecting file status with git status, staging with git add, committing with git commit -m, and reading git log history."
                }
              ]
            },
            {
              "id": "l_git_2",
              "items": [
                {
                  "id": "top-git2-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Git Initialization & Staging Deep-Dive",
                  "agenda": "Mastering git init, git add (single, multiple, wildcards, .), and .gitignore patterns.",
                  "actionText": "JOIN",
                  "description": "Mastering git init, git add (single, multiple, wildcards, .), and .gitignore patterns."
                },
                {
                  "id": "top-git2-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Crafting Atomic Commits",
                  "agenda": "Writing conventional commit messages, understanding commit hashes (SHA-1), and commit authoring best practices.",
                  "actionText": "JOIN",
                  "description": "Writing conventional commit messages, understanding commit hashes (SHA-1), and commit authoring best practices."
                },
                {
                  "id": "top-git2-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Remote Repository Connections",
                  "agenda": "Configuring remotes with git remote add origin, inspecting remotes with git remote -v, and SSH vs HTTPS auth.",
                  "actionText": "JOIN",
                  "description": "Configuring remotes with git remote add origin, inspecting remotes with git remote -v, and SSH vs HTTPS auth."
                },
                {
                  "id": "top-git2-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Pushing Code to GitHub",
                  "agenda": "Upstream branch tracking with git push -u origin main, force push dangers, and protecting main branches.",
                  "actionText": "JOIN",
                  "description": "Upstream branch tracking with git push -u origin main, force push dangers, and protecting main branches."
                },
                {
                  "id": "top-git2-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Pulling & Fetching Updates",
                  "agenda": "Difference between git fetch and git pull, understanding fast-forward merges, and keeping local branches in sync.",
                  "actionText": "JOIN",
                  "description": "Difference between git fetch and git pull, understanding fast-forward merges, and keeping local branches in sync."
                }
              ],
              "title": "Core Git Commands: init, add, commit, push, pull",
              "topics": [
                {
                  "id": "top-git2-1",
                  "title": "Git Initialization & Staging Deep-Dive",
                  "agenda": "Mastering git init, git add (single, multiple, wildcards, .), and .gitignore patterns.",
                  "description": "Mastering git init, git add (single, multiple, wildcards, .), and .gitignore patterns."
                },
                {
                  "id": "top-git2-2",
                  "title": "Crafting Atomic Commits",
                  "agenda": "Writing conventional commit messages, understanding commit hashes (SHA-1), and commit authoring best practices.",
                  "description": "Writing conventional commit messages, understanding commit hashes (SHA-1), and commit authoring best practices."
                },
                {
                  "id": "top-git2-3",
                  "title": "Remote Repository Connections",
                  "agenda": "Configuring remotes with git remote add origin, inspecting remotes with git remote -v, and SSH vs HTTPS auth.",
                  "description": "Configuring remotes with git remote add origin, inspecting remotes with git remote -v, and SSH vs HTTPS auth."
                },
                {
                  "id": "top-git2-4",
                  "title": "Pushing Code to GitHub",
                  "agenda": "Upstream branch tracking with git push -u origin main, force push dangers, and protecting main branches.",
                  "description": "Upstream branch tracking with git push -u origin main, force push dangers, and protecting main branches."
                },
                {
                  "id": "top-git2-5",
                  "title": "Pulling & Fetching Updates",
                  "agenda": "Difference between git fetch and git pull, understanding fast-forward merges, and keeping local branches in sync.",
                  "description": "Difference between git fetch and git pull, understanding fast-forward merges, and keeping local branches in sync."
                }
              ]
            },
            {
              "id": "l_git_3",
              "items": [
                {
                  "id": "top-git3-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Branching Fundamentals in Git",
                  "agenda": "Why isolated feature branches matter, creating branches with git branch, and switching with git switch/checkout.",
                  "actionText": "JOIN",
                  "description": "Why isolated feature branches matter, creating branches with git branch, and switching with git switch/checkout."
                },
                {
                  "id": "top-git3-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Git Merge Strategies",
                  "agenda": "Fast-forward merges vs 3-way merge commits, executing git merge, and clean branching trees.",
                  "actionText": "JOIN",
                  "description": "Fast-forward merges vs 3-way merge commits, executing git merge, and clean branching trees."
                },
                {
                  "id": "top-git3-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Understanding Merge Conflicts",
                  "agenda": "Why conflicts happen, conflict markers (<<<<<<< HEAD, =======, >>>>>>>), and analyzing differing edits.",
                  "actionText": "JOIN",
                  "description": "Why conflicts happen, conflict markers (<<<<<<< HEAD, =======, >>>>>>>), and analyzing differing edits."
                },
                {
                  "id": "top-git3-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Resolving Conflicts Hands-on",
                  "agenda": "Manual conflict resolution in VS Code, staging resolved files, and finalizing merge commits safely.",
                  "actionText": "JOIN",
                  "description": "Manual conflict resolution in VS Code, staging resolved files, and finalizing merge commits safely."
                },
                {
                  "id": "top-git3-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Branch Cleanup & Maintenance",
                  "agenda": "Deleting merged local branches with git branch -d and remote branches with git push origin --delete.",
                  "actionText": "JOIN",
                  "description": "Deleting merged local branches with git branch -d and remote branches with git push origin --delete."
                }
              ],
              "title": "Branching Strategy & Merge Conflicts",
              "topics": [
                {
                  "id": "top-git3-1",
                  "title": "Branching Fundamentals in Git",
                  "agenda": "Why isolated feature branches matter, creating branches with git branch, and switching with git switch/checkout.",
                  "description": "Why isolated feature branches matter, creating branches with git branch, and switching with git switch/checkout."
                },
                {
                  "id": "top-git3-2",
                  "title": "Git Merge Strategies",
                  "agenda": "Fast-forward merges vs 3-way merge commits, executing git merge, and clean branching trees.",
                  "description": "Fast-forward merges vs 3-way merge commits, executing git merge, and clean branching trees."
                },
                {
                  "id": "top-git3-3",
                  "title": "Understanding Merge Conflicts",
                  "agenda": "Why conflicts happen, conflict markers (<<<<<<< HEAD, =======, >>>>>>>), and analyzing differing edits.",
                  "description": "Why conflicts happen, conflict markers (<<<<<<< HEAD, =======, >>>>>>>), and analyzing differing edits."
                },
                {
                  "id": "top-git3-4",
                  "title": "Resolving Conflicts Hands-on",
                  "agenda": "Manual conflict resolution in VS Code, staging resolved files, and finalizing merge commits safely.",
                  "description": "Manual conflict resolution in VS Code, staging resolved files, and finalizing merge commits safely."
                },
                {
                  "id": "top-git3-5",
                  "title": "Branch Cleanup & Maintenance",
                  "agenda": "Deleting merged local branches with git branch -d and remote branches with git push origin --delete.",
                  "description": "Deleting merged local branches with git branch -d and remote branches with git push origin --delete."
                }
              ]
            },
            {
              "id": "l_git_4",
              "items": [
                {
                  "id": "top-git4-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "GitHub PR Lifecycle",
                  "agenda": "Creating Pull Requests from feature branches into main, writing PR descriptions, and linking issues.",
                  "actionText": "JOIN",
                  "description": "Creating Pull Requests from feature branches into main, writing PR descriptions, and linking issues."
                },
                {
                  "id": "top-git4-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Code Review Workflows",
                  "agenda": "Inline commenting, requesting changes, approving PRs, and team code review ethics.",
                  "actionText": "JOIN",
                  "description": "Inline commenting, requesting changes, approving PRs, and team code review ethics."
                },
                {
                  "id": "top-git4-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Squash & Rebase Merges",
                  "agenda": "Comparing Merge Commit, Squash & Merge, and Rebase & Merge on GitHub.",
                  "actionText": "JOIN",
                  "description": "Comparing Merge Commit, Squash & Merge, and Rebase & Merge on GitHub."
                }
              ],
              "title": "GitHub Pull Requests & Collaboration Workflows",
              "topics": [
                {
                  "id": "top-git4-1",
                  "title": "GitHub PR Lifecycle",
                  "agenda": "Creating Pull Requests from feature branches into main, writing PR descriptions, and linking issues.",
                  "description": "Creating Pull Requests from feature branches into main, writing PR descriptions, and linking issues."
                },
                {
                  "id": "top-git4-2",
                  "title": "Code Review Workflows",
                  "agenda": "Inline commenting, requesting changes, approving PRs, and team code review ethics.",
                  "description": "Inline commenting, requesting changes, approving PRs, and team code review ethics."
                },
                {
                  "id": "top-git4-3",
                  "title": "Squash & Rebase Merges",
                  "agenda": "Comparing Merge Commit, Squash & Merge, and Rebase & Merge on GitHub.",
                  "description": "Comparing Merge Commit, Squash & Merge, and Rebase & Merge on GitHub."
                }
              ],
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "duration": "5 hrs"
        },
        {
          "id": "m1_html",
          "title": "HTML5 & Web Architecture",
          "lessons": [
            {
              "id": "l_html_1",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Web?",
                  "agenda": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the Internet? What is the World Wide Web? How does a browser communicate with a server? What are client and server? What happens when we enter a URL in a browser?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Does Web Architecture Work?",
                  "agenda": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the client-server model? What is a request and response? What are HTTP and HTTPS? What are URLs, domains, ports, and protocols? How does a browser receive and render a webpage?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is HTML5?",
                  "agenda": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is HTML? Why is HTML called a markup language? What changed with HTML5? How is HTML different from CSS and JavaScript? How does HTML define webpage structure?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Create an HTML Page?",
                  "agenda": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do we create an .html file? What tools can we use? How do we open HTML in a browser? What is <!DOCTYPE html>? Why is the document declaration required?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Is the Basic HTML5 Document Structure?",
                  "agenda": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?",
                  "sessionId": "session-1787638229564-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What are <html>, <head>, <meta>, <title>, and <body>? What belongs inside <head>? What belongs inside <body>? What is the viewport meta tag? How should an HTML document be structured?"
                }
              ],
              "title": "Web Architecture & Client-Server Communication Model",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_2",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Elements & Attributes Work?",
                  "agenda": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is an HTML element? What are opening and closing tags? What are attributes? What is the difference between block and inline elements? How do id, class, title, and style attributes work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Text & Links?",
                  "agenda": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do headings work with <h1>–<h6>? How are paragraphs created? What are <strong>, <em>, <br>, and <hr>? How do we create links with <a>? What are href, target, and relative vs absolute paths?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Add Lists & Images?",
                  "agenda": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "How do <ul>, <ol>, and <li> work? How do we add images using <img>? What are src and alt? Why is alternative text important? How do image paths work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "What Are Semantic HTML Elements?",
                  "agenda": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?",
                  "sessionId": "session-1787638823996-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "Why is semantic HTML important? What are <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>? What is the difference between semantic and non-semantic elements? How does semantic HTML improve accessibility and SEO?"
                }
              ],
              "title": "HTML5 Document Structure & Semantic Elements",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_3",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 AM",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Build Tables?",
                  "agenda": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "When should tables be used? How do <table>, <tr>, <th>, and <td> work? How do <thead>, <tbody>, and <tfoot> improve structure? How do colspan and rowspan work? How can table data be structured semantically?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Do HTML Forms Work?",
                  "agenda": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is a form? How do <form>, <label>, <input>, <textarea>, <select>, and <button> work? What are action and method? How are form controls connected to labels?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "What HTML5 Input Types Should We Use?",
                  "agenda": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What is the difference between text, email, password, number, tel, date, time, url, file, radio, and checkbox? When should each input type be used? How do name, value, placeholder, and autocomplete work?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 AM",
                  "type": "LIVE CLASS",
                  "title": "How Does HTML5 Form Validation Work?",
                  "agenda": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?",
                  "sessionId": "session-1787639889057-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "HTML5 & Web Architecture",
                  "description": "What does required do? How do minlength and maxlength work? How are min and max used? What does pattern do? How does type=\"email\" provide validation? How can disabled, readonly, and checked be used?"
                }
              ],
              "title": "HTML Forms, Input Types, & Client-Side Validation",
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_4",
              "items": [],
              "title": "HTML Tables, Media Tags & Accessibility"
            }
          ],
          "modules": [
            {
              "id": "l_html_1",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "top-html1-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "How the Web Works",
                  "agenda": "Client-Server architecture, role of browsers, web servers, DNS lookup, and IP addressing.",
                  "actionText": "JOIN",
                  "description": "Client-Server architecture, role of browsers, web servers, DNS lookup, and IP addressing."
                },
                {
                  "id": "top-html1-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "HTTP/HTTPS Protocol Basics",
                  "agenda": "HTTP methods (GET, POST, PUT, DELETE), status codes (200, 301, 404, 500), headers and payloads.",
                  "actionText": "JOIN",
                  "description": "HTTP methods (GET, POST, PUT, DELETE), status codes (200, 301, 404, 500), headers and payloads."
                },
                {
                  "id": "top-html1-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "HTML Document Structure",
                  "agenda": "Doctype html, html, head, meta charset, title, and body tag responsibilities.",
                  "actionText": "JOIN",
                  "description": "Doctype html, html, head, meta charset, title, and body tag responsibilities."
                }
              ],
              "title": "Web Architecture & Client-Server Communication Model",
              "topics": [
                {
                  "id": "top-html1-1",
                  "title": "How the Web Works",
                  "agenda": "Client-Server architecture, role of browsers, web servers, DNS lookup, and IP addressing.",
                  "description": "Client-Server architecture, role of browsers, web servers, DNS lookup, and IP addressing."
                },
                {
                  "id": "top-html1-2",
                  "title": "HTTP/HTTPS Protocol Basics",
                  "agenda": "HTTP methods (GET, POST, PUT, DELETE), status codes (200, 301, 404, 500), headers and payloads.",
                  "description": "HTTP methods (GET, POST, PUT, DELETE), status codes (200, 301, 404, 500), headers and payloads."
                },
                {
                  "id": "top-html1-3",
                  "title": "HTML Document Structure",
                  "agenda": "Doctype html, html, head, meta charset, title, and body tag responsibilities.",
                  "description": "Doctype html, html, head, meta charset, title, and body tag responsibilities."
                }
              ],
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_2",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 PM",
              "items": [
                {
                  "id": "top-html2-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Semantic vs Non-Semantic HTML",
                  "agenda": "Why clean semantic layout improves SEO and accessibility; adopting header, nav, main, section, article, aside, and footer.",
                  "actionText": "JOIN",
                  "description": "Why clean semantic layout improves SEO and accessibility; adopting header, nav, main, section, article, aside, and footer."
                },
                {
                  "id": "top-html2-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Text Hierarchy & Formatting",
                  "agenda": "Proper h1 to h6 hierarchy, paragraphs, spans, strong, em, blockquotes, and inline formatting.",
                  "actionText": "JOIN",
                  "description": "Proper h1 to h6 hierarchy, paragraphs, spans, strong, em, blockquotes, and inline formatting."
                },
                {
                  "id": "top-html2-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Hyperlinks & Navigational Anchors",
                  "agenda": "Absolute vs relative links, target _blank security, and internal anchor jumps.",
                  "actionText": "JOIN",
                  "description": "Absolute vs relative links, target _blank security, and internal anchor jumps."
                }
              ],
              "title": "HTML5 Document Structure & Semantic Elements",
              "topics": [
                {
                  "id": "top-html2-1",
                  "title": "Semantic vs Non-Semantic HTML",
                  "agenda": "Why clean semantic layout improves SEO and accessibility; adopting header, nav, main, section, article, aside, and footer.",
                  "description": "Why clean semantic layout improves SEO and accessibility; adopting header, nav, main, section, article, aside, and footer."
                },
                {
                  "id": "top-html2-2",
                  "title": "Text Hierarchy & Formatting",
                  "agenda": "Proper h1 to h6 hierarchy, paragraphs, spans, strong, em, blockquotes, and inline formatting.",
                  "description": "Proper h1 to h6 hierarchy, paragraphs, spans, strong, em, blockquotes, and inline formatting."
                },
                {
                  "id": "top-html2-3",
                  "title": "Hyperlinks & Navigational Anchors",
                  "agenda": "Absolute vs relative links, target _blank security, and internal anchor jumps.",
                  "description": "Absolute vs relative links, target _blank security, and internal anchor jumps."
                }
              ],
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_3",
              "date": "2026-08-25",
              "time": "06:00 - 07:30 AM",
              "items": [
                {
                  "id": "top-html3-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Form Architecture & Attributes",
                  "agenda": "Form action and method POST/GET, label association with input IDs, and form submission lifecycle.",
                  "actionText": "JOIN",
                  "description": "Form action and method POST/GET, label association with input IDs, and form submission lifecycle."
                },
                {
                  "id": "top-html3-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "HTML5 Input Variety",
                  "agenda": "text, email, password, number, tel, date, checkbox, radio, select dropdowns, and textarea.",
                  "actionText": "JOIN",
                  "description": "text, email, password, number, tel, date, checkbox, radio, select dropdowns, and textarea."
                },
                {
                  "id": "top-html3-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Native Validation Attributes",
                  "agenda": "required, minlength, maxlength, min, max, pattern regular expressions, and client-side validation UI.",
                  "actionText": "JOIN",
                  "description": "required, minlength, maxlength, min, max, pattern regular expressions, and client-side validation UI."
                }
              ],
              "title": "HTML Forms, Input Types, & Client-Side Validation",
              "topics": [
                {
                  "id": "top-html3-1",
                  "title": "Form Architecture & Attributes",
                  "agenda": "Form action and method POST/GET, label association with input IDs, and form submission lifecycle.",
                  "description": "Form action and method POST/GET, label association with input IDs, and form submission lifecycle."
                },
                {
                  "id": "top-html3-2",
                  "title": "HTML5 Input Variety",
                  "agenda": "text, email, password, number, tel, date, checkbox, radio, select dropdowns, and textarea.",
                  "description": "text, email, password, number, tel, date, checkbox, radio, select dropdowns, and textarea."
                },
                {
                  "id": "top-html3-3",
                  "title": "Native Validation Attributes",
                  "agenda": "required, minlength, maxlength, min, max, pattern regular expressions, and client-side validation UI.",
                  "description": "required, minlength, maxlength, min, max, pattern regular expressions, and client-side validation UI."
                }
              ],
              "instructor": "Siva Veludurthi",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_html_4",
              "items": [
                {
                  "id": "top-html4-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Data Tables Structure",
                  "agenda": "table, thead, tbody, tfoot, tr, th, td, colspan, and rowspan attributes.",
                  "actionText": "JOIN",
                  "description": "table, thead, tbody, tfoot, tr, th, td, colspan, and rowspan attributes."
                },
                {
                  "id": "top-html4-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Embedding Media",
                  "agenda": "img with alt attributes for accessibility, audio, video with controls, and iframe embeddings.",
                  "actionText": "JOIN",
                  "description": "img with alt attributes for accessibility, audio, video with controls, and iframe embeddings."
                },
                {
                  "id": "top-html4-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Web Accessibility (a11y) Basics",
                  "agenda": "ARIA roles, tabindex, semantic landmark navigation, and screen-reader testing fundamentals.",
                  "actionText": "JOIN",
                  "description": "ARIA roles, tabindex, semantic landmark navigation, and screen-reader testing fundamentals."
                }
              ],
              "title": "HTML Tables, Media Tags & Accessibility",
              "topics": [
                {
                  "id": "top-html4-1",
                  "title": "Data Tables Structure",
                  "agenda": "table, thead, tbody, tfoot, tr, th, td, colspan, and rowspan attributes.",
                  "description": "table, thead, tbody, tfoot, tr, th, td, colspan, and rowspan attributes."
                },
                {
                  "id": "top-html4-2",
                  "title": "Embedding Media",
                  "agenda": "img with alt attributes for accessibility, audio, video with controls, and iframe embeddings.",
                  "description": "img with alt attributes for accessibility, audio, video with controls, and iframe embeddings."
                },
                {
                  "id": "top-html4-3",
                  "title": "Web Accessibility (a11y) Basics",
                  "agenda": "ARIA roles, tabindex, semantic landmark navigation, and screen-reader testing fundamentals.",
                  "description": "ARIA roles, tabindex, semantic landmark navigation, and screen-reader testing fundamentals."
                }
              ]
            }
          ],
          "duration": "1 Week",
          "modulesCount": 4
        },
        {
          "id": "m1_css_fund",
          "title": "CSS3 Fundamentals & Box Model",
          "lessons": [
            {
              "id": "l_css_1",
              "items": [],
              "title": "CSS Syntax, Rules, and Element/Class/ID Selectors"
            },
            {
              "id": "l_css_2",
              "items": [],
              "title": "The CSS Box Model: Margin, Padding, Border, & Content"
            },
            {
              "id": "l_css_3",
              "items": [
                {
                  "id": "t-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Work With Colors & Backgrounds?",
                  "agenda": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do named colors, HEX, RGB, RGBA, HSL, and HSLA work? How do we set background-color? How do background-image, background-repeat, background-position, background-size, and background shorthand work?"
                },
                {
                  "id": "t-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Style Typography?",
                  "agenda": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do font-family, font-size, font-weight, and font-style work? How do line-height, letter-spacing, and word-spacing affect readability? How do we use text-align, text-decoration, text-transform, and text-shadow?"
                },
                {
                  "id": "t-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Combine CSS Concepts to Build a Layout?",
                  "agenda": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How do selectors, spacing, colors, typography, borders, backgrounds, and the Box Model work together? How can we structure a landing page section? How do we style navigation, hero content, buttons, and cards?"
                },
                {
                  "id": "t-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "How Do We Write Maintainable CSS?",
                  "agenda": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "How should CSS classes be named? Why should reusable classes be preferred? How can duplicate CSS be avoided? Why should !important be minimized? How should stylesheets be organized for maintainability?"
                },
                {
                  "id": "t-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "date": "2026-08-25",
                  "time": "06:00 - 07:30 PM",
                  "type": "LIVE CLASS",
                  "title": "Final Hands-On Project — Styled Landing Page",
                  "agenda": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "iconBg": "bg-purple-600 text-white",
                  "btnStyle": "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30",
                  "iconName": "Video",
                  "overview": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?",
                  "sessionId": "session-1787643722016-w",
                  "typeColor": "bg-purple-100 text-purple-700 border-purple-200",
                  "actionText": "JOIN",
                  "instructor": "Siva Veludurthi",
                  "technology": "CSS",
                  "description": "Create a complete landing page using HTML and CSS? Can you build a navigation bar, hero section, call-to-action button, feature cards, typography system, backgrounds, borders, spacing, and consistent Box Model styling? Can you inspect and debug the final layout using Developer Tools?"
                }
              ],
              "title": "CSS Colors, Typography, & Visual Backgrounds",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "modules": [
            {
              "id": "l_css_1",
              "items": [
                {
                  "id": "top-css1-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "CSS Inclusion Methods",
                  "agenda": "Inline styles, internal style tags, and external stylesheet linking.",
                  "actionText": "JOIN",
                  "description": "Inline styles, internal style tags, and external stylesheet linking."
                },
                {
                  "id": "top-css1-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "CSS Selectors & Specificity",
                  "agenda": "Element, class, id, universal, attribute, and pseudo-classes (:hover, :focus, :active). Specificity score calculation.",
                  "actionText": "JOIN",
                  "description": "Element, class, id, universal, attribute, and pseudo-classes (:hover, :focus, :active). Specificity score calculation."
                },
                {
                  "id": "top-css1-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "The Cascade & Inheritance",
                  "agenda": "How CSS rules resolve, source order, !important hazards, and inherited vs non-inherited properties.",
                  "actionText": "JOIN",
                  "description": "How CSS rules resolve, source order, !important hazards, and inherited vs non-inherited properties."
                }
              ],
              "title": "CSS Syntax, Rules, and Element/Class/ID Selectors",
              "topics": [
                {
                  "id": "top-css1-1",
                  "title": "CSS Inclusion Methods",
                  "agenda": "Inline styles, internal style tags, and external stylesheet linking.",
                  "description": "Inline styles, internal style tags, and external stylesheet linking."
                },
                {
                  "id": "top-css1-2",
                  "title": "CSS Selectors & Specificity",
                  "agenda": "Element, class, id, universal, attribute, and pseudo-classes (:hover, :focus, :active). Specificity score calculation.",
                  "description": "Element, class, id, universal, attribute, and pseudo-classes (:hover, :focus, :active). Specificity score calculation."
                },
                {
                  "id": "top-css1-3",
                  "title": "The Cascade & Inheritance",
                  "agenda": "How CSS rules resolve, source order, !important hazards, and inherited vs non-inherited properties.",
                  "description": "How CSS rules resolve, source order, !important hazards, and inherited vs non-inherited properties."
                }
              ]
            },
            {
              "id": "l_css_2",
              "items": [
                {
                  "id": "top-css2-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Box Model Anatomy",
                  "agenda": "Content dimensions (width/height), padding, border, and margin areas.",
                  "actionText": "JOIN",
                  "description": "Content dimensions (width/height), padding, border, and margin areas."
                },
                {
                  "id": "top-css2-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "box-sizing: border-box Standard",
                  "agenda": "Difference between content-box and border-box sizing and universal resetting (* { box-sizing: border-box; }).",
                  "actionText": "JOIN",
                  "description": "Difference between content-box and border-box sizing and universal resetting (* { box-sizing: border-box; })."
                },
                {
                  "id": "top-css2-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Margin Collapsing & Spacing",
                  "agenda": "Vertical margin collapse behavior, padding vs margin usage rules, and outline vs border.",
                  "actionText": "JOIN",
                  "description": "Vertical margin collapse behavior, padding vs margin usage rules, and outline vs border."
                }
              ],
              "title": "The CSS Box Model: Margin, Padding, Border, & Content",
              "topics": [
                {
                  "id": "top-css2-1",
                  "title": "Box Model Anatomy",
                  "agenda": "Content dimensions (width/height), padding, border, and margin areas.",
                  "description": "Content dimensions (width/height), padding, border, and margin areas."
                },
                {
                  "id": "top-css2-2",
                  "title": "box-sizing: border-box Standard",
                  "agenda": "Difference between content-box and border-box sizing and universal resetting (* { box-sizing: border-box; }).",
                  "description": "Difference between content-box and border-box sizing and universal resetting (* { box-sizing: border-box; })."
                },
                {
                  "id": "top-css2-3",
                  "title": "Margin Collapsing & Spacing",
                  "agenda": "Vertical margin collapse behavior, padding vs margin usage rules, and outline vs border.",
                  "description": "Vertical margin collapse behavior, padding vs margin usage rules, and outline vs border."
                }
              ]
            },
            {
              "id": "l_css_3",
              "items": [
                {
                  "id": "top-css3-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Color Systems in CSS",
                  "agenda": "Named colors, Hexadecimal (#rrggbb), RGB/RGBA, HSL/HSLA, and CSS custom color variables.",
                  "actionText": "JOIN",
                  "description": "Named colors, Hexadecimal (#rrggbb), RGB/RGBA, HSL/HSLA, and CSS custom color variables."
                },
                {
                  "id": "top-css3-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Typography & Web Fonts",
                  "agenda": "font-family stacks, Google Fonts @import/link, font-weight, font-size (px, rem, em), and line-height.",
                  "actionText": "JOIN",
                  "description": "font-family stacks, Google Fonts @import/link, font-weight, font-size (px, rem, em), and line-height."
                },
                {
                  "id": "top-css3-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Backgrounds & Gradients",
                  "agenda": "background-color, background-image, background-size (cover/contain), linear and radial gradients.",
                  "actionText": "JOIN",
                  "description": "background-color, background-image, background-size (cover/contain), linear and radial gradients."
                }
              ],
              "title": "CSS Colors, Typography, & Visual Backgrounds",
              "topics": [
                {
                  "id": "top-css3-1",
                  "title": "Color Systems in CSS",
                  "agenda": "Named colors, Hexadecimal (#rrggbb), RGB/RGBA, HSL/HSLA, and CSS custom color variables.",
                  "description": "Named colors, Hexadecimal (#rrggbb), RGB/RGBA, HSL/HSLA, and CSS custom color variables."
                },
                {
                  "id": "top-css3-2",
                  "title": "Typography & Web Fonts",
                  "agenda": "font-family stacks, Google Fonts @import/link, font-weight, font-size (px, rem, em), and line-height.",
                  "description": "font-family stacks, Google Fonts @import/link, font-weight, font-size (px, rem, em), and line-height."
                },
                {
                  "id": "top-css3-3",
                  "title": "Backgrounds & Gradients",
                  "agenda": "background-color, background-image, background-size (cover/contain), linear and radial gradients.",
                  "description": "background-color, background-image, background-size (cover/contain), linear and radial gradients."
                }
              ],
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_css_adv",
          "title": "Advanced CSS Layouts & Responsive Design",
          "lessons": [
            {
              "id": "l_css_adv_1",
              "items": [],
              "title": "Flexbox Architecture & Practical Alignments"
            },
            {
              "id": "l_css_adv_2",
              "items": [],
              "title": "CSS Grid System & Multi-Column Layouts"
            },
            {
              "id": "l_css_adv_3",
              "items": [],
              "title": "Positioning: Relative, Absolute, Fixed, Sticky"
            },
            {
              "id": "l_css_adv_4",
              "items": [],
              "title": "Media Queries & Responsive UI Design Patterns"
            }
          ],
          "modules": [
            {
              "id": "l_css_adv_1",
              "items": [
                {
                  "id": "top-flex-1",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Flex Container & Main/Cross Axis",
                  "agenda": "display: flex, flex-direction (row, column), and understanding primary vs cross alignment axes.",
                  "actionText": "JOIN",
                  "description": "display: flex, flex-direction (row, column), and understanding primary vs cross alignment axes."
                },
                {
                  "id": "top-flex-2",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Aligning & Distributing Items",
                  "agenda": "justify-content (flex-start, center, space-between, space-around, space-evenly) and align-items (stretch, center, flex-start, flex-end).",
                  "actionText": "JOIN",
                  "description": "justify-content (flex-start, center, space-between, space-around, space-evenly) and align-items (stretch, center, flex-start, flex-end)."
                },
                {
                  "id": "top-flex-3",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Multi-Line Wrapping & Align-Content",
                  "agenda": "flex-wrap: wrap, row-gap, column-gap, and align-content multi-line spacing.",
                  "actionText": "JOIN",
                  "description": "flex-wrap: wrap, row-gap, column-gap, and align-content multi-line spacing."
                },
                {
                  "id": "top-flex-4",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Flex Item Sizing Controls",
                  "agenda": "flex-grow, flex-shrink, flex-basis shorthand (flex: 1), and align-self individual overrides.",
                  "actionText": "JOIN",
                  "description": "flex-grow, flex-shrink, flex-basis shorthand (flex: 1), and align-self individual overrides."
                },
                {
                  "id": "top-flex-5",
                  "url": "https://meet.google.com/aspire-lms-live",
                  "type": "LIVE CLASS",
                  "title": "Real-world Flexbox Layouts",
                  "agenda": "Building responsive navigation bars, centered cards, holy grail layouts, and sticky footers with Flexbox.",
                  "actionText": "JOIN",
                  "description": "Building responsive navigation bars, centered cards, holy grail layouts, and sticky footers with Flexbox."
                }
              ],
              "title": "Flexbox Architecture & Practical Alignments",
              "topics": [
                {
                  "id": "top-flex-1",
                  "title": "Flex Container & Main/Cross Axis",
                  "agenda": "display: flex, flex-direction (row, column), and understanding primary vs cross alignment axes.",
                  "description": "display: flex, flex-direction (row, column), and understanding primary vs cross alignment axes."
                },
                {
                  "id": "top-flex-2",
                  "title": "Aligning & Distributing Items",
                  "agenda": "justify-content (flex-start, center, space-between, space-around, space-evenly) and align-items (stretch, center, flex-start, flex-end).",
                  "description": "justify-content (flex-start, center, space-between, space-around, space-evenly) and align-items (stretch, center, flex-start, flex-end)."
                },
                {
                  "id": "top-flex-3",
                  "title": "Multi-Line Wrapping & Align-Content",
                  "agenda": "flex-wrap: wrap, row-gap, column-gap, and align-content multi-line spacing.",
                  "description": "flex-wrap: wrap, row-gap, column-gap, and align-content multi-line spacing."
                },
                {
                  "id": "top-flex-4",
                  "title": "Flex Item Sizing Controls",
                  "agenda": "flex-grow, flex-shrink, flex-basis shorthand (flex: 1), and align-self individual overrides.",
                  "description": "flex-grow, flex-shrink, flex-basis shorthand (flex: 1), and align-self individual overrides."
                },
                {
                  "id": "top-flex-5",
                  "title": "Real-world Flexbox Layouts",
                  "agenda": "Building responsive navigation bars, centered cards, holy grail layouts, and sticky footers with Flexbox.",
                  "description": "Building responsive navigation bars, centered cards, holy grail layouts, and sticky footers with Flexbox."
                }
              ]
            },
            {
              "id": "l_css_adv_2",
              "items": [],
              "title": "CSS Grid System & Multi-Column Layouts"
            },
            {
              "id": "l_css_adv_3",
              "items": [],
              "title": "Positioning: Relative, Absolute, Fixed, Sticky"
            },
            {
              "id": "l_css_adv_4",
              "items": [],
              "title": "Media Queries & Responsive UI Design Patterns"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_bootstrap",
          "title": "Bootstrap 5 Framework",
          "lessons": [
            {
              "id": "l_boot_1",
              "items": [],
              "title": "Bootstrap 5 Grid System & Responsive Utilities"
            },
            {
              "id": "l_boot_2",
              "items": [],
              "title": "Bootstrap Components (Navbar, Modals, Cards, Forms)"
            },
            {
              "id": "l_boot_3",
              "items": [],
              "title": "Customizing Bootstrap Styles & Themes"
            }
          ],
          "modules": [
            {
              "id": "l_boot_1",
              "items": [],
              "title": "Bootstrap 5 Grid System & Responsive Utilities"
            },
            {
              "id": "l_boot_2",
              "items": [],
              "title": "Bootstrap Components (Navbar, Modals, Cards, Forms)"
            },
            {
              "id": "l_boot_3",
              "items": [],
              "title": "Customizing Bootstrap Styles & Themes"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_js_ess",
          "title": "JavaScript Essentials & Control Flow",
          "lessons": [
            {
              "id": "l_js_1",
              "items": [],
              "title": "JS Setup, Variables (var, let, const), & Data Types"
            },
            {
              "id": "l_js_2",
              "items": [],
              "title": "Operators, Expressions, and Conditional Statements"
            },
            {
              "id": "l_js_3",
              "items": [],
              "title": "Loops: for, while, forEach, & Iterations"
            }
          ],
          "modules": [
            {
              "id": "l_js_1",
              "items": [],
              "title": "JS Setup, Variables (var, let, const), & Data Types"
            },
            {
              "id": "l_js_2",
              "items": [],
              "title": "Operators, Expressions, and Conditional Statements"
            },
            {
              "id": "l_js_3",
              "items": [],
              "title": "Loops: for, while, forEach, & Iterations"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_js_func",
          "title": "JavaScript Functions, Objects & Arrays",
          "lessons": [
            {
              "id": "l_js_func_1",
              "items": [],
              "title": "Function Declarations, Expressions, & Arrow Functions"
            },
            {
              "id": "l_js_func_2",
              "items": [],
              "title": "Advanced Array Methods (map, filter, reduce)"
            },
            {
              "id": "l_js_func_3",
              "items": [],
              "title": "Object Manipulation & Higher-Order Functions"
            }
          ],
          "modules": [
            {
              "id": "l_js_func_1",
              "items": [],
              "title": "Function Declarations, Expressions, & Arrow Functions"
            },
            {
              "id": "l_js_func_2",
              "items": [],
              "title": "Advanced Array Methods (map, filter, reduce)"
            },
            {
              "id": "l_js_func_3",
              "items": [],
              "title": "Object Manipulation & Higher-Order Functions"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_dom",
          "title": "DOM Manipulation & Event Handling",
          "lessons": [
            {
              "id": "l_dom_1",
              "items": [],
              "title": "Selecting and Modifying DOM Elements Dynamically"
            },
            {
              "id": "l_dom_2",
              "items": [],
              "title": "Event Listeners, Bubbling, and Delegation Patterns"
            },
            {
              "id": "l_dom_3",
              "items": [],
              "title": "Form Validation & Dynamic HTML Creation"
            }
          ],
          "modules": [
            {
              "id": "l_dom_1",
              "items": [],
              "title": "Selecting and Modifying DOM Elements Dynamically"
            },
            {
              "id": "l_dom_2",
              "items": [],
              "title": "Event Listeners, Bubbling, and Delegation Patterns"
            },
            {
              "id": "l_dom_3",
              "items": [],
              "title": "Form Validation & Dynamic HTML Creation"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m1_es6",
          "title": "Modern ES6+ & Asynchronous JS",
          "lessons": [
            {
              "id": "l_es6_1",
              "items": [],
              "title": "Destructuring, Spread/Rest Operators, and Modules"
            },
            {
              "id": "l_es6_2",
              "items": [],
              "title": "Promises, Async/Await, and Fetch API Integration"
            },
            {
              "id": "l_es6_3",
              "items": [],
              "title": "Handling JSON Data & Dynamic API Integrations"
            }
          ],
          "modules": [
            {
              "id": "l_es6_1",
              "items": [],
              "title": "Destructuring, Spread/Rest Operators, and Modules"
            },
            {
              "id": "l_es6_2",
              "items": [],
              "title": "Promises, Async/Await, and Fetch API Integration"
            },
            {
              "id": "l_es6_3",
              "items": [],
              "title": "Handling JSON Data & Dynamic API Integrations"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "stageNumber": "STAGE 01"
    },
    {
      "id": "s2",
      "title": "Stage 2: Backend + DSA",
      "modules": [
        {
          "id": "m2_py_fund",
          "title": "Python Fundamentals & Control Flow",
          "lessons": [
            {
              "id": "l_py_1",
              "date": "2026-08-25",
              "time": "10:00 - 10:15 AM",
              "items": [],
              "title": "Python Setup, Variables, Data Types & Control Flow",
              "instructor": "Siva V",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_py_2",
              "items": [],
              "title": "Functions & Variable Scope in Python"
            },
            {
              "id": "l_py_3",
              "items": [],
              "title": "Built-in Data Structures: Lists, Tuples, Sets, Dicts"
            }
          ],
          "modules": [
            {
              "id": "l_py_1",
              "date": "2026-08-25",
              "time": "10:00 - 10:15 AM",
              "items": [],
              "title": "Python Setup, Variables, Data Types & Control Flow",
              "instructor": "Siva V",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_py_2",
              "items": [],
              "title": "Functions & Variable Scope in Python"
            },
            {
              "id": "l_py_3",
              "items": [],
              "title": "Built-in Data Structures: Lists, Tuples, Sets, Dicts"
            }
          ],
          "duration": "1 Week",
          "modulesCount": 3
        },
        {
          "id": "m2_py_oop",
          "title": "Python OOP & Advanced Concepts",
          "lessons": [
            {
              "id": "l_py_oop_1",
              "items": [],
              "title": "Object-Oriented Programming (Classes, Objects, Inheritance)"
            },
            {
              "id": "l_py_oop_2",
              "items": [],
              "title": "Encapsulation, Polymorphism & Magic Methods"
            },
            {
              "id": "l_py_oop_3",
              "items": [],
              "title": "Exception Handling, File I/O & Custom Decorators"
            }
          ],
          "modules": [
            {
              "id": "l_py_oop_1",
              "items": [],
              "title": "Object-Oriented Programming (Classes, Objects, Inheritance)"
            },
            {
              "id": "l_py_oop_2",
              "items": [],
              "title": "Encapsulation, Polymorphism & Magic Methods"
            },
            {
              "id": "l_py_oop_3",
              "items": [],
              "title": "Exception Handling, File I/O & Custom Decorators"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_postgres",
          "title": "PostgreSQL & Database Architecture",
          "lessons": [
            {
              "id": "l_db_1",
              "items": [],
              "title": "Relational Database Design & Schema Normalization"
            },
            {
              "id": "l_db_2",
              "items": [],
              "title": "Complex SQL Queries, Subqueries & Window Functions"
            },
            {
              "id": "l_db_3",
              "items": [],
              "title": "Indexes, Transactions, ACID Properties & Query Optimization"
            }
          ],
          "modules": [
            {
              "id": "l_db_1",
              "items": [],
              "title": "Relational Database Design & Schema Normalization"
            },
            {
              "id": "l_db_2",
              "items": [],
              "title": "Complex SQL Queries, Subqueries & Window Functions"
            },
            {
              "id": "l_db_3",
              "items": [],
              "title": "Indexes, Transactions, ACID Properties & Query Optimization"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_django_api",
          "title": "Django & REST API Development",
          "lessons": [
            {
              "id": "l_dj_1",
              "items": [],
              "title": "Django Architecture, MTV Pattern & Project Setup"
            },
            {
              "id": "l_dj_2",
              "items": [],
              "title": "Django ORM, Models, Migrations & Admin Panel"
            },
            {
              "id": "l_dj_3",
              "items": [],
              "title": "Django REST Framework (DRF) Serializers & ViewSets"
            },
            {
              "id": "l_dj_4",
              "items": [],
              "title": "JWT Authentication, Permissions & Middleware"
            }
          ],
          "modules": [
            {
              "id": "l_dj_1",
              "items": [],
              "title": "Django Architecture, MTV Pattern & Project Setup"
            },
            {
              "id": "l_dj_2",
              "items": [],
              "title": "Django ORM, Models, Migrations & Admin Panel"
            },
            {
              "id": "l_dj_3",
              "items": [],
              "title": "Django REST Framework (DRF) Serializers & ViewSets"
            },
            {
              "id": "l_dj_4",
              "items": [],
              "title": "JWT Authentication, Permissions & Middleware"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_arrays",
          "title": "DSA: Arrays, Strings & Pointers",
          "lessons": [
            {
              "id": "l_dsa_arr_1",
              "items": [],
              "title": "Two Pointers & Sliding Window Techniques"
            },
            {
              "id": "l_dsa_arr_2",
              "items": [],
              "title": "Prefix Sum, Kadane's Algorithm & Subarray Problems"
            },
            {
              "id": "l_dsa_arr_3",
              "items": [],
              "title": "String Manipulation & Pattern Matching Algorithms"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_arr_1",
              "items": [],
              "title": "Two Pointers & Sliding Window Techniques"
            },
            {
              "id": "l_dsa_arr_2",
              "items": [],
              "title": "Prefix Sum, Kadane's Algorithm & Subarray Problems"
            },
            {
              "id": "l_dsa_arr_3",
              "items": [],
              "title": "String Manipulation & Pattern Matching Algorithms"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_linkedlist",
          "title": "DSA: Stacks, Queues & Linked Lists",
          "lessons": [
            {
              "id": "l_dsa_ll_1",
              "items": [],
              "title": "Singly & Doubly Linked List Operations"
            },
            {
              "id": "l_dsa_ll_2",
              "items": [],
              "title": "Monotonic Stack, Parenthesis Matching & Next Greater Element"
            },
            {
              "id": "l_dsa_ll_3",
              "items": [],
              "title": "Queue, Deque & Priority Queue Implementations"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_ll_1",
              "items": [],
              "title": "Singly & Doubly Linked List Operations"
            },
            {
              "id": "l_dsa_ll_2",
              "items": [],
              "title": "Monotonic Stack, Parenthesis Matching & Next Greater Element"
            },
            {
              "id": "l_dsa_ll_3",
              "items": [],
              "title": "Queue, Deque & Priority Queue Implementations"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_trees",
          "title": "DSA: Trees, BST & Graphs",
          "lessons": [
            {
              "id": "l_dsa_tree_1",
              "items": [],
              "title": "Binary Trees: Inorder, Preorder, Postorder & Level Order"
            },
            {
              "id": "l_dsa_tree_2",
              "items": [],
              "title": "Binary Search Tree (BST) Validation, Insertion & Deletion"
            },
            {
              "id": "l_dsa_tree_3",
              "items": [],
              "title": "Graph BFS, DFS, Cycle Detection & Dijkstra's Algorithm"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_tree_1",
              "items": [],
              "title": "Binary Trees: Inorder, Preorder, Postorder & Level Order"
            },
            {
              "id": "l_dsa_tree_2",
              "items": [],
              "title": "Binary Search Tree (BST) Validation, Insertion & Deletion"
            },
            {
              "id": "l_dsa_tree_3",
              "items": [],
              "title": "Graph BFS, DFS, Cycle Detection & Dijkstra's Algorithm"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_dp",
          "title": "DSA: Recursion, Backtracking & DP",
          "lessons": [
            {
              "id": "l_dsa_dp_1",
              "items": [],
              "title": "Recursion Trees, Subset Generation & Backtracking"
            },
            {
              "id": "l_dsa_dp_2",
              "items": [],
              "title": "1D Dynamic Programming: Fib, Climbing Stairs, House Robber"
            },
            {
              "id": "l_dsa_dp_3",
              "items": [],
              "title": "2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_dp_1",
              "items": [],
              "title": "Recursion Trees, Subset Generation & Backtracking"
            },
            {
              "id": "l_dsa_dp_2",
              "items": [],
              "title": "1D Dynamic Programming: Fib, Climbing Stairs, House Robber"
            },
            {
              "id": "l_dsa_dp_3",
              "items": [],
              "title": "2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "duration": "8 Modules Included",
      "phaseTag": "Python Full Stack + DSA with AI • Stage 2",
      "subtopics": [
        {
          "id": "m2_py_fund",
          "title": "Python Fundamentals & Control Flow",
          "lessons": [
            {
              "id": "l_py_1",
              "date": "2026-08-25",
              "time": "10:00 - 10:15 AM",
              "items": [],
              "title": "Python Setup, Variables, Data Types & Control Flow",
              "instructor": "Siva V",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_py_2",
              "items": [],
              "title": "Functions & Variable Scope in Python"
            },
            {
              "id": "l_py_3",
              "items": [],
              "title": "Built-in Data Structures: Lists, Tuples, Sets, Dicts"
            }
          ],
          "modules": [
            {
              "id": "l_py_1",
              "date": "2026-08-25",
              "time": "10:00 - 10:15 AM",
              "items": [],
              "title": "Python Setup, Variables, Data Types & Control Flow",
              "instructor": "Siva V",
              "meetingLink": "https://meet.google.com/aspire-lms-live"
            },
            {
              "id": "l_py_2",
              "items": [],
              "title": "Functions & Variable Scope in Python"
            },
            {
              "id": "l_py_3",
              "items": [],
              "title": "Built-in Data Structures: Lists, Tuples, Sets, Dicts"
            }
          ],
          "duration": "1 Week",
          "modulesCount": 3
        },
        {
          "id": "m2_py_oop",
          "title": "Python OOP & Advanced Concepts",
          "lessons": [
            {
              "id": "l_py_oop_1",
              "items": [],
              "title": "Object-Oriented Programming (Classes, Objects, Inheritance)"
            },
            {
              "id": "l_py_oop_2",
              "items": [],
              "title": "Encapsulation, Polymorphism & Magic Methods"
            },
            {
              "id": "l_py_oop_3",
              "items": [],
              "title": "Exception Handling, File I/O & Custom Decorators"
            }
          ],
          "modules": [
            {
              "id": "l_py_oop_1",
              "items": [],
              "title": "Object-Oriented Programming (Classes, Objects, Inheritance)"
            },
            {
              "id": "l_py_oop_2",
              "items": [],
              "title": "Encapsulation, Polymorphism & Magic Methods"
            },
            {
              "id": "l_py_oop_3",
              "items": [],
              "title": "Exception Handling, File I/O & Custom Decorators"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_postgres",
          "title": "PostgreSQL & Database Architecture",
          "lessons": [
            {
              "id": "l_db_1",
              "items": [],
              "title": "Relational Database Design & Schema Normalization"
            },
            {
              "id": "l_db_2",
              "items": [],
              "title": "Complex SQL Queries, Subqueries & Window Functions"
            },
            {
              "id": "l_db_3",
              "items": [],
              "title": "Indexes, Transactions, ACID Properties & Query Optimization"
            }
          ],
          "modules": [
            {
              "id": "l_db_1",
              "items": [],
              "title": "Relational Database Design & Schema Normalization"
            },
            {
              "id": "l_db_2",
              "items": [],
              "title": "Complex SQL Queries, Subqueries & Window Functions"
            },
            {
              "id": "l_db_3",
              "items": [],
              "title": "Indexes, Transactions, ACID Properties & Query Optimization"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_django_api",
          "title": "Django & REST API Development",
          "lessons": [
            {
              "id": "l_dj_1",
              "items": [],
              "title": "Django Architecture, MTV Pattern & Project Setup"
            },
            {
              "id": "l_dj_2",
              "items": [],
              "title": "Django ORM, Models, Migrations & Admin Panel"
            },
            {
              "id": "l_dj_3",
              "items": [],
              "title": "Django REST Framework (DRF) Serializers & ViewSets"
            },
            {
              "id": "l_dj_4",
              "items": [],
              "title": "JWT Authentication, Permissions & Middleware"
            }
          ],
          "modules": [
            {
              "id": "l_dj_1",
              "items": [],
              "title": "Django Architecture, MTV Pattern & Project Setup"
            },
            {
              "id": "l_dj_2",
              "items": [],
              "title": "Django ORM, Models, Migrations & Admin Panel"
            },
            {
              "id": "l_dj_3",
              "items": [],
              "title": "Django REST Framework (DRF) Serializers & ViewSets"
            },
            {
              "id": "l_dj_4",
              "items": [],
              "title": "JWT Authentication, Permissions & Middleware"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_arrays",
          "title": "DSA: Arrays, Strings & Pointers",
          "lessons": [
            {
              "id": "l_dsa_arr_1",
              "items": [],
              "title": "Two Pointers & Sliding Window Techniques"
            },
            {
              "id": "l_dsa_arr_2",
              "items": [],
              "title": "Prefix Sum, Kadane's Algorithm & Subarray Problems"
            },
            {
              "id": "l_dsa_arr_3",
              "items": [],
              "title": "String Manipulation & Pattern Matching Algorithms"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_arr_1",
              "items": [],
              "title": "Two Pointers & Sliding Window Techniques"
            },
            {
              "id": "l_dsa_arr_2",
              "items": [],
              "title": "Prefix Sum, Kadane's Algorithm & Subarray Problems"
            },
            {
              "id": "l_dsa_arr_3",
              "items": [],
              "title": "String Manipulation & Pattern Matching Algorithms"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_linkedlist",
          "title": "DSA: Stacks, Queues & Linked Lists",
          "lessons": [
            {
              "id": "l_dsa_ll_1",
              "items": [],
              "title": "Singly & Doubly Linked List Operations"
            },
            {
              "id": "l_dsa_ll_2",
              "items": [],
              "title": "Monotonic Stack, Parenthesis Matching & Next Greater Element"
            },
            {
              "id": "l_dsa_ll_3",
              "items": [],
              "title": "Queue, Deque & Priority Queue Implementations"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_ll_1",
              "items": [],
              "title": "Singly & Doubly Linked List Operations"
            },
            {
              "id": "l_dsa_ll_2",
              "items": [],
              "title": "Monotonic Stack, Parenthesis Matching & Next Greater Element"
            },
            {
              "id": "l_dsa_ll_3",
              "items": [],
              "title": "Queue, Deque & Priority Queue Implementations"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_trees",
          "title": "DSA: Trees, BST & Graphs",
          "lessons": [
            {
              "id": "l_dsa_tree_1",
              "items": [],
              "title": "Binary Trees: Inorder, Preorder, Postorder & Level Order"
            },
            {
              "id": "l_dsa_tree_2",
              "items": [],
              "title": "Binary Search Tree (BST) Validation, Insertion & Deletion"
            },
            {
              "id": "l_dsa_tree_3",
              "items": [],
              "title": "Graph BFS, DFS, Cycle Detection & Dijkstra's Algorithm"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_tree_1",
              "items": [],
              "title": "Binary Trees: Inorder, Preorder, Postorder & Level Order"
            },
            {
              "id": "l_dsa_tree_2",
              "items": [],
              "title": "Binary Search Tree (BST) Validation, Insertion & Deletion"
            },
            {
              "id": "l_dsa_tree_3",
              "items": [],
              "title": "Graph BFS, DFS, Cycle Detection & Dijkstra's Algorithm"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "m2_dsa_dp",
          "title": "DSA: Recursion, Backtracking & DP",
          "lessons": [
            {
              "id": "l_dsa_dp_1",
              "items": [],
              "title": "Recursion Trees, Subset Generation & Backtracking"
            },
            {
              "id": "l_dsa_dp_2",
              "items": [],
              "title": "1D Dynamic Programming: Fib, Climbing Stairs, House Robber"
            },
            {
              "id": "l_dsa_dp_3",
              "items": [],
              "title": "2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS"
            }
          ],
          "modules": [
            {
              "id": "l_dsa_dp_1",
              "items": [],
              "title": "Recursion Trees, Subset Generation & Backtracking"
            },
            {
              "id": "l_dsa_dp_2",
              "items": [],
              "title": "1D Dynamic Programming: Fib, Climbing Stairs, House Robber"
            },
            {
              "id": "l_dsa_dp_3",
              "items": [],
              "title": "2D DP & Knapsack Problems: 0/1 Knapsack, LCS, LIS"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "stageNumber": "STAGE 02"
    },
    {
      "id": "s3",
      "title": "Stage 3: AI, Integration & Deployment",
      "modules": [
        {
          "id": "mod-stg3-m1",
          "title": "Module 1: Introduction to AI, Prompt Engineering & LLMs",
          "lessons": [
            {
              "id": "stg3-m1-mod1",
              "items": [],
              "title": "What is AI/ML/DL/LLM & Generative AI Ecosystem"
            },
            {
              "id": "stg3-m1-mod2",
              "items": [],
              "title": "Google Gemini & OpenAI API Setup and Access"
            },
            {
              "id": "stg3-m1-mod3",
              "items": [],
              "title": "Prompt Engineering Strategies & Few-Shot Prompting"
            }
          ],
          "modules": [
            {
              "id": "stg3-m1-mod1",
              "items": [],
              "title": "What is AI/ML/DL/LLM & Generative AI Ecosystem"
            },
            {
              "id": "stg3-m1-mod2",
              "items": [],
              "title": "Google Gemini & OpenAI API Setup and Access"
            },
            {
              "id": "stg3-m1-mod3",
              "items": [],
              "title": "Prompt Engineering Strategies & Few-Shot Prompting"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg3-m2",
          "title": "Module 2: AI Integration with Python & LangChain",
          "lessons": [
            {
              "id": "stg3-m2-mod1",
              "items": [],
              "title": "LangChain Framework Basics, Prompt Templates & Chains"
            },
            {
              "id": "stg3-m2-mod2",
              "items": [],
              "title": "Integrating OpenAI/Gemini APIs in Django Backend"
            },
            {
              "id": "stg3-m2-mod3",
              "items": [],
              "title": "Building Intelligent AI Chatbots & LLM Interfaces"
            }
          ],
          "modules": [
            {
              "id": "stg3-m2-mod1",
              "items": [],
              "title": "LangChain Framework Basics, Prompt Templates & Chains"
            },
            {
              "id": "stg3-m2-mod2",
              "items": [],
              "title": "Integrating OpenAI/Gemini APIs in Django Backend"
            },
            {
              "id": "stg3-m2-mod3",
              "items": [],
              "title": "Building Intelligent AI Chatbots & LLM Interfaces"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg3-m3",
          "title": "Module 3: Docker Containerization & Cloud Deployment",
          "lessons": [
            {
              "id": "stg3-m3-mod1",
              "items": [],
              "title": "Docker Concepts & Creating Dockerfiles"
            },
            {
              "id": "stg3-m3-mod2",
              "items": [],
              "title": "Containerizing Django Applications & Docker Compose"
            },
            {
              "id": "stg3-m3-mod3",
              "items": [],
              "title": "Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)"
            }
          ],
          "modules": [
            {
              "id": "stg3-m3-mod1",
              "items": [],
              "title": "Docker Concepts & Creating Dockerfiles"
            },
            {
              "id": "stg3-m3-mod2",
              "items": [],
              "title": "Containerizing Django Applications & Docker Compose"
            },
            {
              "id": "stg3-m3-mod3",
              "items": [],
              "title": "Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "duration": "3 Modules Included",
      "phaseTag": "Python Full Stack + DSA with AI • Stage 3",
      "subtopics": [
        {
          "id": "mod-stg3-m1",
          "title": "Module 1: Introduction to AI, Prompt Engineering & LLMs",
          "lessons": [
            {
              "id": "stg3-m1-mod1",
              "items": [],
              "title": "What is AI/ML/DL/LLM & Generative AI Ecosystem"
            },
            {
              "id": "stg3-m1-mod2",
              "items": [],
              "title": "Google Gemini & OpenAI API Setup and Access"
            },
            {
              "id": "stg3-m1-mod3",
              "items": [],
              "title": "Prompt Engineering Strategies & Few-Shot Prompting"
            }
          ],
          "modules": [
            {
              "id": "stg3-m1-mod1",
              "items": [],
              "title": "What is AI/ML/DL/LLM & Generative AI Ecosystem"
            },
            {
              "id": "stg3-m1-mod2",
              "items": [],
              "title": "Google Gemini & OpenAI API Setup and Access"
            },
            {
              "id": "stg3-m1-mod3",
              "items": [],
              "title": "Prompt Engineering Strategies & Few-Shot Prompting"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg3-m2",
          "title": "Module 2: AI Integration with Python & LangChain",
          "lessons": [
            {
              "id": "stg3-m2-mod1",
              "items": [],
              "title": "LangChain Framework Basics, Prompt Templates & Chains"
            },
            {
              "id": "stg3-m2-mod2",
              "items": [],
              "title": "Integrating OpenAI/Gemini APIs in Django Backend"
            },
            {
              "id": "stg3-m2-mod3",
              "items": [],
              "title": "Building Intelligent AI Chatbots & LLM Interfaces"
            }
          ],
          "modules": [
            {
              "id": "stg3-m2-mod1",
              "items": [],
              "title": "LangChain Framework Basics, Prompt Templates & Chains"
            },
            {
              "id": "stg3-m2-mod2",
              "items": [],
              "title": "Integrating OpenAI/Gemini APIs in Django Backend"
            },
            {
              "id": "stg3-m2-mod3",
              "items": [],
              "title": "Building Intelligent AI Chatbots & LLM Interfaces"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg3-m3",
          "title": "Module 3: Docker Containerization & Cloud Deployment",
          "lessons": [
            {
              "id": "stg3-m3-mod1",
              "items": [],
              "title": "Docker Concepts & Creating Dockerfiles"
            },
            {
              "id": "stg3-m3-mod2",
              "items": [],
              "title": "Containerizing Django Applications & Docker Compose"
            },
            {
              "id": "stg3-m3-mod3",
              "items": [],
              "title": "Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)"
            }
          ],
          "modules": [
            {
              "id": "stg3-m3-mod1",
              "items": [],
              "title": "Docker Concepts & Creating Dockerfiles"
            },
            {
              "id": "stg3-m3-mod2",
              "items": [],
              "title": "Containerizing Django Applications & Docker Compose"
            },
            {
              "id": "stg3-m3-mod3",
              "items": [],
              "title": "Deploying Full Stack Applications to Cloud (Render/AWS/Vercel)"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "stageNumber": "STAGE 03"
    },
    {
      "id": "s4",
      "title": "Stage 4: Career Launchpad",
      "modules": [
        {
          "id": "mod-stg4-m1",
          "title": "Module 1: System Design & Software Architecture",
          "lessons": [
            {
              "id": "stg4-m1-mod1",
              "items": [],
              "title": "System Design Fundamentals: HLD vs LLD"
            },
            {
              "id": "stg4-m1-mod2",
              "items": [],
              "title": "Load Balancing & Database Sharding"
            },
            {
              "id": "stg4-m1-mod3",
              "items": [],
              "title": "Caching Strategies & Scalable Web Architecture"
            }
          ],
          "modules": [
            {
              "id": "stg4-m1-mod1",
              "items": [],
              "title": "System Design Fundamentals: HLD vs LLD"
            },
            {
              "id": "stg4-m1-mod2",
              "items": [],
              "title": "Load Balancing & Database Sharding"
            },
            {
              "id": "stg4-m1-mod3",
              "items": [],
              "title": "Caching Strategies & Scalable Web Architecture"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m2",
          "title": "Module 2: Capstone Project Mentoring & Review - 1",
          "lessons": [
            {
              "id": "stg4-m2-mod1",
              "items": [],
              "title": "Project Scope Finalization & Architecture Validation"
            },
            {
              "id": "stg4-m2-mod2",
              "items": [],
              "title": "Database Design Review & API Contract Definition"
            }
          ],
          "modules": [
            {
              "id": "stg4-m2-mod1",
              "items": [],
              "title": "Project Scope Finalization & Architecture Validation"
            },
            {
              "id": "stg4-m2-mod2",
              "items": [],
              "title": "Database Design Review & API Contract Definition"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m3",
          "title": "Module 3: Capstone Project Development & Mentoring - 2",
          "lessons": [
            {
              "id": "stg4-m3-mod1",
              "items": [],
              "title": "Frontend-Backend Integration & AI Feature Tuning"
            },
            {
              "id": "stg4-m3-mod2",
              "items": [],
              "title": "Bug Fixing & Security Auditing"
            },
            {
              "id": "stg4-m3-mod3",
              "items": [],
              "title": "Performance Optimization"
            }
          ],
          "modules": [
            {
              "id": "stg4-m3-mod1",
              "items": [],
              "title": "Frontend-Backend Integration & AI Feature Tuning"
            },
            {
              "id": "stg4-m3-mod2",
              "items": [],
              "title": "Bug Fixing & Security Auditing"
            },
            {
              "id": "stg4-m3-mod3",
              "items": [],
              "title": "Performance Optimization"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m4",
          "title": "Module 4: Resume Building, LinkedIn & GitHub Portfolio",
          "lessons": [
            {
              "id": "stg4-m4-mod1",
              "items": [],
              "title": "Creating ATS-Compliant Resume & GitHub Presentation"
            },
            {
              "id": "stg4-m4-mod2",
              "items": [],
              "title": "README Design, Linkedin Profile Optimization & Branding"
            }
          ],
          "modules": [
            {
              "id": "stg4-m4-mod1",
              "items": [],
              "title": "Creating ATS-Compliant Resume & GitHub Presentation"
            },
            {
              "id": "stg4-m4-mod2",
              "items": [],
              "title": "README Design, Linkedin Profile Optimization & Branding"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m5",
          "title": "Module 5: Mock Technical Interviews & Valedictory",
          "lessons": [
            {
              "id": "stg4-m5-mod1",
              "items": [],
              "title": "Technical Coding Practice & DSA Live Problem Solving"
            },
            {
              "id": "stg4-m5-mod2",
              "items": [],
              "title": "HR Interview Prep, Capstone Demos, & Certification"
            }
          ],
          "modules": [
            {
              "id": "stg4-m5-mod1",
              "items": [],
              "title": "Technical Coding Practice & DSA Live Problem Solving"
            },
            {
              "id": "stg4-m5-mod2",
              "items": [],
              "title": "HR Interview Prep, Capstone Demos, & Certification"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "duration": "5 Modules Included",
      "phaseTag": "Python Full Stack + DSA with AI • Stage 4",
      "subtopics": [
        {
          "id": "mod-stg4-m1",
          "title": "Module 1: System Design & Software Architecture",
          "lessons": [
            {
              "id": "stg4-m1-mod1",
              "items": [],
              "title": "System Design Fundamentals: HLD vs LLD"
            },
            {
              "id": "stg4-m1-mod2",
              "items": [],
              "title": "Load Balancing & Database Sharding"
            },
            {
              "id": "stg4-m1-mod3",
              "items": [],
              "title": "Caching Strategies & Scalable Web Architecture"
            }
          ],
          "modules": [
            {
              "id": "stg4-m1-mod1",
              "items": [],
              "title": "System Design Fundamentals: HLD vs LLD"
            },
            {
              "id": "stg4-m1-mod2",
              "items": [],
              "title": "Load Balancing & Database Sharding"
            },
            {
              "id": "stg4-m1-mod3",
              "items": [],
              "title": "Caching Strategies & Scalable Web Architecture"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m2",
          "title": "Module 2: Capstone Project Mentoring & Review - 1",
          "lessons": [
            {
              "id": "stg4-m2-mod1",
              "items": [],
              "title": "Project Scope Finalization & Architecture Validation"
            },
            {
              "id": "stg4-m2-mod2",
              "items": [],
              "title": "Database Design Review & API Contract Definition"
            }
          ],
          "modules": [
            {
              "id": "stg4-m2-mod1",
              "items": [],
              "title": "Project Scope Finalization & Architecture Validation"
            },
            {
              "id": "stg4-m2-mod2",
              "items": [],
              "title": "Database Design Review & API Contract Definition"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m3",
          "title": "Module 3: Capstone Project Development & Mentoring - 2",
          "lessons": [
            {
              "id": "stg4-m3-mod1",
              "items": [],
              "title": "Frontend-Backend Integration & AI Feature Tuning"
            },
            {
              "id": "stg4-m3-mod2",
              "items": [],
              "title": "Bug Fixing & Security Auditing"
            },
            {
              "id": "stg4-m3-mod3",
              "items": [],
              "title": "Performance Optimization"
            }
          ],
          "modules": [
            {
              "id": "stg4-m3-mod1",
              "items": [],
              "title": "Frontend-Backend Integration & AI Feature Tuning"
            },
            {
              "id": "stg4-m3-mod2",
              "items": [],
              "title": "Bug Fixing & Security Auditing"
            },
            {
              "id": "stg4-m3-mod3",
              "items": [],
              "title": "Performance Optimization"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m4",
          "title": "Module 4: Resume Building, LinkedIn & GitHub Portfolio",
          "lessons": [
            {
              "id": "stg4-m4-mod1",
              "items": [],
              "title": "Creating ATS-Compliant Resume & GitHub Presentation"
            },
            {
              "id": "stg4-m4-mod2",
              "items": [],
              "title": "README Design, Linkedin Profile Optimization & Branding"
            }
          ],
          "modules": [
            {
              "id": "stg4-m4-mod1",
              "items": [],
              "title": "Creating ATS-Compliant Resume & GitHub Presentation"
            },
            {
              "id": "stg4-m4-mod2",
              "items": [],
              "title": "README Design, Linkedin Profile Optimization & Branding"
            }
          ],
          "duration": "1 Week"
        },
        {
          "id": "mod-stg4-m5",
          "title": "Module 5: Mock Technical Interviews & Valedictory",
          "lessons": [
            {
              "id": "stg4-m5-mod1",
              "items": [],
              "title": "Technical Coding Practice & DSA Live Problem Solving"
            },
            {
              "id": "stg4-m5-mod2",
              "items": [],
              "title": "HR Interview Prep, Capstone Demos, & Certification"
            }
          ],
          "modules": [
            {
              "id": "stg4-m5-mod1",
              "items": [],
              "title": "Technical Coding Practice & DSA Live Problem Solving"
            },
            {
              "id": "stg4-m5-mod2",
              "items": [],
              "title": "HR Interview Prep, Capstone Demos, & Certification"
            }
          ],
          "duration": "1 Week"
        }
      ],
      "stageNumber": "STAGE 04"
    }
  ]
};
