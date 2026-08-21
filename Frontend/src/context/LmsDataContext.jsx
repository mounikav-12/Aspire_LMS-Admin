import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import {
  INITIAL_COURSES,
  INITIAL_ASSESSMENTS,
  INITIAL_LIVE_SESSIONS,
  INITIAL_JOBS,
  INITIAL_RECORDINGS,
  INITIAL_PLACEMENT_RESOURCES,
  INITIAL_PROJECTS,
  INITIAL_CODING_QUESTIONS,
  INITIAL_MILESTONES,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_BADGES,
  INITIAL_REWARDS,
  MOCK_ACTIVITIES,
  ROLES
} from '../utils/mockData';

export const DEFAULT_WEEKDAY_BATCHES = ['A26W1', 'A26W2', 'A26W3'];
export const DEFAULT_WEEKEND_BATCHES = ['A26S1', 'A26S2', 'A26S3'];
export const INITIAL_BATCH_LIST = [...DEFAULT_WEEKDAY_BATCHES, ...DEFAULT_WEEKEND_BATCHES];

export const getStudentEnrolledCourses = (student, coursesList = []) => {
  if (!student) return [];

  const rawEnrolled = student.enrolledCourses !== undefined
    ? student.enrolledCourses
    : (student.enrolled_courses !== undefined ? student.enrolled_courses : null);

  if (rawEnrolled === null || rawEnrolled === undefined) {
    return [];
  }

  let directEnrolled = [];
  if (Array.isArray(rawEnrolled)) {
    directEnrolled = rawEnrolled;
  } else if (typeof rawEnrolled === 'string') {
    try {
      const parsed = JSON.parse(rawEnrolled);
      if (Array.isArray(parsed)) directEnrolled = parsed;
    } catch (e) {
      directEnrolled = [];
    }
  }

  const validDirectEnrolled = directEnrolled.filter((crsId) =>
    coursesList.length === 0 || coursesList.some((c) => c.id === crsId)
  );

  return Array.from(new Set(validDirectEnrolled));
};

export const generateAlphanumericCourseId = (title) => {
  if (!title) return `CRS${new Date().getFullYear()}`;
  
  const words = title.trim().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  let prefix = '';
  
  if (words.length >= 2) {
    prefix = words.slice(0, 4).map(w => w[0].toUpperCase()).join('');
  } else if (words.length === 1) {
    prefix = words[0].slice(0, 4).toUpperCase();
  } else {
    prefix = 'CRS';
  }

  const yearSuffix = new Date().getFullYear().toString();
  return `${prefix}${yearSuffix}`;
};

const LmsDataContext = createContext(null);

function cloneMilestoneData(milestoneData, batchSuffix) {
  if (!milestoneData) return { overview: {}, stages: [] };
  const raw = JSON.parse(JSON.stringify(milestoneData));
  const batchName = batchSuffix === 'w' ? 'Weekday Batch' : 'Weekend Batch';

  const tagObj = (obj) => {
    if (!obj) return;
    if (obj.id && !obj.id.endsWith(`-${batchSuffix}`)) {
      obj.id = `${obj.id}-${batchSuffix}`;
    }
    obj.targetBatch = batchName;
  };

  if (raw.overview) {
    raw.overview.trackTitle = raw.overview.trackTitle || "Python full stack + DSA with AI";
  }

  raw.stages = (raw.stages || []).map((stg) => {
    tagObj(stg);
    stg.subtopics = (stg.subtopics || []).map((sub) => {
      tagObj(sub);
      sub.modules = (sub.modules || []).map((mod) => {
        tagObj(mod);
        mod.items = (mod.items || []).map((itm) => {
          tagObj(itm);
          return itm;
        });
        return mod;
      });
      return sub;
    });
    return stg;
  });

  return raw;
}

function createInitialMilestonesByBatch() {
  return {
    'Weekday Batch': cloneMilestoneData(INITIAL_MILESTONES, 'w'),
    'Weekend Batch': cloneMilestoneData(INITIAL_MILESTONES, 's')
  };
}

function cloneBatchArray(initialData, suffix) {
  if (!Array.isArray(initialData)) return [];
  const batchName = suffix === 'w' ? 'Weekday Batch' : 'Weekend Batch';
  return initialData.map((item, idx) => ({
    ...JSON.parse(JSON.stringify(item)),
    id: item.id ? (item.id.includes(`-${suffix}`) ? item.id : `${item.id}-${suffix}`) : `${idx}-${suffix}`,
    targetBatch: batchName
  }));
}

function createInitialBatchDict(initialData) {
  return {
    'Weekday Batch': cloneBatchArray(initialData, 'w'),
    'Weekend Batch': cloneBatchArray(initialData, 's')
  };
}

function loadBatchDictState(key, initialData, versionKey, versionVal) {
  try {
    const savedVersion = localStorage.getItem(versionKey);
    if (savedVersion === versionVal) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed['Weekday Batch'] && parsed['Weekend Batch']) {
          return parsed;
        }
      }
    }
    localStorage.setItem(versionKey, versionVal);
  } catch (e) {}
  return createInitialBatchDict(initialData);
}

export function LmsDataProvider({ children }) {
  const authContext = useAuth();
  const currentUser = authContext?.currentUser;
  const registeredUsers = authContext?.registeredUsers || [];
  const updateUserProfile = authContext?.updateUserProfile;

  // Helper to load array state from localStorage or fallback
  const loadLocalState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return fallback;
  };

  // State Initialization with localStorage Persistence
  const [users, setUsers] = useState(() => {
    const loaded = loadLocalState('aspire_lms_users', INITIAL_USERS);
    return loaded.filter(u => u.id === 'usr-1' || !['usr-2', 'usr-3', 'usr-4'].includes(u.id));
  });
  const [students, setStudents] = useState(() => {
    const loaded = loadLocalState('aspire_lms_students_v9', []);
    return loaded;
  });
  const [rolePermissions, setRolePermissions] = useState(INITIAL_ROLE_PERMISSIONS);
  const [coursesByBatch, setCoursesByBatch] = useState(() => loadBatchDictState('aspire_lms_courses_by_batch', INITIAL_COURSES, 'aspire_lms_courses_version', 'v8_single_course'));
  const [assessmentsByBatch, setAssessmentsByBatch] = useState(() => loadBatchDictState('aspire_lms_assessments_by_batch', INITIAL_ASSESSMENTS, 'aspire_lms_assessments_version', 'v6_cleared_mock_data'));
  const [liveSessionsByBatch, setLiveSessionsByBatch] = useState(() => loadBatchDictState('aspire_lms_live_sessions_by_batch', INITIAL_LIVE_SESSIONS, 'aspire_lms_sessions_version', 'v6_cleared_mock_data'));
  const [jobsByBatch, setJobsByBatch] = useState(() => loadBatchDictState('aspire_lms_jobs_by_batch', INITIAL_JOBS, 'aspire_lms_jobs_version', 'v8_cleared_jobs'));
  const [recordingsByBatch, setRecordingsByBatch] = useState(() => loadBatchDictState('aspire_lms_recordings_by_batch', INITIAL_RECORDINGS, 'aspire_lms_recordings_version', 'v6_cleared_mock_data'));
  const [placementResources, setPlacementResources] = useState(() => loadLocalState('aspire_lms_placement_resources', INITIAL_PLACEMENT_RESOURCES));
  const [projectsByBatch, setProjectsByBatch] = useState(() => loadBatchDictState('aspire_lms_projects_by_batch', INITIAL_PROJECTS, 'aspire_lms_projects_version', 'v7_student_ui_projects'));
  const [badges, setBadges] = useState(() => loadLocalState('aspire_lms_badges', INITIAL_BADGES));
  const [courseLessons, setCourseLessons] = useState([]);
  const [milestoneLocks, setMilestoneLocks] = useState([]);
  const [rewards, setRewards] = useState(() => loadLocalState('aspire_lms_rewards_v2', INITIAL_REWARDS));

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_badges', JSON.stringify(badges)); } catch (e) {}
  }, [badges]);
  const DEFAULT_REWARDS_HEADER = {
    badgeText: 'STUDENT MERCHANDISE & SWAG STORE',
    title: 'AspireNext Rewards & Merchandise',
    description: 'Earn XP points by solving coding practice problems, completing quizzes, and finishing course modules to unlock official branded merchandise.',
    xpBadgeLabel: '0 Total Student XP'
  };

  const [rewardsStoreConfig, setRewardsStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('aspire_lms_rewards_header_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_REWARDS_HEADER;
  });

  const updateRewardsStoreConfig = (newConfig) => {
    setRewardsStoreConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('aspire_lms_rewards_header_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_rewards_v2', JSON.stringify(rewards)); } catch (e) {}
  }, [rewards]);

  // Realtime Supabase Database Sync for Rewards
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch from Supabase
    async function loadRewardsFromDb() {
      try {
        const { data, error } = await supabase
          .from('rewards')
          .select('*')
          .order('reward_required_xp_points', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          const normalized = data.map((row) => {
            const isLocked = row.is_locked !== undefined ? row.is_locked : true;

            return {
              id: row.id,
              title: row.reward_title || 'Untitled Reward',
              reward_title: row.reward_title || 'Untitled Reward',
              image: row.reward_image_url || '/rewards/stickers.jpg',
              image_url: row.reward_image_url || '/rewards/stickers.jpg',
              reward_image_url: row.reward_image_url || '/rewards/stickers.jpg',
              requiredXp: Number(row.reward_required_xp_points || 1000),
              required_xp: Number(row.reward_required_xp_points || 1000),
              reward_required_xp_points: Number(row.reward_required_xp_points || 1000),
              isReleased: !isLocked,
              is_released: !isLocked,
              is_locked: isLocked,
              category: row.category || 'ACCESSORIES',
              stock: row.stock !== undefined ? Number(row.stock) : 50,
              description: row.description || '',
              unlockedCount: 0
            };
          });
          setRewards(normalized);
        } else if (!error && (!data || data.length === 0)) {
          // If Supabase table is empty, seed initial rewards into database
          const seedData = INITIAL_REWARDS.map(r => ({
            id: r.id,
            reward_title: r.title,
            reward_image_url: r.image,
            reward_required_xp_points: r.requiredXp,
            is_locked: !r.isReleased,
            category: r.category,
            stock: r.stock || 50,
            description: r.description || ''
          }));
          await supabase.from('rewards').upsert(seedData);
        }
      } catch (err) {
        console.warn('[Supabase Rewards] fetch warning:', err);
      }
    }

    loadRewardsFromDb();

    // 2. Realtime subscription to postgres_changes
    const channel = supabase
      .channel('realtime_rewards_store')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const row = payload.new;
          if (row) {
            const isLocked = row.is_locked !== undefined ? row.is_locked : true;
            const newRow = {
              id: row.id,
              title: row.reward_title || 'Untitled Reward',
              reward_title: row.reward_title || 'Untitled Reward',
              image: row.reward_image_url || '/rewards/stickers.jpg',
              image_url: row.reward_image_url || '/rewards/stickers.jpg',
              reward_image_url: row.reward_image_url || '/rewards/stickers.jpg',
              requiredXp: Number(row.reward_required_xp_points || 1000),
              required_xp: Number(row.reward_required_xp_points || 1000),
              reward_required_xp_points: Number(row.reward_required_xp_points || 1000),
              isReleased: !isLocked,
              is_released: !isLocked,
              is_locked: isLocked,
              category: row.category || 'ACCESSORIES',
              stock: row.stock !== undefined ? Number(row.stock) : 50,
              description: row.description || '',
              unlockedCount: 0
            };
            setRewards((prev) => [newRow, ...prev.filter((r) => r.id !== newRow.id)]);
          }
        } else if (payload.eventType === 'UPDATE') {
          const row = payload.new;
          if (row) {
            const isLocked = row.is_locked !== undefined ? row.is_locked : true;
            const updatedRow = {
              id: row.id,
              title: row.reward_title || 'Untitled Reward',
              reward_title: row.reward_title || 'Untitled Reward',
              image: row.reward_image_url || '/rewards/stickers.jpg',
              image_url: row.reward_image_url || '/rewards/stickers.jpg',
              reward_image_url: row.reward_image_url || '/rewards/stickers.jpg',
              requiredXp: Number(row.reward_required_xp_points || 1000),
              required_xp: Number(row.reward_required_xp_points || 1000),
              reward_required_xp_points: Number(row.reward_required_xp_points || 1000),
              isReleased: !isLocked,
              is_released: !isLocked,
              is_locked: isLocked,
              category: row.category || 'ACCESSORIES',
              stock: row.stock !== undefined ? Number(row.stock) : 50,
              description: row.description || '',
              unlockedCount: 0
            };
            setRewards((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old?.id;
          if (deletedId) {
            setRewards((prev) => prev.filter((r) => r.id !== deletedId));
          }
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);
>>>>>>> origin/manohar

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_users', JSON.stringify(users)); } catch (e) {}
  }, [users]);

  // Real-time synchronization between AuthContext currentUser / registeredUsers and LmsDataContext users list
  useEffect(() => {
    if (!currentUser && (!registeredUsers || registeredUsers.length === 0)) return;

    setUsers((prevUsers) => {
      let updatedUsers = [...prevUsers];
      let hasChanges = false;

      // 1. Sync logged in currentUser (avatar, name, email, department, phone)
      if (currentUser) {
        const cId = currentUser.id;
        const cEmail = currentUser.email?.toLowerCase();
        const existingIdx = updatedUsers.findIndex(
          (u) => u.id === cId || (cEmail && u.email?.toLowerCase() === cEmail)
        );

        if (existingIdx !== -1) {
          const target = updatedUsers[existingIdx];
          const newAvatar = currentUser.avatar || target.avatar;
          const newName = currentUser.name || target.name;
          const newEmail = currentUser.email || target.email;
          const newDept = currentUser.department || target.department;
          const newPhone = currentUser.phone || target.phone;

          if (
            target.avatar !== newAvatar ||
            target.name !== newName ||
            target.email !== newEmail ||
            target.department !== newDept ||
            target.phone !== newPhone
          ) {
            updatedUsers[existingIdx] = {
              ...target,
              avatar: newAvatar,
              name: newName,
              email: newEmail,
              department: newDept,
              phone: newPhone
            };
            hasChanges = true;
          }
        } else {
          const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
          updatedUsers.unshift({
            id: cId || `usr-${Date.now()}`,
            name: currentUser.name || 'User',
            email: currentUser.email || '',
            role: currentUser.originalRole || currentUser.role || ROLES.SUPER_ADMIN,
            originalRole: currentUser.originalRole || currentUser.role,
            department: currentUser.department || 'Executive Leadership',
            status: 'Active',
            joinedDate: currentUser.joinedDate || new Date().toISOString().split('T')[0],
            phone: currentUser.phone || '+91 98765-43210',
            avatar: (currentUser.avatar && !currentUser.avatar.includes('unsplash.com')) ? currentUser.avatar : defaultAvatar
          });
          hasChanges = true;
        }
      }

      // 2. Sync registeredUsers list
      if (registeredUsers && registeredUsers.length > 0) {
        registeredUsers.forEach((regUser) => {
          if (!regUser || !regUser.email) return;
          const regEmail = regUser.email.toLowerCase();
          const existingIdx = updatedUsers.findIndex(
            (u) => u.id === regUser.id || (u.email && u.email.toLowerCase() === regEmail)
          );
          const defaultRegAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regUser.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
          const cleanRegAvatar = (regUser.avatar && !regUser.avatar.includes('unsplash.com')) ? regUser.avatar : defaultRegAvatar;

          if (existingIdx !== -1) {
            const target = updatedUsers[existingIdx];
            if (target.avatar !== cleanRegAvatar) {
              updatedUsers[existingIdx] = { ...target, avatar: cleanRegAvatar };
              hasChanges = true;
            }
          } else {
            updatedUsers.push({
              id: regUser.id || `usr-${Date.now()}`,
              name: regUser.name,
              email: regUser.email,
              role: regUser.role || ROLES.INSTRUCTOR,
              originalRole: regUser.originalRole || regUser.role,
              department: regUser.department || 'Curriculum Operations',
              status: 'Active',
              joinedDate: regUser.joinedDate || new Date().toISOString().split('T')[0],
              phone: regUser.phone || '+91 98765-43210',
              avatar: cleanRegAvatar
            });
            hasChanges = true;
          }
        });
      }

      return hasChanges ? updatedUsers : prevUsers;
    });
  }, [currentUser, registeredUsers]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_students_v9', JSON.stringify(students)); } catch (e) {}
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_courses_by_batch', JSON.stringify(coursesByBatch)); } catch (e) {}
  }, [coursesByBatch]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_assessments_by_batch', JSON.stringify(assessmentsByBatch)); } catch (e) {}
  }, [assessmentsByBatch]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_live_sessions_by_batch', JSON.stringify(liveSessionsByBatch)); } catch (e) {}
  }, [liveSessionsByBatch]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_jobs_by_batch', JSON.stringify(jobsByBatch)); } catch (e) {}
  }, [jobsByBatch]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_recordings_by_batch', JSON.stringify(recordingsByBatch)); } catch (e) {}
  }, [recordingsByBatch]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_placement_resources', JSON.stringify(placementResources)); } catch (e) {}
  }, [placementResources]);

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_projects_by_batch', JSON.stringify(projectsByBatch)); } catch (e) {}
  }, [projectsByBatch]);

  const [availableBatches, setAvailableBatches] = useState(() => {
    try {
      const saved = localStorage.getItem('aspire_lms_available_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b) => (b.startsWith('A26WE') ? b.replace('A26WE', 'A26S') : b));
        }
      }
    } catch (e) {}
    return INITIAL_BATCH_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aspire_lms_available_batches', JSON.stringify(availableBatches));
    } catch (e) {}
  }, [availableBatches]);

  const addBatch = async (newCode, category) => {
    if (!newCode || availableBatches.includes(newCode)) return;
    setAvailableBatches((prev) => {
      const next = Array.from(new Set([...prev, newCode])).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      return next;
    });
    logActivity(`Created new batch code: "${newCode}" (${category || 'General'})`, 'batch');

    try {
      await supabase.from('batches').upsert([{
        id: `batch-${Date.now()}`,
        code: newCode,
        category: category || 'Weekday',
        status: 'Active'
      }], { onConflict: 'code' });
    } catch (err) {
      console.warn('Batch insert handled:', err);
    }
  };

  const deleteBatch = async (batchCode) => {
    if (!batchCode) return;
    setAvailableBatches((prev) => prev.filter((b) => b !== batchCode));
    logActivity(`Deleted batch code: "${batchCode}"`, 'batch');

    try {
      await supabase.from('batches').delete().eq('code', batchCode);
    } catch (err) {
      console.warn('Batch delete handled:', err);
    }
  };

  const [activeBatchFilter, setActiveBatchFilter] = useState(() => {
    return localStorage.getItem('aspire_lms_active_batch_filter') || 'ALL';
  });

  useEffect(() => {
    try {
      localStorage.setItem('aspire_lms_active_batch_filter', activeBatchFilter);
    } catch (e) {}
  }, [activeBatchFilter]);

  const [milestonesByBatch, setMilestonesByBatch] = useState(() => {
    const dataVersion = localStorage.getItem('aspire_lms_milestones_version');
    if (dataVersion === 'v7_restored_full_curriculum_milestones') {
      const savedBatchData = localStorage.getItem('aspire_lms_milestones_by_batch');
      if (savedBatchData) {
        try {
          const parsed = JSON.parse(savedBatchData);
          if (parsed && parsed['Weekday Batch'] && parsed['Weekend Batch']) {
            return parsed;
          }
        } catch (e) {}
      }
    }

    try {
      localStorage.setItem('aspire_lms_milestones_version', 'v7_restored_full_curriculum_milestones');
    } catch (e) {}

    return createInitialMilestonesByBatch();
  });

  const lastSyncedMilestonesRef = useRef('');

  useEffect(() => {
    try {
      localStorage.setItem('aspire_lms_milestones_by_batch', JSON.stringify(milestonesByBatch));
      if (milestonesByBatch && milestonesByBatch['Weekday Batch']) {
        localStorage.setItem('aspire_lms_milestones', JSON.stringify(milestonesByBatch['Weekday Batch']));
      }

      const stringified = JSON.stringify(milestonesByBatch);
      if (lastSyncedMilestonesRef.current === stringified) {
        return;
      }

      const timer = setTimeout(() => {
        lastSyncedMilestonesRef.current = stringified;
        const weekdayStages = milestonesByBatch['Weekday Batch']?.stages || milestonesByBatch['default']?.stages || [];
        const weekdayOverview = milestonesByBatch['Weekday Batch']?.overview || {};

        // 1. Sync batch_data to Supabase PostgreSQL table
        supabase
          .from('milestones_data')
          .upsert({
            id: 'batch_data',
            overview: { batchData: milestonesByBatch },
            stages: weekdayStages,
            updated_at: new Date().toISOString()
          })
          .then(() => {})
          .catch((e) => console.warn('Supabase milestones batch sync error:', e));

        // 2. Sync default row to Supabase
        supabase
          .from('milestones_data')
          .upsert({
            id: 'default',
            overview: weekdayOverview,
            stages: weekdayStages,
            updated_at: new Date().toISOString()
          })
          .then(() => {})
          .catch((e) => console.warn('Supabase milestones default sync error:', e));

        // 3. Fallback sync to local Express backend API
        try {
          fetch('/api/milestones', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batchData: milestonesByBatch, overview: weekdayOverview })
          }).catch(() => {});
        } catch (err) {}
      }, 500);

      return () => clearTimeout(timer);
    } catch (e) {}
  }, [milestonesByBatch]);

  const getMilestoneDataForBatch = (batchName) => {
    const bKey = (batchName && batchName !== 'ALL') ? batchName : (activeBatchFilter && activeBatchFilter !== 'ALL' ? activeBatchFilter : 'Weekday Batch');
    // Support dynamic batch codes: try exact match first, then fall back to category
    if (milestonesByBatch[bKey]) return milestonesByBatch[bKey];
    // Map batch codes to their category: A26S* = Weekend, A26W* = Weekday
    const isWeekend = bKey.startsWith('A26S') || bKey === 'Weekend Batch';
    const categoryKey = isWeekend ? 'Weekend Batch' : 'Weekday Batch';
    return milestonesByBatch[categoryKey] || createInitialMilestonesByBatch()[categoryKey];
  };

  const milestones = getMilestoneDataForBatch(activeBatchFilter);

  const [codingQuestionsByBatch, setCodingQuestionsByBatch] = useState(() => loadBatchDictState('aspire_lms_coding_by_batch', INITIAL_CODING_QUESTIONS, 'aspire_lms_coding_version', 'v6_cleared_mock_data'));

  useEffect(() => {
    try { localStorage.setItem('aspire_lms_coding_by_batch', JSON.stringify(codingQuestionsByBatch)); } catch (e) {}
  }, [codingQuestionsByBatch]);

  const resolveBatchKey = (batchName) => {
    const b = batchName && batchName !== 'ALL' ? batchName : activeBatchFilter;
    if (b && (b.startsWith('A26S') || b === 'Weekend Batch')) return 'Weekend Batch';
    return 'Weekday Batch';
  };

  const getBatchItems = (dict, batchName) => {
    if (!dict) return [];
    const target = batchName || activeBatchFilter || 'ALL';

    if (target === 'ALL') {
      const allItems = [];
      const seenIds = new Set();
      Object.values(dict).forEach((arr) => {
        if (Array.isArray(arr)) {
          arr.forEach((item) => {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              allItems.push(item);
            }
          });
        }
      });
      return allItems;
    }

    if (dict[target] && Array.isArray(dict[target]) && dict[target].length > 0) {
      return dict[target];
    }

    if (target.startsWith('A26S') || target === 'Weekend Batch') {
      const weItems = dict['Weekend Batch'] || [];
      const wdItems = dict['Weekday Batch'] || [];
      const combined = [...weItems];
      const seenIds = new Set(weItems.map((i) => i.id));
      wdItems.forEach((item) => {
        if (item && item.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          combined.push(item);
        }
      });
      return combined;
    }

    if (target.startsWith('A26W') || target === 'Weekday Batch') {
      const wdItems = dict['Weekday Batch'] || [];
      const weItems = dict['Weekend Batch'] || [];
      const combined = [...wdItems];
      const seenIds = new Set(wdItems.map((i) => i.id));
      weItems.forEach((item) => {
        if (item && item.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          combined.push(item);
        }
      });
      return combined;
    }

    // Fallback combine all
    const fallbackItems = [];
    const seenIds = new Set();
    Object.values(dict).forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            fallbackItems.push(item);
          }
        });
      }
    });
    return fallbackItems;
  };

  const getCoursesForBatch = (batchName) => getBatchItems(coursesByBatch, batchName);
  const getAssessmentsForBatch = (batchName) => getBatchItems(assessmentsByBatch, batchName);
  const getLiveSessionsForBatch = (batchName) => getBatchItems(liveSessionsByBatch, batchName);
  const getJobsForBatch = (batchName) => getBatchItems(jobsByBatch, batchName);
  const getRecordingsForBatch = (batchName) => getBatchItems(recordingsByBatch, batchName);
  const getProjectsForBatch = (batchName) => getBatchItems(projectsByBatch, batchName);
  const getCodingQuestionsForBatch = (batchName) => getBatchItems(codingQuestionsByBatch, batchName);

  const courses = getCoursesForBatch(activeBatchFilter);
  const assessments = getAssessmentsForBatch(activeBatchFilter);
  const liveSessions = getLiveSessionsForBatch(activeBatchFilter);
  const jobs = getJobsForBatch(activeBatchFilter);
  const recordings = getRecordingsForBatch(activeBatchFilter);
  const projects = getProjectsForBatch(activeBatchFilter);
  const codingQuestions = getCodingQuestionsForBatch(activeBatchFilter);

  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Student Milestone Topics/Items Completion State
  const [completedMilestoneItemIds, setCompletedMilestoneItemIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aspire_lms_completed_milestone_items_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['git-intro-m1-live', 'git-intro-m1-lab'];
  });

  const lastSyncedCompletedRef = useRef('');

  useEffect(() => {
    try {
      localStorage.setItem('aspire_lms_completed_milestone_items_v1', JSON.stringify(completedMilestoneItemIds));

      const stringified = JSON.stringify([...completedMilestoneItemIds].sort());
      if (lastSyncedCompletedRef.current === stringified) {
        return;
      }

      const timer = setTimeout(() => {
        lastSyncedCompletedRef.current = stringified;

        supabase
          .from('milestones_data')
          .upsert({
            id: 'completed_items',
            overview: { itemIds: completedMilestoneItemIds },
            stages: [],
            updated_at: new Date().toISOString()
          })
          .then(() => {})
          .catch((e) => console.warn('Supabase completion sync error:', e));

        try {
          fetch('/api/milestones/completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completedItemIds: completedMilestoneItemIds })
          }).catch(() => {});
        } catch (e) {}
      }, 400);

      return () => clearTimeout(timer);
    } catch (e) {}
  }, [completedMilestoneItemIds]);

  const toggleItemCompletion = (itemId) => {
    if (!itemId) return;
    setCompletedMilestoneItemIds((prev) => {
      const isAlready = prev.includes(itemId);
      if (isAlready) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const markItemCompleted = (itemId) => {
    if (!itemId) return;
    setCompletedMilestoneItemIds((prev) => {
      if (!prev.includes(itemId)) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const unmarkItemCompleted = (itemId) => {
    if (!itemId) return;
    setCompletedMilestoneItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const toggleSubtopicCompletion = (subtopic) => {
    if (!subtopic) return;
    const subItems = [];
    (subtopic.modules || []).forEach((mod) => {
      (mod.items || []).forEach((item) => {
        if (item && item.id) subItems.push(item.id);
      });
    });

    setCompletedMilestoneItemIds((prev) => {
      const isSubDone =
        prev.includes(subtopic.id) ||
        (subItems.length > 0 && subItems.every((id) => prev.includes(id)));

      if (isSubDone) {
        const removeSet = new Set([subtopic.id, ...subItems]);
        return prev.filter((id) => !removeSet.has(id));
      } else {
        const nextSet = new Set([...prev, subtopic.id, ...subItems]);
        return Array.from(nextSet);
      }
    });
  };

  // Guard against concurrent or self-triggered Realtime fetches
  const isRefetchingRef = React.useRef(false);

  // Fetch Data from Supabase PostgreSQL
  const fetchSupabaseData = async () => {
    if (isRefetchingRef.current) return; // prevent concurrent fetches
    isRefetchingRef.current = true;
    try {
      // 1. Fetch Profiles
      const { data: profilesData, error: profilesErr } = await supabase.from('profiles').select('*');
      if (!profilesErr && profilesData && profilesData.length > 0) {
        // Self-heal/normalize usr-1 Super Admin profile in Supabase table if outdated email is present
        const adminProfile = profilesData.find(u => u.id === 'usr-1');
        if (adminProfile && (adminProfile.email.includes('sarah.admin') || adminProfile.name === 'Aspire_Admin')) {
          adminProfile.name = 'Super Admin';
          adminProfile.email = 'aspireAdmin@gmail.com';
          supabase.from('profiles').update({ name: 'Super Admin', email: 'aspireAdmin@gmail.com' }).eq('id', 'usr-1');
        }

        setUsers(profilesData.map(u => {
          const isCurrent = currentUser && (u.id === currentUser.id || (currentUser.email && u.email?.toLowerCase() === currentUser.email?.toLowerCase()));
          const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
          const rawAvatar = (isCurrent && currentUser?.avatar) ? currentUser.avatar : u.avatar;
          const userAvatar = (rawAvatar && !rawAvatar.includes('unsplash.com')) ? rawAvatar : defaultAvatar;

          return {
            id: u.id,
            name: u.id === 'usr-1' ? 'Super Admin' : (u.name || ''),
            email: u.id === 'usr-1' ? 'aspireAdmin@gmail.com' : (u.email || ''),
            role: u.role || 'Instructor',
            originalRole: u.original_role || u.originalRole || u.role || 'Instructor',
            department: u.department || 'Executive Leadership',
            status: u.status || 'Active',
            joinedDate: u.joined_date || u.joinedDate || '',
            phone: u.phone || '+91 98765-43210',
            avatar: userAvatar
          };
        }));
        setIsSupabaseConnected(true);
      }

      // 2. Fetch Role Permissions Matrix
      const { data: permsData } = await supabase.from('role_permissions').select('*');
      if (permsData && permsData.length > 0) {
        const mappedPerms = { ...INITIAL_ROLE_PERMISSIONS };
        const rolesList = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.INSTRUCTOR];
        rolesList.forEach(r => {
          const roleRows = permsData.filter(p => p.role === r);
          if (roleRows.length > 0) {
            mappedPerms[r] = roleRows.map(p => p.permission_id);
          }
        });
        setRolePermissions(mappedPerms);
      }

      // 3. Fetch Course Topics Modules
      const { data: topicsData } = await supabase.from('course_topics').select('*');
      const topicsByCourse = {};
      if (topicsData && topicsData.length > 0) {
        // Sort topics numerically by their Stage number (Stage 1, Stage 2...) or ID
        const sortedTopics = [...topicsData].sort((a, b) => {
          const numA = parseInt((a.title || '').match(/Stage\s*(\d+)/i)?.[1]) || 
                       parseInt((a.id || '').match(/stg-(\d+)/)?.[1]) || 
                       parseInt((a.id || '').match(/stg\d+/)?.[1]) || 999;
          const numB = parseInt((b.title || '').match(/Stage\s*(\d+)/i)?.[1]) || 
                       parseInt((b.id || '').match(/stg-(\d+)/)?.[1]) || 
                       parseInt((b.id || '').match(/stg\d+/)?.[1]) || 999;
          if (numA !== numB) return numA - numB;
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        });

        sortedTopics.forEach(t => {
          if (!topicsByCourse[t.course_id]) topicsByCourse[t.course_id] = [];
          topicsByCourse[t.course_id].push({
            id: t.id,
            title: t.title || '',
            liveClasses: t.live_classes || 0,
            practice: t.practice || 0,
            assessments: t.assessments || 0,
            subtopics: t.subtopics || []
          });
        });
      }

      // 4. Fetch Courses Catalog
      const { data: coursesData, error: coursesErr } = await supabase.from('courses').select('*');
      if (!coursesErr && coursesData && coursesData.length > 0) {
        const mappedCourses = coursesData.map(c => {
          const dbTopics = topicsByCourse[c.id];
          const defaultCourse = INITIAL_COURSES.find(ic => ic.id === c.id || ic.title?.toLowerCase() === c.title?.toLowerCase());
          const fallbackTopics = [
            { id: 'top-1', title: 'Stage 1: Front End + Repository', liveClasses: 31, practice: 45, assessments: 12 },
            { id: 'top-2', title: 'Stage 2: Backend + DSA', liveClasses: 81, practice: 110, assessments: 25 },
            { id: 'top-3', title: 'Stage 3: AI & Cloud Integration', liveClasses: 17, practice: 25, assessments: 8 },
            { id: 'top-4', title: 'Stage 4: Career Launchpad', liveClasses: 23, practice: 30, assessments: 10 }
          ];
          const isPythonFullStack = (c.title || '').toLowerCase().includes('python full') || (c.id || '').includes('1786624019154');
          return {
            id: c.id,
            title: c.title || '',
            category: c.category || 'Web Development',
            level: c.level || 'Intermediate',
            instructor: c.instructor || 'Staff',
            publishStatus: c.publish_status || 'Published',
            thumbnail: c.thumbnail || '',
            enrolledCount: c.enrolled_count || 0,
            rating: c.rating || 4.8,
            description: c.description || '',
            targetBatch: c.target_batch || 'Weekday Batch',
            topics: (dbTopics && dbTopics.length > 0)
              ? dbTopics
              : ((defaultCourse?.topics && defaultCourse.topics.length > 0)
                  ? defaultCourse.topics
                  : (isPythonFullStack ? fallbackTopics : []))
          };
        });
        // REPLACE batch buckets entirely (supports All Batches target)
        setCoursesByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedCourses.forEach(c => {
            const target = (c.targetBatch || '').toUpperCase();
            if (target === 'ALL BATCHES' || target === 'ALL') {
              next['Weekday Batch'].push(c);
              next['Weekend Batch'].push(c);
            } else if (target === 'WEEKEND BATCH' || target.includes('WEEKEND')) {
              next['Weekend Batch'].push(c);
            } else {
              next['Weekday Batch'].push(c);
            }
          });
          return next;
        });
      }

      // 5. Fetch Jobs
      const { data: jobsData, error: jobsErr } = await supabase.from('jobs').select('*');
      if (!jobsErr && jobsData && jobsData.length > 0) {
        const mappedJobs = jobsData.map(j => ({
          id: j.id,
          company: j.company || '',
          jobTitle: j.job_title || j.jobTitle || '',
          jobType: j.job_type || j.jobType || 'Full-Time',
          salary: j.salary || j.package || '4–7 LPA',
          location: j.location || '',
          openings: j.openings !== undefined ? j.openings : (j.positions !== undefined ? j.positions : 3),
          deadline: j.deadline || 'Sep 30, 2026',
          statusBadge: j.status_badge || j.statusBadge || j.status || 'APPLY NOW',
          postedDate: j.posted_date || j.postedDate || '',
          publishStatus: j.publish_status || j.publishStatus || 'Live Feed',
          isLocked: j.is_locked !== undefined ? j.is_locked : (j.isLocked || false),
          logo: j.logo || '',
          description: j.description || '',
          responsibilities: Array.isArray(j.responsibilities)
            ? j.responsibilities
            : (typeof j.responsibilities === 'string' ? JSON.parse(j.responsibilities) : []),
          techStack: Array.isArray(j.tech_stack)
            ? j.tech_stack
            : (Array.isArray(j.techStack) ? j.techStack : (typeof j.tech_stack === 'string' ? JSON.parse(j.tech_stack) : [])),
          perks: j.perks || '',
          targetBatch: j.target_batch || 'Weekday Batch'
        }));
        // REPLACE (not append) to prevent duplicates
        setJobsByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedJobs.forEach(j => {
            const bKey = j.targetBatch === 'Weekend Batch' ? 'Weekend Batch' : 'Weekday Batch';
            next[bKey].push(j);
          });
          return next;
        });
      }

      // 6. Fetch Assessments Roster from Supabase
      const { data: assessmentsData, error: asmntErr } = await supabase.from('assessments').select('*');
      if (!asmntErr && assessmentsData && assessmentsData.length > 0) {
        const mappedAsmnts = assessmentsData.map(a => {
          let stageId = a.stage_id || '';
          let moduleName = a.module_name || '';
          let subtopicId = a.subtopic_id || '';
          let subtopicName = a.subtopic_name || '';
          let innerTopicId = a.inner_topic_id || '';
          let topicName = a.topic_name || '';

          if (topicName && topicName.includes('||')) {
            const parts = topicName.split('||');
            moduleName = parts[0] || moduleName;
            subtopicName = parts[1] || subtopicName;
            topicName = parts[2] || topicName;
          }

          if (a.topic_id && a.topic_id.includes('||')) {
            const parts = a.topic_id.split('||');
            stageId = parts[0] || stageId;
            subtopicId = parts[1] || subtopicId;
            innerTopicId = parts[2] || innerTopicId;
          }

          return {
            id: a.id,
            title: a.title || '',
            courseId: a.course_id || '',
            courseName: a.course_name || 'Python Full Stack + DSA with AI',
            stageId,
            moduleName,
            subtopicId,
            subtopicName,
            innerTopicId,
            topicName,
            durationMinutes: a.duration_minutes || 45,
            totalMarks: a.total_marks || 100,
            mcqCount: a.mcq_count || (Array.isArray(a.mcqs) ? a.mcqs.length : 0),
            codingCount: a.coding_count || (Array.isArray(a.coding_questions) ? a.coding_questions.length : 0),
            totalQuestions: (a.mcq_count || (Array.isArray(a.mcqs) ? a.mcqs.length : 0)) + (a.coding_count || (Array.isArray(a.coding_questions) ? a.coding_questions.length : 0)),
            status: a.status || 'Active',
            publishStatus: a.publish_status || 'Published',
            dueDate: a.due_date || '2026-08-15',
            mcqs: Array.isArray(a.mcqs) ? a.mcqs : (typeof a.mcqs === 'string' ? JSON.parse(a.mcqs) : []),
            codingQuestions: Array.isArray(a.coding_questions) ? a.coding_questions : (typeof a.coding_questions === 'string' ? JSON.parse(a.coding_questions) : []),
            targetBatch: a.target_batch || 'Weekday Batch'
          };
        });
        setAssessmentsByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedAsmnts.forEach(a => {
            const target = (a.targetBatch || '').toUpperCase();
            if (target === 'ALL BATCHES' || target === 'ALL') {
              next['Weekday Batch'].push(a);
              next['Weekend Batch'].push(a);
            } else if (target === 'WEEKEND BATCH' || target.includes('WEEKEND') || target.includes('A26S')) {
              next['Weekend Batch'].push(a);
            } else {
              next['Weekday Batch'].push(a);
            }
          });
          return next;
        });
      }

      // 7. Fetch Live Sessions
      const { data: sessionsData, error: sessionsErr } = await supabase.from('live_sessions').select('*');
      if (!sessionsErr && sessionsData && sessionsData.length > 0) {
        const mappedSessions = sessionsData.map(s => ({
          id: s.id,
          programName: s.program_name || s.programName || '',
          technology: s.technology || '',
          sessionTitle: s.session_title || s.sessionTitle || '',
          date: s.date || '',
          time: s.time || '',
          meetingLink: s.meeting_link || s.meetingLink || '',
          status: s.status || 'Upcoming',
          publishStatus: s.publish_status || s.publishStatus || 'Published to Student LMS',
          instructor: s.instructor || '',
          description: s.description || '',
          targetBatch: s.target_batch || 'Weekday Batch'
        }));
        // REPLACE (not append) to prevent duplicates
        setLiveSessionsByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedSessions.forEach(s => {
            const bKey = s.targetBatch === 'Weekend Batch' ? 'Weekend Batch' : 'Weekday Batch';
            next[bKey].push(s);
          });
          return next;
        });
      }

      // 7. Fetch Placement Resources
      const { data: placementData, error: placementErr } = await supabase.from('placement_resources').select('*');
      if (!placementErr && placementData && placementData.length > 0) {
        setPlacementResources(placementData.map(p => ({
          id: p.id,
          category: p.category || '',
          title: p.title || '',
          type: p.type || 'Guide',
          author: p.author || '',
          publishStatus: p.publish_status || p.publishStatus || 'Published',
          readTime: p.read_time || p.readTime || '10 min read',
          snippet: p.snippet || '',
          linkUrl: p.link_url || p.linkUrl || ''
        })));
      }

      // 8. Fetch Milestones Roadmap Data & Student Progress from Supabase
      const { data: milesData, error: milesErr } = await supabase.from('milestones_data').select('*');
      if (!milesErr && milesData && milesData.length > 0) {
        const batchRow = milesData.find(m => m.id === 'batch_data');
        if (batchRow && batchRow.overview && batchRow.overview.batchData) {
          setMilestonesByBatch(prev => {
            const nextData = batchRow.overview.batchData;
            if (JSON.stringify(prev) === JSON.stringify(nextData)) return prev;
            return nextData;
          });
        } else {
          const defaultRow = milesData.find(m => m.id === 'default');
          if (defaultRow && defaultRow.stages && defaultRow.stages.length > 0) {
            const overview = defaultRow.overview || {};
            const nextData = {
              'Weekday Batch': { overview, stages: defaultRow.stages },
              'Weekend Batch': { overview, stages: defaultRow.stages }
            };
            setMilestonesByBatch(prev => {
              if (JSON.stringify(prev) === JSON.stringify(nextData)) return prev;
              return nextData;
            });
          }
        }

        const compRow = milesData.find(m => m.id === 'completed_items');
        if (compRow && compRow.overview && Array.isArray(compRow.overview.itemIds)) {
          setCompletedMilestoneItemIds(compRow.overview.itemIds);
        }
      }

      // 9. Fetch Projects Catalog
      const { data: projectsData, error: projectsErr } = await supabase.from('projects').select('*');
      if (!projectsErr && projectsData && projectsData.length > 0) {
        const mappedProjects = projectsData.map(p => ({
          id: p.id,
          title: p.title || '',
          type: p.type || 'Mini',
          category: p.category || 'Full-Stack Web Dev',
          difficulty: p.difficulty || 'Intermediate',
          description: p.description || '',
          techStack: Array.isArray(p.tech_stack)
            ? p.tech_stack
            : (typeof p.tech_stack === 'string'
                ? p.tech_stack.split(',').map((s) => s.trim())
                : (p.techStack || ['React', 'Node.js', 'PostgreSQL'])),
          dueDate: p.due_date || p.dueDate || 'Due Aug 30',
          status: p.status || 'Published',
          templateUrl: p.template_url || p.templateUrl || 'https://github.com/aspire-lms/starter-repo',
          guidelines: p.guidelines || 'Include clean setup instructions and unit tests.',
          assignedCount: p.assigned_count !== undefined ? p.assigned_count : (p.assignedCount || 1),
          submittedCount: p.submitted_count !== undefined ? p.submitted_count : (p.submittedCount || 0),
          feedbackCount: p.feedback_count !== undefined ? p.feedback_count : (p.feedbackCount || 0),
          avgGrade: p.avg_grade !== undefined ? p.avg_grade : (p.avgGrade || 0),
          isLocked: p.is_locked !== undefined ? p.is_locked : (p.isLocked || false),
          submissions: Array.isArray(p.submissions)
            ? p.submissions
            : (typeof p.submissions === 'string' ? JSON.parse(p.submissions) : (p.submissions || [])),
          targetBatch: p.target_batch || 'Weekday Batch',
          overview: p.overview || p.description || '',
          requirements: Array.isArray(p.requirements)
            ? p.requirements
            : (typeof p.requirements === 'string' ? JSON.parse(p.requirements) : (p.requirements || [])),
          steps: Array.isArray(p.steps)
            ? p.steps
            : (typeof p.steps === 'string' ? JSON.parse(p.steps) : (p.steps || [])),
          rubric: Array.isArray(p.rubric)
            ? p.rubric
            : (typeof p.rubric === 'string' ? JSON.parse(p.rubric) : (p.rubric || [])),
          mentorTip: p.mentor_tip || p.mentorTip || 'Test code thoroughly before submitting drive link.',
          courseId: p.course_id || p.courseId || '',
          stageId: p.stage_id || p.stageId || '',
          subtopicId: p.subtopic_id || p.subtopicId || '',
          innerTopicId: p.inner_topic_id || p.innerTopicId || ''
        }));
        // REPLACE (not append) to prevent duplicates (supports All Batches target)
        setProjectsByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedProjects.forEach(p => {
            const target = (p.targetBatch || '').toUpperCase();
            if (target === 'ALL BATCHES' || target === 'ALL' || !p.targetBatch || target === '') {
              next['Weekday Batch'].push(p);
              next['Weekend Batch'].push(p);
            } else if (target === 'WEEKEND BATCH' || target.includes('WEEKEND') || target.includes('A26S')) {
              next['Weekend Batch'].push(p);
            } else {
              next['Weekday Batch'].push(p);
            }
          });
          return next;
        });
      }

      // 10. Fetch Students Roster directly from Supabase DB
      const { data: studentsData, error: studentsErr } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (!studentsErr && studentsData) {
        setStudents(studentsData.map(s => {
          const sName = s.name || 'Student';
          const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sName.trim())}&backgroundColor=e0e7ff&textColor=3730a3&bold=true`;
          const avatarUrl = (s.avatar && !s.avatar.includes('unsplash.com')) ? s.avatar : defaultAvatar;
          return {
            id: s.id,
            name: sName,
            email: s.email || '',
            mobileNumber: s.mobile_number || s.mobileNumber || '',
            registrationId: s.registration_id || s.registrationId || '',
            batch: s.batch || 'A26W1',
            enrolledCourses: Array.isArray(s.enrolled_courses)
              ? s.enrolled_courses
              : (typeof s.enrolled_courses === 'string' ? JSON.parse(s.enrolled_courses) : (s.enrolledCourses || [])),
            avatar: avatarUrl,
            status: s.status || 'Active',
            joinedDate: s.joined_date || s.joinedDate || ''
          };
        }));
      }

      // 11. Fetch Batches List
      const { data: batchesData, error: batchesErr } = await supabase.from('batches').select('*');
      if (!batchesErr && batchesData && batchesData.length > 0) {
        const dbBatches = batchesData.map(b => b.code || b.id).filter(Boolean);
        const sortedBatches = Array.from(new Set(dbBatches)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        setAvailableBatches(sortedBatches);
      }

      // 12. Fetch Coding Questions Catalog
      const { data: codingData, error: codingErr } = await supabase.from('coding_questions').select('*');
      if (!codingErr && codingData && codingData.length > 0) {
        const mappedCoding = codingData.map(cq => ({
          id: cq.id,
          title: cq.title || '',
          difficulty: cq.difficulty || 'Medium',
          category: cq.category || 'Algorithms',
          tags: Array.isArray(cq.tags) ? cq.tags : (typeof cq.tags === 'string' ? JSON.parse(cq.tags) : []),
          problemStatement: cq.problem_statement || cq.problemStatement || '',
          starterCode: cq.starter_code || cq.starterCode || '',
          solutionCode: cq.solution_code || cq.solutionCode || '',
          testCases: Array.isArray(cq.test_cases) ? cq.test_cases : (typeof cq.test_cases === 'string' ? JSON.parse(cq.test_cases) : []),
          createdDate: cq.created_date || cq.createdDate || '',
          postedBy: cq.posted_by || cq.postedBy || 'Admin Portal',
          targetBatch: cq.target_batch || 'Weekday Batch',
          courseId: cq.course_id || '',
          stageId: cq.stage_id || '',
          subtopicId: cq.subtopic_id || '',
          innerTopicId: cq.inner_topic_id || ''
        }));
        setCodingQuestionsByBatch(() => {
          const next = { 'Weekday Batch': [], 'Weekend Batch': [] };
          mappedCoding.forEach(cq => {
            const target = (cq.targetBatch || '').toUpperCase();
            if (target === 'ALL BATCHES' || target === 'ALL') {
              next['Weekday Batch'].push(cq);
              next['Weekend Batch'].push(cq);
            } else if (target === 'WEEKEND BATCH' || target.includes('WEEKEND') || target.includes('A26S')) {
              next['Weekend Batch'].push(cq);
            } else {
              next['Weekday Batch'].push(cq);
            }
          });
          return next;
        });
      }

      // Load course lessons from Supabase
      try {
        const { data: lessonsData } = await supabase.from('course_lessons').select('*').order('sort_order');
        if (lessonsData) setCourseLessons(lessonsData);
      } catch (err) { console.warn('Course lessons load:', err); }

      // Load milestone locks from Supabase
      try {
        const { data: locksData } = await supabase.from('milestone_locks').select('*');
        if (locksData) setMilestoneLocks(locksData);
      } catch (err) { console.warn('Milestone locks load:', err); }

      // 13. Fetch Badges Catalog
      try {
        const { data: badgesData, error: badgesErr } = await supabase.from('badges').select('*');
        if (!badgesErr && badgesData && badgesData.length > 0) {
          setBadges(badgesData.map(b => ({
            id: b.id,
            name: b.name || '',
            description: b.description || '',
            icon: b.icon || 'Award',
            color: b.color || 'purple',
            category: b.category || 'Achievement',
            criteria: b.criteria || '',
            points: b.points || '100 XP',
            targetBatch: b.target_batch || b.targetBatch || 'ALL BATCHES'
          })));
        } else {
          const { data: milesBadges } = await supabase.from('milestones_data').select('*').eq('id', 'badges_data');
          if (milesBadges && milesBadges[0]?.overview?.badges) {
            setBadges(milesBadges[0].overview.badges);
          }
        }
      } catch (err) { console.warn('Badges load:', err); }

    } catch (err) {
      console.warn('Supabase initial fetch using fallback mock data:', err);
    } finally {
      isRefetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchSupabaseData();

    // Targeted Realtime channels — one per table, applying delta updates directly.
    const channels = [];
    try {
      const makeChannel = (table, handler) => {
        const ch = supabase
          .channel(`${table}-changes`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, handler)
          .subscribe();
        channels.push(ch);
      };

      // Profiles, Students, Batches, Milestones, Courses, Assessments, Coding Questions & Projects — trigger full refetch
      makeChannel('profiles', () => fetchSupabaseData());
      makeChannel('students', () => fetchSupabaseData());
      // Milestones Realtime Channel
      makeChannel('milestones_data', (payload) => {
        if (payload?.new) {
          const row = payload.new;
          if (row.id === 'batch_data' && row.overview?.batchData) {
            setMilestonesByBatch(prev => {
              if (JSON.stringify(prev) === JSON.stringify(row.overview.batchData)) return prev;
              return row.overview.batchData;
            });
          } else if (row.id === 'completed_items' && Array.isArray(row.overview?.itemIds)) {
            setCompletedMilestoneItemIds(row.overview.itemIds);
          } else if (row.id === 'badges_data' && Array.isArray(row.overview?.badges)) {
            setBadges(row.overview.badges);
          }
        }
      });
      makeChannel('courses', () => fetchSupabaseData());
      makeChannel('assessments', () => fetchSupabaseData());
      makeChannel('coding_questions', () => fetchSupabaseData());
      makeChannel('projects', () => fetchSupabaseData());
      makeChannel('badges', () => fetchSupabaseData());

      // Live Sessions — delta update
      makeChannel('live_sessions', (payload) => {
        setLiveSessionsByBatch(prev => {
          const next = { ...prev };
          const getBKey = (row) => row?.target_batch === 'Weekend Batch' ? 'Weekend Batch' : 'Weekday Batch';
          if (payload.eventType === 'INSERT') {
            const bKey = getBKey(payload.new);
            if (!next[bKey].find(x => x.id === payload.new.id))
              next[bKey] = [payload.new, ...next[bKey]];
          } else if (payload.eventType === 'UPDATE') {
            const bKey = getBKey(payload.new);
            next[bKey] = next[bKey].map(x => x.id === payload.new.id ? { ...x, ...payload.new } : x);
          } else if (payload.eventType === 'DELETE') {
            ['Weekday Batch', 'Weekend Batch'].forEach(k => {
              next[k] = next[k].filter(x => x.id !== payload.old.id);
            });
          }
          return next;
        });
      });

      // Jobs — delta update
      makeChannel('jobs', (payload) => {
        setJobsByBatch(prev => {
          const next = { ...prev };
          const getBKey = (row) => row?.target_batch === 'Weekend Batch' ? 'Weekend Batch' : 'Weekday Batch';
          if (payload.eventType === 'INSERT') {
            const bKey = getBKey(payload.new);
            if (!next[bKey].find(x => x.id === payload.new.id))
              next[bKey] = [payload.new, ...next[bKey]];
          } else if (payload.eventType === 'UPDATE') {
            const bKey = getBKey(payload.new);
            next[bKey] = next[bKey].map(x => x.id === payload.new.id ? { ...x, ...payload.new } : x);
          } else if (payload.eventType === 'DELETE') {
            ['Weekday Batch', 'Weekend Batch'].forEach(k => {
              next[k] = next[k].filter(x => x.id !== payload.old.id);
            });
          }
          return next;
        });
      });



      // Placement resources — full refetch (small table)
      makeChannel('placement_resources', () => fetchSupabaseData());

      // Role permissions — full refetch
      makeChannel('role_permissions', () => fetchSupabaseData());

      // audit_activities intentionally NOT subscribed — it was the source of
      // the self-triggering loop (every CRUD -> logActivity -> insert -> Realtime -> full refetch).

    } catch (err) {
      console.warn('Supabase Realtime channel subscription skipped:', err);
    }

    return () => {
      channels.forEach(ch => {
        try { supabase.removeChannel(ch); } catch (e) {}
      });
    };
  }, []);

  useEffect(() => {
    const lessonsChannel = supabase.channel('course-lessons-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_lessons' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCourseLessons(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setCourseLessons(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setCourseLessons(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    const locksChannel = supabase.channel('milestone-locks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestone_locks' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMilestoneLocks(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setMilestoneLocks(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setMilestoneLocks(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(lessonsChannel);
      supabase.removeChannel(locksChannel);
    };
  }, []);

  // Log Activity Helper (Local state only, audit_activities table removed from Supabase)
  const logActivity = (text, type = 'info') => {
    const newAct = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 9)]);
  };

  // --- USER MANAGEMENT ---
  const addUser = async (userData) => {
    const nameSeed = userData.name || 'User';
    const defaultInitAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameSeed)}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
    const cleanAvatar = (userData.avatar && !userData.avatar.includes('unsplash.com')) ? userData.avatar : defaultInitAvatar;

    const newUser = {
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      role: userData.role || ROLES.INSTRUCTOR,
      originalRole: userData.role || ROLES.INSTRUCTOR,
      phone: userData.phone || '+91 98765-43210',
      ...userData,
      avatar: cleanAvatar
    };

    setUsers((prev) => [newUser, ...prev]);
    logActivity(`Added new staff member: "${newUser.name}" as ${newUser.role}`, 'user');

    const profilePayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      original_role: newUser.originalRole,
      department: newUser.department || 'Curriculum Operations',
      status: 'Active',
      joined_date: newUser.joinedDate,
      phone: newUser.phone,
      avatar: newUser.avatar
    };

    try {
      const { error } = await supabase.from('profiles').upsert([profilePayload]);
      if (error) console.error('Supabase profile insertion error:', error.message);
    } catch (err) {
      console.warn('Profile insertion handled:', err);
    }
  };

  const updateUser = async (id, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
    );
    logActivity(`Updated staff details for user ID ${id}`, 'user');

    if (
      currentUser &&
      updateUserProfile &&
      (id === currentUser.id || (currentUser.email && updatedFields.email === currentUser.email))
    ) {
      updateUserProfile(updatedFields);
    }

    const dbFields = {};
    if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
    if (updatedFields.email !== undefined) dbFields.email = updatedFields.email;
    if (updatedFields.role !== undefined) {
      dbFields.role = updatedFields.role;
      dbFields.original_role = updatedFields.role;
    }
    if (updatedFields.department !== undefined) dbFields.department = updatedFields.department;
    if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone;
    if (updatedFields.avatar !== undefined) dbFields.avatar = updatedFields.avatar;

    try {
      const { error } = await supabase.from('profiles').update(dbFields).eq('id', id);
      if (error) console.error('Supabase profile update error:', error.message);
    } catch (err) {
      console.warn('Profile update handled:', err);
    }
  };

  const deleteUser = async (id) => {
    const u = users.find((item) => item.id === id);
    setUsers((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed user account: "${u?.name || id}"`, 'user');

    try {
      await supabase.from('profiles').delete().eq('id', id);
    } catch (err) {
      console.warn('Profile delete handled:', err);
    }
  };

  // --- ROLE PERMISSIONS MATRIX (WITH SUPABASE SYNC) ---
  const toggleRolePermission = async (role, permId) => {
    let updatedRolePerms = [];

    setRolePermissions((prev) => {
      const currentPerms = prev[role] || [];
      updatedRolePerms = currentPerms.includes(permId)
        ? currentPerms.filter((p) => p !== permId)
        : [...currentPerms, permId];
      return { ...prev, [role]: updatedRolePerms };
    });

    logActivity(`Toggled permission "${permId}" for role "${role}"`, 'security');

    try {
      // Sync to role_permissions table in Supabase
      await supabase.from('role_permissions').delete().eq('role', role);

      if (updatedRolePerms.length > 0) {
        const payload = updatedRolePerms.map((pId) => ({
          role,
          permission_id: pId
        }));
        const { error } = await supabase.from('role_permissions').insert(payload);
        if (error) console.error('Supabase role_permissions insert error:', error.message);
      }
    } catch (err) {
      console.warn('Role permission sync handled:', err);
    }
  };

    // --- COURSES & TOPIC MODULES ---
  const addCourse = async (courseData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newCourse = {
      id: courseData.id || generateAlphanumericCourseId(courseData.title),
      targetBatch: courseData.targetBatch || bKey,
      enrolledCount: 0,
      rating: 5.0,
      publishStatus: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      ...courseData,
      topics: Array.isArray(courseData.topics) ? courseData.topics : []
    };
    // Optimistic UI update across all batches if targetBatch is All Batches or ALL
    setCoursesByBatch((prev) => {
      const isAll = !newCourse.targetBatch || newCourse.targetBatch === 'All Batches' || newCourse.targetBatch === 'ALL';
      if (isAll) {
        return {
          ...prev,
          'Weekday Batch': [newCourse, ...(prev['Weekday Batch'] || []).filter(c => c.id !== newCourse.id)],
          'Weekend Batch': [newCourse, ...(prev['Weekend Batch'] || []).filter(c => c.id !== newCourse.id)]
        };
      }
      return {
        ...prev,
        [bKey]: [newCourse, ...(prev[bKey] || []).filter(c => c.id !== newCourse.id)]
      };
    });
    logActivity(`Created new course: "${newCourse.title}" (${bKey})`, 'course');
    // Persist to Supabase
    try {
      const { error } = await supabase.from('courses').upsert([{
        id: newCourse.id,
        title: newCourse.title,
        category: newCourse.category,
        level: newCourse.level,
        instructor: newCourse.instructor,
        publish_status: newCourse.publishStatus,
        thumbnail: newCourse.thumbnail,
        enrolled_count: newCourse.enrolledCount,
        rating: newCourse.rating,
        description: newCourse.description,
        target_batch: newCourse.targetBatch
      }]);
      if (error) console.error('Supabase course insert error:', error.message);
    } catch (err) { console.warn('Course insert handled:', err); }
  };

  const updateCourse = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setCoursesByBatch((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = (next[key] || []).map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      });
      return next;
    });
    logActivity(`Updated course properties for ID ${id} (${bKey})`, 'course');
    
    // Persist update to Supabase
    try {
      const dbFields = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.level !== undefined) dbFields.level = updatedFields.level;
      if (updatedFields.instructor !== undefined) dbFields.instructor = updatedFields.instructor;
      if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;
      if (updatedFields.thumbnail !== undefined) dbFields.thumbnail = updatedFields.thumbnail;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.targetBatch !== undefined) dbFields.target_batch = updatedFields.targetBatch;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('courses').update(dbFields).eq('id', id);
        if (error) console.error('Supabase course update error:', error.message);
      }

      // If stages/topics are updated, upsert them to course_topics
      if (updatedFields.topics !== undefined) {
        for (const t of updatedFields.topics) {
          const { error } = await supabase.from('course_topics').upsert([{
            id: t.id,
            course_id: id,
            title: t.title || '',
            live_classes: t.liveClasses || t.live_classes || 0,
            practice: t.practice || 0,
            assessments: t.assessments || 0,
            subtopics: t.subtopics || []
          }], { onConflict: 'id' });
          if (error) console.error('Supabase course_topics upsert error:', error.message);
        }
      }
    } catch (err) { console.warn('Course update handled:', err); }
  };

  const deleteCourse = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setCoursesByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((c) => c.id !== id)
    }));
    logActivity(`Deleted course track ID ${id} (${bKey})`, 'course');
    // Delete from Supabase
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) console.error('Supabase course delete error:', error.message);
    } catch (err) { console.warn('Course delete handled:', err); }
  };

    // --- ASSESSMENTS ---
  const addAssessment = async (asmntData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newAsmnt = {
      id: `asmnt-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: bKey,
      createdDate: new Date().toISOString().split('T')[0],
      assignedCount: 0,
      submittedCount: 0,
      avgScore: 0,
      status: 'Active',
      ...asmntData
    };
    setAssessmentsByBatch((prev) => ({
      ...prev,
      [bKey]: [newAsmnt, ...(prev[bKey] || [])]
    }));
    logActivity(`Created assessment: "${newAsmnt.title}" (${bKey})`, 'assessment');

    // Auto-sync assessment item into corresponding milestone module
    if (newAsmnt.stageId || newAsmnt.moduleName || newAsmnt.topicName) {
      updateBatchState(bKey, (batchData) => {
        const stages = batchData.stages || [];
        const stageMatch = stages.find(s => s.id === newAsmnt.stageId || s.title === newAsmnt.moduleName) || stages[0];
        if (!stageMatch) return batchData;

        const subtopics = stageMatch.subtopics || [];
        const subtopicMatch = subtopics.find(st => st.id === newAsmnt.subtopicId || st.title === newAsmnt.subtopicName || st.title === newAsmnt.topicName) || subtopics[0];
        if (!subtopicMatch) return batchData;

        const modules = subtopicMatch.modules || [];
        let modMatch = modules.find(m => m.id === newAsmnt.innerTopicId || m.title === newAsmnt.topicName);

        const asmItem = {
          id: `item-asm-${newAsmnt.id}`,
          assessmentId: newAsmnt.id,
          type: 'ASSESSMENT',
          typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
          iconName: 'FileCheck',
          iconBg: 'bg-purple-600 text-white',
          title: newAsmnt.title,
          actionText: 'TAKE',
          url: '/assessments',
          btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
        };

        const updatedStages = stages.map(stg => {
          if (stg.id !== stageMatch.id) return stg;
          return {
            ...stg,
            subtopics: (stg.subtopics || []).map(sub => {
              if (sub.id !== subtopicMatch.id) return sub;
              let existingMods = [...(sub.modules || [])];
              if (!modMatch) {
                const newMod = {
                  id: `mod-${Date.now()}`,
                  title: newAsmnt.topicName || 'Assessment Module',
                  items: [asmItem]
                };
                existingMods.push(newMod);
              } else {
                existingMods = existingMods.map(m => {
                  if (m.id !== modMatch.id && m.title !== modMatch.title) return m;
                  const hasItem = (m.items || []).some(it => it.id === asmItem.id || it.assessmentId === newAsmnt.id);
                  return {
                    ...m,
                    items: hasItem
                      ? (m.items || []).map(it => (it.id === asmItem.id || it.assessmentId === newAsmnt.id ? { ...it, title: newAsmnt.title } : it))
                      : [...(m.items || []), asmItem]
                  };
                });
              }
              return {
                ...sub,
                modulesCount: existingMods.length,
                modules: existingMods
              };
            })
          };
        });

        return { ...batchData, stages: updatedStages };
      });
    }

    try {
      const packedTopicName = `${newAsmnt.moduleName || ''}||${newAsmnt.subtopicName || ''}||${newAsmnt.topicName || ''}`;
      const packedTopicId = `${newAsmnt.stageId || ''}||${newAsmnt.subtopicId || ''}||${newAsmnt.innerTopicId || ''}`;

      const { error } = await supabase.from('assessments').upsert([{
        id: newAsmnt.id,
        title: newAsmnt.title,
        course_id: newAsmnt.courseId || null,
        course_name: newAsmnt.courseName || '',
        topic_id: packedTopicId,
        topic_name: packedTopicName,
        duration_minutes: newAsmnt.durationMinutes || 45,
        total_marks: newAsmnt.totalMarks || 100,
        mcq_count: newAsmnt.mcqCount || 5,
        coding_count: newAsmnt.codingCount || 1,
        status: newAsmnt.status || 'Active',
        publish_status: newAsmnt.publishStatus || 'Published',
        due_date: newAsmnt.dueDate || null,
        mcqs: newAsmnt.mcqs || [],
        coding_questions: newAsmnt.codingQuestions || [],
        target_batch: newAsmnt.targetBatch
      }]);
      if (error) console.error('Supabase assessment insert error:', error.message);
    } catch (err) { console.warn('Assessment insert handled:', err); }
  };

  const updateAssessment = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setAssessmentsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    }));
    logActivity(`Updated assessment ID ${id} (${bKey})`, 'assessment');
    try {
      const dbFields = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.courseId !== undefined) dbFields.course_id = updatedFields.courseId;
      if (updatedFields.courseName !== undefined) dbFields.course_name = updatedFields.courseName;
      if (updatedFields.moduleName !== undefined || updatedFields.subtopicName !== undefined || updatedFields.topicName !== undefined) {
        dbFields.topic_name = `${updatedFields.moduleName || ''}||${updatedFields.subtopicName || ''}||${updatedFields.topicName || ''}`;
      }
      if (updatedFields.stageId !== undefined || updatedFields.subtopicId !== undefined || updatedFields.innerTopicId !== undefined) {
        dbFields.topic_id = `${updatedFields.stageId || ''}||${updatedFields.subtopicId || ''}||${updatedFields.innerTopicId || ''}`;
      }
      if (updatedFields.durationMinutes !== undefined) dbFields.duration_minutes = updatedFields.durationMinutes;
      if (updatedFields.totalMarks !== undefined) dbFields.total_marks = updatedFields.totalMarks;
      if (updatedFields.mcqCount !== undefined) dbFields.mcq_count = updatedFields.mcqCount;
      if (updatedFields.codingCount !== undefined) dbFields.coding_count = updatedFields.codingCount;
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
      if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;
      if (updatedFields.dueDate !== undefined) dbFields.due_date = updatedFields.dueDate;
      if (updatedFields.mcqs !== undefined) dbFields.mcqs = updatedFields.mcqs;
      if (updatedFields.codingQuestions !== undefined) dbFields.coding_questions = updatedFields.codingQuestions;
      if (updatedFields.targetBatch !== undefined) dbFields.target_batch = updatedFields.targetBatch;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('assessments').update(dbFields).eq('id', id);
        if (error) console.error('Supabase assessment update error:', error.message);
      }
    } catch (err) { console.warn('Assessment update handled:', err); }
  };

  const deleteAssessment = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setAssessmentsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((a) => a.id !== id)
    }));
    logActivity(`Deleted assessment ID ${id} (${bKey})`, 'assessment');
    try {
      const { error } = await supabase.from('assessments').delete().eq('id', id);
      if (error) console.error('Supabase assessment delete error:', error.message);
    } catch (err) { console.warn('Assessment delete handled:', err); }
  };



    // --- LIVE SESSIONS ---
  const addLiveSession = async (sessionData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newSession = {
      id: `session-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: bKey,
      status: 'Scheduled',
      attendeesCount: 0,
      ...sessionData
    };
    setLiveSessionsByBatch((prev) => ({
      ...prev,
      [bKey]: [newSession, ...(prev[bKey] || [])]
    }));
    logActivity(`Scheduled live session: "${newSession.sessionTitle || newSession.title}" (${bKey})`, 'session');

    // Auto-sync live session item into corresponding milestone module
    if (newSession.stageId || newSession.subtopicId || newSession.technology || newSession.sessionTitle) {
      updateBatchState(bKey, (batchData) => {
        const stages = batchData.stages || [];
        const stageMatch = stages.find(s => s.id === newSession.stageId || s.title === newSession.stageName || (newSession.technology && s.title?.toLowerCase().includes(newSession.technology.toLowerCase()))) || stages[0];
        if (!stageMatch) return batchData;

        const subtopics = stageMatch.subtopics || [];
        const subtopicMatch = subtopics.find(st => st.id === newSession.subtopicId || st.title === newSession.subtopicName || (newSession.technology && st.title?.toLowerCase().includes(newSession.technology.toLowerCase())) || (newSession.sessionTitle && st.title?.toLowerCase().includes(newSession.sessionTitle.toLowerCase().split(' ')[0]))) || subtopics[0];
        if (!subtopicMatch) return batchData;

        const modules = subtopicMatch.modules || [];
        let modMatch = modules.find(m => m.id === newSession.moduleId || m.title === newSession.moduleName) || modules[0];

        const liveItem = {
          id: `item-live-${newSession.id}`,
          sessionId: newSession.id,
          type: 'LIVE CLASS',
          typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
          iconName: 'Video',
          iconBg: 'bg-purple-600 text-white',
          title: newSession.sessionTitle || newSession.title || 'Live Class Session',
          actionText: 'JOIN',
          url: newSession.meetingLink || 'https://meet.google.com/aspire-lms-live',
          btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
        };

        const updatedStages = stages.map(stg => {
          if (stg.id !== stageMatch.id) return stg;
          return {
            ...stg,
            subtopics: (stg.subtopics || []).map(sub => {
              if (sub.id !== subtopicMatch.id) return sub;
              let existingMods = [...(sub.modules || [])];
              if (!modMatch) {
                const newMod = {
                  id: `mod-${Date.now()}`,
                  title: newSession.moduleName || 'Live Class Sessions',
                  items: [liveItem]
                };
                existingMods.push(newMod);
              } else {
                existingMods = existingMods.map(m => {
                  if (m.id !== modMatch.id && m.title !== modMatch.title) return m;
                  const hasItem = (m.items || []).some(it => it.id === liveItem.id || it.sessionId === newSession.id);
                  return {
                    ...m,
                    items: hasItem
                      ? (m.items || []).map(it => (it.id === liveItem.id || it.sessionId === newSession.id ? { ...it, title: liveItem.title, url: liveItem.url } : it))
                      : [liveItem, ...(m.items || [])]
                  };
                });
              }
              return {
                ...sub,
                modulesCount: existingMods.length,
                modules: existingMods
              };
            })
          };
        });

        return { ...batchData, stages: updatedStages };
      });
    }

    try {
      const packedTopicName = `${newSession.stageName || ''}||${newSession.subtopicName || ''}||${newSession.moduleName || ''}`;
      const packedTopicId = `${newSession.stageId || ''}||${newSession.subtopicId || ''}||${newSession.moduleId || ''}`;

      const { error } = await supabase.from('live_sessions').upsert([{
        id: newSession.id,
        program_name: newSession.programName || '',
        technology: newSession.technology || '',
        session_title: newSession.sessionTitle || newSession.title || '',
        date: newSession.date || '',
        time: newSession.time || '',
        meeting_link: newSession.meetingLink || '',
        status: newSession.status || 'Scheduled',
        publish_status: newSession.publishStatus || 'Published to Student LMS',
        instructor: newSession.instructor || '',
        description: newSession.description || '',
        target_batch: newSession.targetBatch,
        topic_id: packedTopicId,
        topic_name: packedTopicName
      }]);
      if (error) console.error('Supabase live session insert error:', error.message);
    } catch (err) { console.warn('Live session insert handled:', err); }
  };

  const updateLiveSession = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setLiveSessionsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    }));
    logActivity(`Updated live session ID ${id} (${bKey})`, 'session');

    // Update milestone module item if present
    updateBatchState(bKey, (batchData) => {
      const stages = (batchData.stages || []).map(stg => ({
        ...stg,
        subtopics: (stg.subtopics || []).map(sub => ({
          ...sub,
          modules: (sub.modules || []).map(m => ({
            ...m,
            items: (m.items || []).map(it => {
              if (it.id === `item-live-${id}` || it.sessionId === id) {
                return {
                  ...it,
                  title: updatedFields.sessionTitle !== undefined ? updatedFields.sessionTitle : it.title,
                  url: updatedFields.meetingLink !== undefined ? updatedFields.meetingLink : it.url
                };
              }
              return it;
            })
          }))
        }))
      }));
      return { ...batchData, stages };
    });

    try {
      const dbFields = {};
      if (updatedFields.sessionTitle !== undefined) dbFields.session_title = updatedFields.sessionTitle;
      if (updatedFields.date !== undefined) dbFields.date = updatedFields.date;
      if (updatedFields.time !== undefined) dbFields.time = updatedFields.time;
      if (updatedFields.meetingLink !== undefined) dbFields.meeting_link = updatedFields.meetingLink;
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
      if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;
      if (updatedFields.instructor !== undefined) dbFields.instructor = updatedFields.instructor;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('live_sessions').update(dbFields).eq('id', id);
        if (error) console.error('Supabase live session update error:', error.message);
      }
    } catch (err) { console.warn('Live session update handled:', err); }
  };

  const deleteLiveSession = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setLiveSessionsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((s) => s.id !== id)
    }));
    logActivity(`Deleted live session ID ${id} (${bKey})`, 'session');

    // Remove from milestone module items
    updateBatchState(bKey, (batchData) => {
      const stages = (batchData.stages || []).map(stg => ({
        ...stg,
        subtopics: (stg.subtopics || []).map(sub => ({
          ...sub,
          modules: (sub.modules || []).map(m => ({
            ...m,
            items: (m.items || []).filter(it => it.id !== `item-live-${id}` && it.sessionId !== id)
          }))
        }))
      }));
      return { ...batchData, stages };
    });

    try {
      const { error } = await supabase.from('live_sessions').delete().eq('id', id);
      if (error) console.error('Supabase live session delete error:', error.message);
    } catch (err) { console.warn('Live session delete handled:', err); }
  };

  const toggleLiveSessionLock = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    let newLocked;
    setLiveSessionsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((s) => {
        if (s.id !== id) return s;
        newLocked = !s.isLocked;
        return { ...s, isLocked: newLocked };
      })
    }));
    logActivity(`Toggled lock on live session ID ${id} (${bKey})`, 'session');
  };



    // --- JOBS (IN INDIAN RUPEES ₹) ---
  const addJob = async (jobData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newJob = {
      id: `job-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: bKey,
      postedDate: new Date().toISOString().split('T')[0],
      publishStatus: 'Live Feed',
      isLocked: jobData.isLocked || false,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      ...jobData
    };
    setJobsByBatch((prev) => ({
      ...prev,
      [bKey]: [newJob, ...(prev[bKey] || [])]
    }));
    logActivity(`Posted job opening for ${newJob.company}: "${newJob.jobTitle}" (${bKey})`, 'job');
    try {
      const { error } = await supabase.from('jobs').upsert([{
        id: newJob.id,
        company: newJob.company,
        job_title: newJob.jobTitle || newJob.title,
        job_type: newJob.jobType || 'Full-Time',
        salary: newJob.salary || newJob.package || '',
        location: newJob.location || '',
        openings: newJob.openings !== undefined ? newJob.openings : 3,
        deadline: newJob.deadline || '',
        status_badge: newJob.statusBadge || newJob.status || 'APPLY NOW',
        posted_date: newJob.postedDate,
        publish_status: newJob.publishStatus,
        is_locked: newJob.isLocked,
        logo: newJob.logo,
        description: newJob.description || '',
        responsibilities: newJob.responsibilities || [],
        tech_stack: newJob.techStack || [],
        perks: newJob.perks || '',
        target_batch: newJob.targetBatch
      }]);
      if (error) console.error('Supabase job insert error:', error.message);
    } catch (err) { console.warn('Job insert handled:', err); }
  };

  const updateJob = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setJobsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((j) => (j.id === id ? { ...j, ...updatedFields } : j))
    }));
    logActivity(`Updated job listing ID ${id} (${bKey})`, 'job');
    try {
      const dbFields = {};
      if (updatedFields.company !== undefined) dbFields.company = updatedFields.company;
      if (updatedFields.jobTitle !== undefined || updatedFields.title !== undefined) {
        dbFields.job_title = updatedFields.jobTitle || updatedFields.title;
      }
      if (updatedFields.jobType !== undefined) dbFields.job_type = updatedFields.jobType;
      if (updatedFields.salary !== undefined || updatedFields.package !== undefined) {
        dbFields.salary = updatedFields.salary || updatedFields.package;
      }
      if (updatedFields.location !== undefined) dbFields.location = updatedFields.location;
      if (updatedFields.openings !== undefined) dbFields.openings = updatedFields.openings;
      if (updatedFields.deadline !== undefined) dbFields.deadline = updatedFields.deadline;
      if (updatedFields.statusBadge !== undefined || updatedFields.status !== undefined) {
        dbFields.status_badge = updatedFields.statusBadge || updatedFields.status;
      }
      if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;
      if (updatedFields.isLocked !== undefined) dbFields.is_locked = updatedFields.isLocked;
      if (updatedFields.logo !== undefined) dbFields.logo = updatedFields.logo;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.responsibilities !== undefined) dbFields.responsibilities = updatedFields.responsibilities;
      if (updatedFields.techStack !== undefined || updatedFields.tech_stack !== undefined) {
        dbFields.tech_stack = updatedFields.techStack || updatedFields.tech_stack;
      }
      if (updatedFields.perks !== undefined) dbFields.perks = updatedFields.perks;
      if (updatedFields.targetBatch !== undefined) dbFields.target_batch = updatedFields.targetBatch;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('jobs').update(dbFields).eq('id', id);
        if (error) console.error('Supabase job update error:', error.message);
      }
    } catch (err) { console.warn('Job update handled:', err); }
  };

  const toggleJobLock = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    let newLocked;
    setJobsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((j) => {
        if (j.id !== id) return j;
        newLocked = !j.isLocked;
        return { ...j, isLocked: newLocked };
      })
    }));
    logActivity(`Toggled lock on job ID ${id} (${bKey})`, 'job');
    try {
      await supabase.from('jobs').update({ is_locked: newLocked }).eq('id', id);
    } catch (err) { console.warn('Job lock toggle handled:', err); }
  };

  const deleteJob = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setJobsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((j) => j.id !== id)
    }));
    logActivity(`Removed job opening ID ${id} (${bKey})`, 'job');
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) console.error('Supabase job delete error:', error.message);
    } catch (err) { console.warn('Job delete handled:', err); }
  };

    // --- RECORDINGS ---
  const addRecording = async (recData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newRec = {
      id: `rec-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: bKey,
      postedDate: new Date().toISOString().split('T')[0],
      publishStatus: 'Available in Student Library',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=80',
      ...recData
    };
    setRecordingsByBatch((prev) => ({
      ...prev,
      [bKey]: [newRec, ...(prev[bKey] || [])]
    }));
    logActivity(`Uploaded lecture video: "${newRec.title}" (${bKey})`, 'library');
    try {
      const { error } = await supabase.from('recordings').upsert([{
        id: newRec.id,
        title: newRec.title,
        concept_name: newRec.conceptName || '',
        duration: newRec.duration || '1h 30m',
        instructor: newRec.instructor || 'Staff',
        publish_status: newRec.publishStatus,
        posted_date: newRec.postedDate,
        video_url: newRec.videoUrl || newRec.video_url || '',
        thumbnail: newRec.thumbnail,
        description: newRec.description || '',
        instructions: newRec.instructions || '',
        target_batch: newRec.targetBatch
      }]);
      if (error) console.error('Supabase recording insert error:', error.message);
    } catch (err) { console.warn('Recording insert handled:', err); }
  };

  const updateRecording = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setRecordingsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    }));
    logActivity(`Updated lecture recording ID ${id} (${bKey})`, 'library');
    try {
      const dbFields = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.videoUrl !== undefined) dbFields.video_url = updatedFields.videoUrl;
      if (updatedFields.thumbnail !== undefined) dbFields.thumbnail = updatedFields.thumbnail;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('recordings').update(dbFields).eq('id', id);
        if (error) console.error('Supabase recording update error:', error.message);
      }
    } catch (err) { console.warn('Recording update handled:', err); }
  };

  const deleteRecording = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setRecordingsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((r) => r.id !== id)
    }));
    logActivity(`Removed video recording ID ${id} (${bKey})`, 'library');
    try {
      const { error } = await supabase.from('recordings').delete().eq('id', id);
      if (error) console.error('Supabase recording delete error:', error.message);
    } catch (err) { console.warn('Recording delete handled:', err); }
  };



  // --- PLACEMENT PREP ---
  const addPlacementResource = async (resData) => {
    const newRes = {
      id: `plc-${Date.now()}`,
      publishStatus: 'Published',
      readTime: '10 min read',
      author: 'Career Success Team',
      type: 'Guide',
      ...resData
    };
    setPlacementResources((prev) => [newRes, ...prev]);
    logActivity(`Added placement resource: "${newRes.title}"`, 'placement');

    try {
      await supabase.from('placement_resources').upsert([{
        id: newRes.id,
        category: newRes.category,
        title: newRes.title,
        type: newRes.type,
        author: newRes.author,
        snippet: newRes.snippet,
        link_url: newRes.linkUrl
      }]);
    } catch (err) {
      console.warn('Placement insert handled:', err);
    }
  };

  const updatePlacementResource = async (id, updatedFields) => {
    setPlacementResources((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, ...updatedFields } : pr))
    );
    logActivity(`Updated placement guide ID ${id}`, 'placement');

    const dbFields = {};
    if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.type !== undefined) dbFields.type = updatedFields.type;
    if (updatedFields.author !== undefined) dbFields.author = updatedFields.author;
    if (updatedFields.snippet !== undefined) dbFields.snippet = updatedFields.snippet;
    if (updatedFields.linkUrl !== undefined) dbFields.link_url = updatedFields.linkUrl;

    try {
      const { error } = await supabase.from('placement_resources').update(dbFields).eq('id', id);
      if (error) console.error('Supabase placement update error:', error.message);
    } catch (err) {
      console.warn('Placement update handled:', err);
    }
  };

  const deletePlacementResource = async (id) => {
    const pr = placementResources.find((item) => item.id === id);
    setPlacementResources((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed placement resource: "${pr?.title || id}"`, 'placement');

    try {
      await supabase.from('placement_resources').delete().eq('id', id);
    } catch (err) {
      console.warn('Placement delete handled:', err);
    }
  };

    // --- PROJECTS ---
  const addProject = async (projectData, targetBatch = activeBatchFilter) => {
    const batchTargetVal = projectData.targetBatch || 'ALL BATCHES';
    const bKey = resolveBatchKey(targetBatch);
    const techStackArray = Array.isArray(projectData.techStack)
      ? projectData.techStack
      : (typeof projectData.techStack === 'string'
          ? projectData.techStack.split(',').map((s) => s.trim())
          : ['React', 'Node.js', 'PostgreSQL']);

    const newProject = {
      id: `proj-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: batchTargetVal,
      assignedCount: projectData.assignedCount || 1,
      submittedCount: projectData.submittedCount || 0,
      feedbackCount: projectData.feedbackCount || 0,
      avgGrade: projectData.avgGrade || 0,
      status: projectData.status || 'Published',
      submissions: projectData.submissions || [],
      isLocked: projectData.isLocked || false,
      ...projectData,
      techStack: techStackArray
    };

    setProjectsByBatch((prev) => {
      const next = { ...prev };
      const keysToUpdate = (batchTargetVal === 'ALL BATCHES' || batchTargetVal === 'ALL')
        ? ['Weekday Batch', 'Weekend Batch']
        : [bKey];
      keysToUpdate.forEach(k => {
        next[k] = [newProject, ...(next[k] || []).filter(p => p.id !== newProject.id)];
      });
      return next;
    });

    logActivity(`Published new project: "${newProject.title}" (${batchTargetVal})`, 'project');
    try {
      const { error } = await supabase.from('projects').upsert([{
        id: newProject.id,
        title: newProject.title,
        type: newProject.type || 'Mini',
        category: newProject.category || 'Full-Stack Web Dev',
        difficulty: newProject.difficulty || 'Intermediate',
        description: newProject.description || '',
        tech_stack: newProject.techStack,
        due_date: newProject.dueDate || null,
        status: newProject.status,
        template_url: newProject.templateUrl || '',
        guidelines: newProject.guidelines || '',
        assigned_count: newProject.assignedCount,
        submitted_count: newProject.submittedCount,
        feedback_count: newProject.feedbackCount,
        avg_grade: newProject.avgGrade,
        is_locked: newProject.isLocked,
        submissions: newProject.submissions,
        target_batch: batchTargetVal,
        overview: newProject.overview || newProject.description || '',
        requirements: newProject.requirements || [],
        steps: newProject.steps || [],
        rubric: newProject.rubric || [],
        mentor_tip: newProject.mentorTip || '',
        course_id: newProject.courseId || '',
        stage_id: newProject.stageId || '',
        subtopic_id: newProject.subtopicId || '',
        inner_topic_id: newProject.innerTopicId || ''
      }]);
      if (error) console.error('Supabase project insert error:', error.message);
    } catch (err) { console.warn('Project insert handled:', err); }
  };

  const updateProject = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    let techStackArray = updatedFields.techStack;
    if (techStackArray && typeof techStackArray === 'string') {
      techStackArray = techStackArray.split(',').map((s) => s.trim());
    }

    const fieldsToApply = {
      ...updatedFields,
      ...(techStackArray !== undefined ? { techStack: techStackArray } : {})
    };

    setProjectsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((p) => (p.id === id ? { ...p, ...fieldsToApply } : p))
    }));
    logActivity(`Updated project listing ID ${id} (${bKey})`, 'project');
    try {
      const dbFields = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.type !== undefined) dbFields.type = updatedFields.type;
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.difficulty !== undefined) dbFields.difficulty = updatedFields.difficulty;
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
      if (updatedFields.isLocked !== undefined) dbFields.is_locked = updatedFields.isLocked;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (fieldsToApply.techStack !== undefined) dbFields.tech_stack = fieldsToApply.techStack;
      if (updatedFields.dueDate !== undefined) dbFields.due_date = updatedFields.dueDate;
      if (updatedFields.templateUrl !== undefined) dbFields.template_url = updatedFields.templateUrl;
      if (updatedFields.overview !== undefined) dbFields.overview = updatedFields.overview;
      if (updatedFields.requirements !== undefined) dbFields.requirements = updatedFields.requirements;
      if (updatedFields.steps !== undefined) dbFields.steps = updatedFields.steps;
      if (updatedFields.rubric !== undefined) dbFields.rubric = updatedFields.rubric;
      if (updatedFields.mentorTip !== undefined) dbFields.mentor_tip = updatedFields.mentorTip;
      if (updatedFields.courseId !== undefined) dbFields.course_id = updatedFields.courseId;
      if (updatedFields.stageId !== undefined) dbFields.stage_id = updatedFields.stageId;
      if (updatedFields.subtopicId !== undefined) dbFields.subtopic_id = updatedFields.subtopicId;
      if (updatedFields.innerTopicId !== undefined) dbFields.inner_topic_id = updatedFields.innerTopicId;

      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('projects').update(dbFields).eq('id', id);
        if (error) console.error('Supabase project update error:', error.message);
      }
    } catch (err) { console.warn('Project update handled:', err); }
  };

  const deleteProject = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setProjectsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((p) => p.id !== id)
    }));
    logActivity(`Deleted project ID ${id} (${bKey})`, 'project');
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) console.error('Supabase project delete error:', error.message);
    } catch (err) { console.warn('Project delete handled:', err); }
  };

  const gradeSubmission = async (projectId, submissionId, grade, feedback, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setProjectsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((p) => {
        if (p.id !== projectId) return p;
        const updatedSubmissions = (p.submissions || []).map((sub) =>
          sub.id === submissionId
            ? { ...sub, grade: Number(grade), mentorFeedback: feedback, status: 'Graded' }
            : sub
        );
        const gradedSubs = updatedSubmissions.filter((s) => s.status === 'Graded');
        const avg = gradedSubs.length > 0
          ? Math.round(gradedSubs.reduce((acc, cur) => acc + (cur.grade || 0), 0) / gradedSubs.length)
          : p.avgGrade;

        return {
          ...p,
          submissions: updatedSubmissions,
          feedbackCount: gradedSubs.length,
          avgGrade: avg
        };
      })
    }));
    logActivity(`Graded submission ${submissionId} for project ${projectId} (${bKey})`, 'project');
  };




    // --- CODING QUESTIONS BANK ---
  const addCodingQuestion = async (cqData, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    const newCq = {
      id: `cq-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
      targetBatch: bKey,
      createdDate: new Date().toISOString().split('T')[0],
      postedBy: 'Admin Portal',
      ...cqData
    };
    setCodingQuestionsByBatch((prev) => ({
      ...prev,
      [bKey]: [newCq, ...(prev[bKey] || [])]
    }));
    logActivity(`Posted new coding question: "${newCq.title}" (${bKey})`, 'coding');
    try {
      const { error } = await supabase.from('coding_questions').upsert([{
        id: newCq.id,
        title: newCq.title,
        difficulty: newCq.difficulty || 'Medium',
        category: newCq.category || 'Algorithms',
        tags: newCq.tags || [],
        problem_statement: newCq.problemStatement || '',
        starter_code: newCq.starterCode || '',
        solution_code: newCq.solutionCode || '',
        test_cases: newCq.testCases || [],
        created_date: newCq.createdDate,
        posted_by: newCq.postedBy,
        target_batch: newCq.targetBatch,
        course_id: newCq.courseId || '',
        stage_id: newCq.stageId || '',
        subtopic_id: newCq.subtopicId || '',
        inner_topic_id: newCq.innerTopicId || ''
      }]);
      if (error) console.error('Supabase coding question insert error:', error.message);
    } catch (err) { console.warn('Coding question insert handled:', err); }
  };

  const updateCodingQuestion = async (id, updatedFields, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setCodingQuestionsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).map((cq) => (cq.id === id ? { ...cq, ...updatedFields } : cq))
    }));
    logActivity(`Updated coding question ID ${id} (${bKey})`, 'coding');
    try {
      const dbFields = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.difficulty !== undefined) dbFields.difficulty = updatedFields.difficulty;
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.tags !== undefined) dbFields.tags = updatedFields.tags;
      if (updatedFields.problemStatement !== undefined) dbFields.problem_statement = updatedFields.problemStatement;
      if (updatedFields.starterCode !== undefined) dbFields.starter_code = updatedFields.starterCode;
      if (updatedFields.solutionCode !== undefined) dbFields.solution_code = updatedFields.solutionCode;
      if (updatedFields.testCases !== undefined) dbFields.test_cases = updatedFields.testCases;
      if (updatedFields.targetBatch !== undefined) dbFields.target_batch = updatedFields.targetBatch;
      if (updatedFields.courseId !== undefined) dbFields.course_id = updatedFields.courseId;
      if (updatedFields.stageId !== undefined) dbFields.stage_id = updatedFields.stageId;
      if (updatedFields.subtopicId !== undefined) dbFields.subtopic_id = updatedFields.subtopicId;
      if (updatedFields.innerTopicId !== undefined) dbFields.inner_topic_id = updatedFields.innerTopicId;
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('coding_questions').update(dbFields).eq('id', id);
        if (error) console.error('Supabase coding question update error:', error.message);
      }
    } catch (err) { console.warn('Coding question update handled:', err); }
  };

  const deleteCodingQuestion = async (id, targetBatch = activeBatchFilter) => {
    const bKey = resolveBatchKey(targetBatch);
    setCodingQuestionsByBatch((prev) => ({
      ...prev,
      [bKey]: (prev[bKey] || []).filter((cq) => cq.id !== id)
    }));
    logActivity(`Deleted coding question ID ${id} (${bKey})`, 'coding');
    try {
      const { error } = await supabase.from('coding_questions').delete().eq('id', id);
      if (error) console.error('Supabase coding question delete error:', error.message);
    } catch (err) { console.warn('Coding question delete handled:', err); }
  };

  // --- BADGES ---
  const addBadge = async (badgeData) => {
    const newBadge = {
      id: `badge-${Date.now()}`,
      name: badgeData.name || 'New Badge',
      description: badgeData.description || '',
      icon: badgeData.icon || 'Award',
      color: badgeData.color || 'purple',
      category: badgeData.category || 'Skill',
      criteria: badgeData.criteria || '',
      points: badgeData.points || '100 XP',
      targetBatch: badgeData.targetBatch || 'ALL BATCHES'
    };

    setBadges((prev) => {
      const updated = [newBadge, ...prev.filter((b) => b.id !== newBadge.id)];
      // Broadcast via milestones_data
      supabase.from('milestones_data').upsert([{
        id: 'badges_data',
        overview: { badges: updated },
        updated_at: new Date().toISOString()
      }]).then();
      return updated;
    });

    logActivity(`Created new badge: "${newBadge.name}"`, 'badge');

    try {
      await supabase.from('badges').upsert([{
        id: newBadge.id,
        name: newBadge.name,
        description: newBadge.description,
        icon: newBadge.icon,
        color: newBadge.color,
        category: newBadge.category,
        criteria: newBadge.criteria,
        points: newBadge.points,
        target_batch: newBadge.targetBatch
      }]);
    } catch (err) { console.warn('Badge insert handled:', err); }
  };

  const updateBadge = async (id, updatedFields) => {
    setBadges((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
      supabase.from('milestones_data').upsert([{
        id: 'badges_data',
        overview: { badges: updated },
        updated_at: new Date().toISOString()
      }]).then();
      return updated;
    });

    logActivity(`Updated badge ID ${id}`, 'badge');

    try {
      const dbFields = {};
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.icon !== undefined) dbFields.icon = updatedFields.icon;
      if (updatedFields.color !== undefined) dbFields.color = updatedFields.color;
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.criteria !== undefined) dbFields.criteria = updatedFields.criteria;
      if (updatedFields.points !== undefined) dbFields.points = updatedFields.points;
      if (updatedFields.targetBatch !== undefined) dbFields.target_batch = updatedFields.targetBatch;

      if (Object.keys(dbFields).length > 0) {
        await supabase.from('badges').update(dbFields).eq('id', id);
      }
    } catch (err) { console.warn('Badge update handled:', err); }
  };

  const deleteBadge = async (id) => {
    setBadges((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      supabase.from('milestones_data').upsert([{
        id: 'badges_data',
        overview: { badges: updated },
        updated_at: new Date().toISOString()
      }]).then();
      return updated;
    });

    logActivity(`Deleted badge ID ${id}`, 'badge');

    try {
      await supabase.from('badges').delete().eq('id', id);
    } catch (err) { console.warn('Badge delete handled:', err); }
  };



  // Milestones Dynamic Management Functions (Batch-Decoupled)
  const updateBatchState = (targetBatch, updaterFn) => {
    setMilestonesByBatch((prev) => {
      const next = { ...prev };

      const applyToBatch = (bKey) => {
        if (!next[bKey]) {
          next[bKey] = cloneMilestoneData(INITIAL_MILESTONES, bKey === 'Weekday Batch' ? 'w' : 's');
        }
        next[bKey] = updaterFn(next[bKey], bKey);
      };

      const resolvedBatch = (!targetBatch || targetBatch === 'ALL') ? activeBatchFilter : targetBatch;

      if (resolvedBatch === 'Weekday Batch' || resolvedBatch === 'Weekend Batch') {
        applyToBatch(resolvedBatch);
      } else {
        // If still 'ALL', apply independently to both batches
        applyToBatch('Weekday Batch');
        applyToBatch('Weekend Batch');
      }

      return next;
    });
  };

  const addStage = (newStageData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData, bKey) => {
      const bTag = bKey === 'Weekday Batch' ? 'w' : 's';
      const newStage = {
        id: `stage-${Date.now()}-${bTag}`,
        stageNumber: newStageData.stageNumber || `STAGE 0${(batchData.stages?.length || 0) + 1}`,
        phaseTag: newStageData.phaseTag || 'Phase Mastery',
        title: newStageData.title || 'New Milestone Stage',
        targetBatch: bKey,
        status: newStageData.status || 'AVAILABLE',
        statusType: newStageData.statusType || 'available',
        isLocked: newStageData.isLocked || false,
        unlockDate: newStageData.unlockDate || null,
        unlockTime: newStageData.unlockTime || null,
        unlockDateTime: newStageData.unlockDateTime || (newStageData.unlockDate ? `${newStageData.unlockDate}T${newStageData.unlockTime || '00:00'}` : null),
        subtopics: newStageData.subtopics || []
      };
      return {
        ...batchData,
        stages: [...(batchData.stages || []), newStage]
      };
    });
  };

  const updateStage = (stageId, updatedData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isMatch) return stg;
        const merged = { ...stg, ...updatedData };
        if (updatedData.unlockDate !== undefined || updatedData.unlockTime !== undefined) {
          const uDate = updatedData.unlockDate !== undefined ? updatedData.unlockDate : stg.unlockDate;
          const uTime = updatedData.unlockTime !== undefined ? updatedData.unlockTime : stg.unlockTime;
          merged.unlockDate = uDate;
          merged.unlockTime = uTime;
          merged.unlockDateTime = uDate ? `${uDate}T${uTime || '00:00'}` : null;
        }
        return merged;
      })
    }));
  };

  const setStageSchedule = (stageId, scheduleData, targetBatch = activeBatchFilter) => {
    const { unlockDate, unlockTime, unlockDateTime, isLocked } = scheduleData;
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isMatch) return stg;
        const uDate = unlockDate !== undefined ? unlockDate : stg.unlockDate;
        const uTime = unlockTime !== undefined ? unlockTime : stg.unlockTime;
        const uDateTime = unlockDateTime !== undefined ? unlockDateTime : (uDate ? `${uDate}T${uTime || '00:00'}` : null);
        return {
          ...stg,
          unlockDate: uDate,
          unlockTime: uTime,
          unlockDateTime: uDateTime,
          ...(isLocked !== undefined ? { isLocked, status: isLocked ? 'LOCKED' : (stg.status === 'LOCKED' ? 'AVAILABLE' : stg.status), statusType: isLocked ? 'locked' : (stg.statusType === 'locked' ? 'available' : stg.statusType) } : {})
        };
      })
    }));
  };

  const setSubtopicSchedule = (stageId, subtopicId, scheduleData, targetBatch = activeBatchFilter) => {
    const { unlockDate, unlockTime, unlockDateTime, isLocked } = scheduleData;
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            const uDate = unlockDate !== undefined ? unlockDate : sub.unlockDate;
            const uTime = unlockTime !== undefined ? unlockTime : sub.unlockTime;
            const uDateTime = unlockDateTime !== undefined ? unlockDateTime : (uDate ? `${uDate}T${uTime || '00:00'}` : null);
            return {
              ...sub,
              unlockDate: uDate,
              unlockTime: uTime,
              unlockDateTime: uDateTime,
              ...(isLocked !== undefined ? { isLocked } : {})
            };
          })
        };
      })
    }));
  };

  const setModuleSchedule = (stageId, subtopicId, moduleId, scheduleData, targetBatch = activeBatchFilter) => {
    const { unlockDate, unlockTime, unlockDateTime, isLocked } = scheduleData;
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                const uDate = unlockDate !== undefined ? unlockDate : mod.unlockDate;
                const uTime = unlockTime !== undefined ? unlockTime : mod.unlockTime;
                const uDateTime = unlockDateTime !== undefined ? unlockDateTime : (uDate ? `${uDate}T${uTime || '00:00'}` : null);
                return {
                  ...mod,
                  unlockDate: uDate,
                  unlockTime: uTime,
                  unlockDateTime: uDateTime,
                  ...(isLocked !== undefined ? { isLocked } : {})
                };
              })
            };
          })
        };
      })
    }));
  };

  const toggleStageLock = (stageId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isMatch) return stg;
        const currentlyLocked = stg.isLocked || stg.statusType === 'locked' || stg.status === 'LOCKED';
        const newIsLocked = !currentlyLocked;
        return {
          ...stg,
          isLocked: newIsLocked,
          statusType: newIsLocked ? 'locked' : 'available',
          status: newIsLocked ? 'LOCKED' : 'AVAILABLE',
          subtopics: (stg.subtopics || []).map((sub) => ({ ...sub, isLocked: newIsLocked }))
        };
      })
    }));
  };

  const updateStageStatus = (stageId, newStatus, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isMatch) return stg;
        let statusType = 'available';
        let isLocked = false;
        if (newStatus === 'COMPLETED') {
          statusType = 'completed';
        } else if (newStatus === 'IN PROGRESS') {
          statusType = 'in-progress';
        } else if (newStatus === 'LOCKED') {
          statusType = 'locked';
          isLocked = true;
        }
        return {
          ...stg,
          status: newStatus,
          statusType,
          isLocked,
          subtopics: isLocked
            ? (stg.subtopics || []).map((sub) => ({ ...sub, isLocked: true }))
            : (newStatus === 'AVAILABLE' ? (stg.subtopics || []).map((sub) => ({ ...sub, isLocked: false })) : (stg.subtopics || []))
        };
      })
    }));
  };

  const toggleSubtopicLock = (stageId, subtopicId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return { ...sub, isLocked: !sub.isLocked };
          })
        };
      })
    }));
  };

  const toggleModuleLock = (stageId, subtopicId, moduleId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                return { ...mod, isLocked: !mod.isLocked };
              })
            };
          })
        };
      })
    }));
  };

  const deleteStage = (stageId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).filter((stg) => stg.id !== stageId && stg.id.replace(/-[ws]$/, '') !== String(stageId).replace(/-[ws]$/, ''))
    }));
  };

  const addSubtopic = (stageId, newSubtopicData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData, bKey) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isMatch) return stg;
        const uDate = newSubtopicData.unlockDate || null;
        const uTime = newSubtopicData.unlockTime || null;
        const newSub = {
          id: `subtopic-${Date.now()}-${bKey === 'Weekday Batch' ? 'w' : 's'}`,
          title: newSubtopicData.title || 'New Subtopic',
          targetBatch: bKey,
          description: newSubtopicData.description || 'Click to view subtopics',
          duration: newSubtopicData.duration || 'Topic overview description.',
          unlockDate: uDate,
          unlockTime: uTime,
          unlockDateTime: newSubtopicData.unlockDateTime || (uDate ? `${uDate}T${uTime || '00:00'}` : null),
          isLocked: newSubtopicData.isLocked || false,
          modulesCount: 0,
          modules: []
        };
        return {
          ...stg,
          subtopics: [...(stg.subtopics || []), newSub]
        };
      })
    }));
  };

  const updateSubtopic = (stageId, subtopicId, updatedData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            const merged = { ...sub, ...updatedData };
            if (updatedData.unlockDate !== undefined || updatedData.unlockTime !== undefined) {
              const uDate = updatedData.unlockDate !== undefined ? updatedData.unlockDate : sub.unlockDate;
              const uTime = updatedData.unlockTime !== undefined ? updatedData.unlockTime : sub.unlockTime;
              merged.unlockDate = uDate;
              merged.unlockTime = uTime;
              merged.unlockDateTime = uDate ? `${uDate}T${uTime || '00:00'}` : null;
            }
            return merged;
          })
        };
      })
    }));
  };

  const deleteSubtopic = (stageId, subtopicId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).filter((sub) => sub.id !== subtopicId && sub.id.replace(/-[ws]$/, '') !== String(subtopicId).replace(/-[ws]$/, ''))
        };
      })
    }));
  };

  const addModule = (stageId, subtopicId, newModuleData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            const uDate = newModuleData.unlockDate || null;
            const uTime = newModuleData.unlockTime || null;
            const newMod = {
              id: `mod-${Date.now()}`,
              title: newModuleData.title || 'New Module',
              unlockDate: uDate,
              unlockTime: uTime,
              unlockDateTime: newModuleData.unlockDateTime || (uDate ? `${uDate}T${uTime || '00:00'}` : null),
              isLocked: newModuleData.isLocked || false,
              items: []
            };
            const updatedMods = [...(sub.modules || []), newMod];
            return {
              ...sub,
              modulesCount: updatedMods.length,
              modules: updatedMods
            };
          })
        };
      })
    }));
  };

  const updateModule = (stageId, subtopicId, moduleId, updatedData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                const merged = { ...mod, ...updatedData };
                if (updatedData.unlockDate !== undefined || updatedData.unlockTime !== undefined) {
                  const uDate = updatedData.unlockDate !== undefined ? updatedData.unlockDate : mod.unlockDate;
                  const uTime = updatedData.unlockTime !== undefined ? updatedData.unlockTime : mod.unlockTime;
                  merged.unlockDate = uDate;
                  merged.unlockTime = uTime;
                  merged.unlockDateTime = uDate ? `${uDate}T${uTime || '00:00'}` : null;
                }
                return merged;
              })
            };
          })
        };
      })
    }));
  };

  const deleteModule = (stageId, subtopicId, moduleId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            const updatedMods = (sub.modules || []).filter((mod) => mod.id !== moduleId && mod.id.replace(/-[ws]$/, '') !== String(moduleId).replace(/-[ws]$/, ''));
            return {
              ...sub,
              modulesCount: updatedMods.length,
              modules: updatedMods
            };
          })
        };
      })
    }));
  };

  const addLearningItem = (stageId, subtopicId, moduleId, newItemData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                const newItem = {
                  id: `item-${Date.now()}`,
                  type: newItemData.type || 'LIVE CLASS',
                  typeColor: newItemData.typeColor || 'bg-purple-100 text-purple-700 border-purple-200',
                  iconName: newItemData.iconName || 'Video',
                  iconBg: newItemData.iconBg || 'bg-purple-600 text-white',
                  title: newItemData.title || 'New Resource',
                  actionText: newItemData.actionText || 'JOIN',
                  url: newItemData.url || '#',
                  btnStyle: newItemData.btnStyle || 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                };
                return {
                  ...mod,
                  items: [...(mod.items || []), newItem]
                };
              })
            };
          })
        };
      })
    }));
  };

  const updateLearningItem = (stageId, subtopicId, moduleId, itemId, updatedData, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                return {
                  ...mod,
                  items: (mod.items || []).map((itm) => (itm.id === itemId || itm.id.replace(/-[ws]$/, '') === String(itemId).replace(/-[ws]$/, '') ? { ...itm, ...updatedData } : itm))
                };
              })
            };
          })
        };
      })
    }));
  };

  const deleteLearningItem = (stageId, subtopicId, moduleId, itemId, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      stages: (batchData.stages || []).map((stg) => {
        const isStageMatch = stg.id === stageId || stg.id.replace(/-[ws]$/, '') === String(stageId).replace(/-[ws]$/, '');
        if (!isStageMatch) return stg;
        return {
          ...stg,
          subtopics: (stg.subtopics || []).map((sub) => {
            const isSubMatch = sub.id === subtopicId || sub.id.replace(/-[ws]$/, '') === String(subtopicId).replace(/-[ws]$/, '');
            if (!isSubMatch) return sub;
            return {
              ...sub,
              modules: (sub.modules || []).map((mod) => {
                const isModMatch = mod.id === moduleId || mod.id.replace(/-[ws]$/, '') === String(moduleId).replace(/-[ws]$/, '');
                if (!isModMatch) return mod;
                return {
                  ...mod,
                  items: (mod.items || []).filter((itm) => itm.id !== itemId && itm.id.replace(/-[ws]$/, '') !== String(itemId).replace(/-[ws]$/, ''))
                };
              })
            };
          })
        };
      })
    }));
  };

  const updateMilestonesOverview = (updatedOverview, targetBatch = activeBatchFilter) => {
    updateBatchState(targetBatch, (batchData) => ({
      ...batchData,
      overview: { ...(batchData.overview || {}), ...updatedOverview }
    }));
  };

  const formatMobileWithCountryCode = (phoneVal) => {
    if (!phoneVal) return '';
    const trimmed = phoneVal.trim();
    if (!trimmed) return '';

    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return trimmed;

    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  };

  const addStudent = async (studentData) => {
    const sName = studentData.name || 'Student';
    const initAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sName.trim())}&backgroundColor=e0e7ff&textColor=3730a3&bold=true`;
    const cleanAvatar = (!studentData.avatar || studentData.avatar.includes('unsplash.com')) ? initAvatar : studentData.avatar;
    const cleanMobile = formatMobileWithCountryCode(studentData.mobileNumber || studentData.mobile_number);

    const newStudent = {
      id: `std-${Date.now()}`,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourses: studentData.enrolledCourses || ['crs-1786624019154-w'],
      unlockedStages: ['stg-1'],
      ...studentData,
      mobileNumber: cleanMobile,
      avatar: cleanAvatar
    };
    setStudents((prev) => [newStudent, ...prev]);

    try {
      await supabase.from('students').upsert([{
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        mobile_number: newStudent.mobileNumber,
        registration_id: newStudent.registrationId,
        batch: newStudent.batch,
        enrolled_courses: newStudent.enrolledCourses,
        avatar: newStudent.avatar,
        status: newStudent.status,
        joined_date: newStudent.joinedDate
      }]);
    } catch (err) {
      console.warn('Student insert handled:', err);
    }
  };

  const updateStudent = async (id, updatedData) => {
    const targetStudent = students.find((s) => s.id === id);
    const updatedName = updatedData.name || targetStudent?.name || 'Student';
    const initAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(updatedName.trim())}&backgroundColor=e0e7ff&textColor=3730a3&bold=true`;

    let cleanAvatar = updatedData.avatar !== undefined ? updatedData.avatar : targetStudent?.avatar;
    if (!cleanAvatar || cleanAvatar.includes('unsplash.com')) {
      cleanAvatar = initAvatar;
    }

    const cleanMobile = updatedData.mobileNumber !== undefined ? formatMobileWithCountryCode(updatedData.mobileNumber) : undefined;

    const payload = { ...updatedData, avatar: cleanAvatar };
    if (cleanMobile !== undefined) payload.mobileNumber = cleanMobile;

    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...payload } : s)));

    const dbFields = {};
    if (payload.name !== undefined) dbFields.name = payload.name;
    if (payload.email !== undefined) dbFields.email = payload.email;
    if (payload.mobileNumber !== undefined) dbFields.mobile_number = payload.mobileNumber;
    if (payload.registrationId !== undefined) dbFields.registration_id = payload.registrationId;
    if (payload.batch !== undefined) dbFields.batch = payload.batch;
    if (payload.enrolledCourses !== undefined) dbFields.enrolled_courses = payload.enrolledCourses;
    dbFields.avatar = cleanAvatar;
    if (payload.status !== undefined) dbFields.status = payload.status;

    try {
      const { error } = await supabase.from('students').update(dbFields).eq('id', id);
      if (error) console.error('Supabase student update error:', error.message);
    } catch (err) {
      console.warn('Student update handled:', err);
    }
  };

  const deleteStudent = async (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));

    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) console.error('Supabase student delete error:', error.message);
    } catch (err) {
      console.warn('Student delete handled:', err);
    }
  };
// --- COURSE LESSONS (Sub-modules) ---
  const addCourseLesson = async (lessonData) => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      sort_order: courseLessons.filter(l => l.module_id === lessonData.module_id).length,
      created_at: new Date().toISOString(),
      ...lessonData
    };
    setCourseLessons(prev => [...prev, newLesson]);
    try {
      const { error } = await supabase.from('course_lessons').insert([newLesson]);
      if (error) console.error('Supabase lesson insert error:', error.message);
    } catch (err) { console.warn('Lesson insert handled:', err); }
    return newLesson;
  };

  const updateCourseLesson = async (id, updatedFields) => {
    setCourseLessons(prev => prev.map(l => l.id === id ? { ...l, ...updatedFields } : l));
    try {
      const { error } = await supabase.from('course_lessons').update(updatedFields).eq('id', id);
      if (error) console.error('Supabase lesson update error:', error.message);
    } catch (err) { console.warn('Lesson update handled:', err); }
  };

  const deleteCourseLesson = async (id) => {
    setCourseLessons(prev => prev.filter(l => l.id !== id));
    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', id);
      if (error) console.error('Supabase lesson delete error:', error.message);
    } catch (err) { console.warn('Lesson delete handled:', err); }
  };

  const getLessonsForModule = (courseId, stageId, moduleId) => {
    return courseLessons
      .filter(l => l.course_id === courseId && l.stage_id === stageId && l.module_id === moduleId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  // --- MILESTONE LOCKS ---
  const setLessonLock = async (lockData) => {
    const lockId = `lock-${lockData.lesson_id}-${lockData.batch_code}`;
    const unlockDatetime = lockData.unlock_date && lockData.unlock_time
      ? new Date(`${lockData.unlock_date}T${lockData.unlock_time}:00`).toISOString()
      : null;
    const lockRecord = {
      id: lockId,
      is_locked: true,
      updated_at: new Date().toISOString(),
      unlock_datetime: unlockDatetime,
      ...lockData
    };
    setMilestoneLocks(prev => {
      const existing = prev.findIndex(l => l.lesson_id === lockData.lesson_id && l.batch_code === lockData.batch_code);
      if (existing >= 0) {
        return prev.map((l, i) => i === existing ? { ...l, ...lockRecord } : l);
      }
      return [...prev, lockRecord];
    });
    try {
      const { error } = await supabase.from('milestone_locks').upsert([lockRecord], { onConflict: 'lesson_id,batch_code' });
      if (error) console.error('Supabase lock upsert error:', error.message);
    } catch (err) { console.warn('Lock upsert handled:', err); }
  };

  const removeLessonLock = async (lessonId, batchCode) => {
    setMilestoneLocks(prev => prev.filter(l => !(l.lesson_id === lessonId && l.batch_code === batchCode)));
    try {
      const { error } = await supabase.from('milestone_locks').delete().eq('lesson_id', lessonId).eq('batch_code', batchCode);
      if (error) console.error('Supabase lock delete error:', error.message);
    } catch (err) { console.warn('Lock delete handled:', err); }
  };

  const getLessonLockStatus = (lessonId, batchCode) => {
    const lock = milestoneLocks.find(l => l.lesson_id === lessonId && l.batch_code === batchCode);
    if (!lock) return { isLocked: false, unlockDateTime: null, label: 'UNLOCKED' };
    const now = new Date();
    const unlockTime = lock.unlock_datetime ? new Date(lock.unlock_datetime) : null;
    if (unlockTime && now >= unlockTime) {
      return { isLocked: false, unlockDateTime: lock.unlock_datetime, label: 'UNLOCKED' };
    }
    return {
      isLocked: true,
      unlockDateTime: lock.unlock_datetime,
      label: unlockTime ? `Unlocks ${unlockTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ${lock.unlock_time || ''}` : 'LOCKED'
    };
  };

  const getLocksForCourse = (courseId) => {
    return milestoneLocks.filter(l => l.course_id === courseId);
  };

  const updateStageSubtopics = async (courseId, stageId, subtopicsList) => {
    // Update local state first
    setCoursesByBatch((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = (next[key] || []).map((c) => {
          if (c.id === courseId && c.topics) {
            const updatedTopics = c.topics.map((t) =>
              t.id === stageId ? { ...t, subtopics: subtopicsList } : t
            );
            return { ...c, topics: updatedTopics };
          }
          return c;
        });
      });
      return next;
    });

    // Find stage properties from local state to perform upsert
    let stageTitle = 'Stage';
    let liveClasses = 0;
    let practice = 0;
    let assessments = 0;

    const activeCourse = courses.find(c => c.id === courseId);
    if (activeCourse && activeCourse.topics) {
      const matched = activeCourse.topics.find(t => t.id === stageId);
      if (matched) {
        stageTitle = matched.title || stageTitle;
        liveClasses = matched.liveClasses || matched.live_classes || 0;
        practice = matched.practice || 0;
        assessments = matched.assessments || 0;
      }
    }

    // Write to Supabase (using upsert to automatically create missing fallback stages)
    try {
      const { error } = await supabase
        .from('course_topics')
        .upsert([{
          id: stageId,
          course_id: courseId,
          title: stageTitle,
          live_classes: liveClasses,
          practice: practice,
          assessments: assessments,
          subtopics: subtopicsList
        }], { onConflict: 'id' });
      if (error) console.error('Supabase updateStageSubtopics error:', error.message);
    } catch (err) {
      console.warn('updateStageSubtopics handled:', err);
    }
  };

  // Reward Management Handlers with Real-time Supabase Database Sync
  const addReward = async (newReward) => {
    const isLocked = newReward.is_locked !== undefined 
      ? newReward.is_locked 
      : (newReward.isReleased !== undefined ? !newReward.isReleased : true);

    const item = {
      ...newReward,
      id: newReward.id || `rew-${Date.now()}`,
      title: newReward.reward_title || newReward.title || 'New Reward',
      reward_title: newReward.reward_title || newReward.title || 'New Reward',
      image: newReward.reward_image_url || newReward.image || '/rewards/stickers.jpg',
      image_url: newReward.reward_image_url || newReward.image || '/rewards/stickers.jpg',
      reward_image_url: newReward.reward_image_url || newReward.image || '/rewards/stickers.jpg',
      requiredXp: Number(newReward.reward_required_xp_points || newReward.requiredXp || 1000),
      required_xp: Number(newReward.reward_required_xp_points || newReward.requiredXp || 1000),
      reward_required_xp_points: Number(newReward.reward_required_xp_points || newReward.requiredXp || 1000),
      isReleased: !isLocked,
      is_released: !isLocked,
      is_locked: isLocked,
      category: newReward.category || 'ACCESSORIES',
      stock: Number(newReward.stock || 50),
      description: newReward.description || '',
      unlockedCount: 0
    };

    setRewards((prev) => [item, ...prev.filter((r) => r.id !== item.id)]);

    try {
      await supabase.from('rewards').upsert([{
        id: item.id,
        reward_title: item.reward_title,
        reward_image_url: item.reward_image_url,
        reward_required_xp_points: item.reward_required_xp_points,
        is_locked: item.is_locked,
        category: item.category,
        stock: item.stock,
        description: item.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Supabase addReward handled:', err);
    }
  };

  const updateReward = async (id, updatedFields) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );

    try {
      const dbFields = { updated_at: new Date().toISOString() };
      if (updatedFields.title !== undefined || updatedFields.reward_title !== undefined) {
        dbFields.reward_title = updatedFields.reward_title || updatedFields.title;
      }
      if (updatedFields.image !== undefined || updatedFields.reward_image_url !== undefined || updatedFields.image_url !== undefined) {
        dbFields.reward_image_url = updatedFields.reward_image_url || updatedFields.image || updatedFields.image_url;
      }
      if (updatedFields.requiredXp !== undefined || updatedFields.reward_required_xp_points !== undefined) {
        dbFields.reward_required_xp_points = Number(updatedFields.reward_required_xp_points || updatedFields.requiredXp);
      }
      if (updatedFields.is_locked !== undefined) {
        dbFields.is_locked = updatedFields.is_locked;
      } else if (updatedFields.isReleased !== undefined) {
        dbFields.is_locked = !updatedFields.isReleased;
      }
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.stock !== undefined) dbFields.stock = Number(updatedFields.stock);
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;

      await supabase.from('rewards').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateReward handled:', err);
    }
  };

  const deleteReward = async (id) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));

    try {
      await supabase.from('rewards').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteReward handled:', err);
    }
  };

  const toggleReleaseReward = async (id) => {
    const target = rewards.find((r) => r.id === id);
    const newReleased = target ? !target.isReleased : true;
    const newLocked = !newReleased;

    setRewards((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isReleased: newReleased,
              is_released: newReleased,
              is_locked: newLocked
            }
          : r
      )
    );

    try {
      await supabase.from('rewards').update({
        is_locked: newLocked,
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (err) {
      console.warn('Supabase toggleReleaseReward handled:', err);
    }
  };

  const releaseAllRewards = async () => {
    setRewards((prev) =>
      prev.map((r) => ({
        ...r,
        isReleased: true,
        is_released: true,
        is_locked: false
      }))
    );

    try {
      await supabase.from('rewards').update({
        is_locked: false,
        updated_at: new Date().toISOString()
      }).neq('id', 'null');
    } catch (err) {
      console.warn('Supabase releaseAllRewards handled:', err);
    }
  };

  const lockAllRewards = async () => {
    setRewards((prev) =>
      prev.map((r) => ({
        ...r,
        isReleased: false,
        is_released: false,
        is_locked: true
      }))
    );

    try {
      await supabase.from('rewards').update({
        is_locked: true,
        updated_at: new Date().toISOString()
      }).neq('id', 'null');
    } catch (err) {
      console.warn('Supabase lockAllRewards handled:', err);
    }
  };

  return (
    <LmsDataContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        rewards,
        rewardsStoreConfig,
        updateRewardsStoreConfig,
        addReward,
        updateReward,
        deleteReward,
        toggleReleaseReward,
        releaseAllRewards,
        lockAllRewards,
        rolePermissions,
        toggleRolePermission,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        assessments,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        codingQuestions,
        addCodingQuestion,
        updateCodingQuestion,
        deleteCodingQuestion,
        liveSessions,
        addLiveSession,
        updateLiveSession,
        deleteLiveSession,
        toggleLiveSessionLock,
        jobs,
        addJob,
        updateJob,
        toggleJobLock,
        deleteJob,
        recordings,
        addRecording,
        updateRecording,
        deleteRecording,
        placementResources,
        addPlacementResource,
        updatePlacementResource,
        deletePlacementResource,
        projects,
        addProject,
        updateProject,
        deleteProject,
        milestonesByBatch,
        getMilestoneDataForBatch,
        milestones,
        addStage,
        updateStage,
        setStageSchedule,
        toggleStageLock,
        updateStageStatus,
        deleteStage,
        updateStageSubtopics,
        addSubtopic,
        updateSubtopic,
        setSubtopicSchedule,
        toggleSubtopicLock,
        deleteSubtopic,
        addModule,
        updateModule,
        setModuleSchedule,
        toggleModuleLock,
        deleteModule,
        addLearningItem,
        updateLearningItem,
        deleteLearningItem,
        updateMilestonesOverview,
        gradeSubmission,
        activities,
        isSupabaseConnected,
        coursesByBatch,
        getCoursesForBatch,
        assessmentsByBatch,
        getAssessmentsForBatch,
        liveSessionsByBatch,
        getLiveSessionsForBatch,
        jobsByBatch,
        getJobsForBatch,
        recordingsByBatch,
        getRecordingsForBatch,
        projectsByBatch,
        getProjectsForBatch,
        codingQuestionsByBatch,
        getCodingQuestionsForBatch,
        badges,
        addBadge,
        updateBadge,
        deleteBadge,
        availableBatches,
        addBatch,
        deleteBatch,
        activeBatchFilter,
        setActiveBatchFilter,
        completedMilestoneItemIds,
        toggleItemCompletion,
        markItemCompleted,
        unmarkItemCompleted,
        toggleSubtopicCompletion,
        courseLessons,
        addCourseLesson,
        updateCourseLesson,
        deleteCourseLesson,
        getLessonsForModule,
        milestoneLocks,
        setLessonLock,
        removeLessonLock,
        getLessonLockStatus,
        getLocksForCourse
      }}
    >
      {children}
    </LmsDataContext.Provider>
  );
}

const defaultLmsDataContext = {
  courses: [],
  schedules: [],
  liveSessions: [],
  jobs: [],
  recordings: [],
  completedMilestoneItemIds: [],
  toggleItemCompletion: () => {},
  markItemCompleted: () => {},
  unmarkItemCompleted: () => {},
  toggleSubtopicCompletion: () => {},
  courseLessons: [],
  addCourseLesson: async () => {},
  updateCourseLesson: async () => {},
  deleteCourseLesson: async () => {},
  getLessonsForModule: () => [],
  milestoneLocks: [],
  setLessonLock: async () => {},
  removeLessonLock: async () => {},
  getLessonLockStatus: () => ({ isLocked: false, unlockDateTime: null, label: 'UNLOCKED' }),
  getLocksForCourse: () => [],
  projects: [],
  codingQuestions: [],
  rewards: [],
  rewardsStoreConfig: {
    badgeText: 'STUDENT MERCHANDISE & SWAG STORE',
    title: 'AspireNext Rewards & Merchandise',
    description: 'Earn XP points by solving coding practice problems, completing quizzes, and finishing course modules to unlock official branded merchandise.',
    xpBadgeLabel: '0 Total Student XP'
  },
  updateRewardsStoreConfig: () => {},
  addReward: () => {},
  updateReward: () => {},
  deleteReward: () => {},
  toggleReleaseReward: () => {},
  releaseAllRewards: () => {},
  lockAllRewards: () => {},
  activities: [],
  isSupabaseConnected: false,
  activeBatchFilter: 'ALL',
  setActiveBatchFilter: () => {},
  addCourse: async () => {},
  updateCourse: async () => {},
  deleteCourse: async () => {},
  updateStageSubtopics: async () => {},
  addScheduleTopic: async () => {},
  updateScheduleTopic: async () => {},
  deleteScheduleTopic: async () => {},
  addLiveSession: async () => {},
  updateLiveSession: async () => {},
  deleteLiveSession: async () => {},
  addJob: async () => {},
  updateJob: async () => {},
  toggleJobLock: async () => {},
  deleteJob: async () => {},
  addRecording: async () => {},
  updateRecording: async () => {},
  deleteRecording: async () => {},
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  gradeSubmission: async () => {},
  addCodingQuestion: async () => {},
  updateCodingQuestion: async () => {},
  deleteCodingQuestion: async () => {}
};

export function useLmsData() {
  const context = useContext(LmsDataContext);
  return context || defaultLmsDataContext;
}
