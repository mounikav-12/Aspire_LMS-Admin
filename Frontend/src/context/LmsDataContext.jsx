import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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
  INITIAL_ROLE_PERMISSIONS,
  MOCK_ACTIVITIES,
  ROLES
} from '../utils/mockData';

const LmsDataContext = createContext(null);

export function LmsDataProvider({ children }) {
  // State Initialization
  const [users, setUsers] = useState(INITIAL_USERS);
  const [rolePermissions, setRolePermissions] = useState(INITIAL_ROLE_PERMISSIONS);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [liveSessions, setLiveSessions] = useState(INITIAL_LIVE_SESSIONS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [recordings, setRecordings] = useState(INITIAL_RECORDINGS);
  const [placementResources, setPlacementResources] = useState(INITIAL_PLACEMENT_RESOURCES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('aspire_lms_milestones');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.stages && parsed.stages.length === 4 && parsed.stages[0]?.subtopics?.[0]?.duration?.includes('Git Architecture')) {
          return parsed;
        }
      } catch (e) {
        return INITIAL_MILESTONES;
      }
    }
    return INITIAL_MILESTONES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aspire_lms_milestones', JSON.stringify(milestones));
      // Sync to Supabase PostgreSQL database
      if (milestones && milestones.stages) {
        supabase
          .from('milestones_data')
          .upsert({
            id: 'default',
            overview: milestones.overview || {},
            stages: milestones.stages || [],
            updated_at: new Date().toISOString()
          })
          .then(() => {})
          .catch((e) => console.warn('Supabase milestones sync error:', e));
      }
    } catch (e) {}
  }, [milestones]);
  const [codingQuestions, setCodingQuestions] = useState(() => {
    const saved = localStorage.getItem('aspire_lms_coding_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CODING_QUESTIONS;
      }
    }
    return INITIAL_CODING_QUESTIONS;
  });
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Fetch Data from Supabase PostgreSQL
  const fetchSupabaseData = async () => {
    try {
      // 1. Fetch Profiles
      const { data: profilesData, error: profilesErr } = await supabase.from('profiles').select('*');
      if (!profilesErr && profilesData && profilesData.length > 0) {
        setUsers(profilesData.map(u => ({
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          role: u.role || 'Instructor',
          originalRole: u.original_role || u.originalRole || u.role || 'Instructor',
          department: u.department || 'Curriculum Operations',
          status: u.status || 'Active',
          joinedDate: u.joined_date || u.joinedDate || '',
          phone: u.phone || '+91 98765-43210',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        })));
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
        topicsData.forEach(t => {
          if (!topicsByCourse[t.course_id]) topicsByCourse[t.course_id] = [];
          topicsByCourse[t.course_id].push({
            id: t.id,
            title: t.title || '',
            liveClasses: t.live_classes || 0,
            practice: t.practice || 0,
            assessments: t.assessments || 0
          });
        });
      }

      // 4. Fetch Courses Catalog
      const { data: coursesData, error: coursesErr } = await supabase.from('courses').select('*');
      if (!coursesErr && coursesData && coursesData.length > 0) {
        setCourses(coursesData.map(c => {
          const dbTopics = topicsByCourse[c.id];
          const defaultCourse = INITIAL_COURSES.find(ic => ic.id === c.id);
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
            topics: dbTopics && dbTopics.length > 0 ? dbTopics : (defaultCourse?.topics || [])
          };
        }));
      }

      // 5. Fetch Jobs
      const { data: jobsData, error: jobsErr } = await supabase.from('jobs').select('*');
      if (!jobsErr && jobsData && jobsData.length > 0) {
        setJobs(jobsData.map(j => ({
          id: j.id,
          company: j.company || '',
          jobTitle: j.job_title || j.jobTitle || '',
          jobType: j.job_type || j.jobType || 'Full-Time',
          salary: j.salary || '₹14,00,000 - ₹18,00,000 / yr',
          location: j.location || '',
          postedDate: j.posted_date || j.postedDate || '',
          publishStatus: j.publish_status || j.publishStatus || 'Live Feed',
          logo: j.logo || '',
          description: j.description || ''
        })));
      }

      // 6. Fetch Live Sessions
      const { data: sessionsData, error: sessionsErr } = await supabase.from('live_sessions').select('*');
      if (!sessionsErr && sessionsData && sessionsData.length > 0) {
        setLiveSessions(sessionsData.map(s => ({
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
          description: s.description || ''
        })));
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

      // 8. Fetch Milestones Roadmap Data
      const { data: milestonesData, error: milestonesErr } = await supabase.from('milestones_data').select('*');
      if (!milestonesErr && milestonesData && milestonesData.length > 0) {
        const defaultRow = milestonesData.find(m => m.id === 'default') || milestonesData[0];
        if (defaultRow && defaultRow.stages) {
          setMilestones({
            overview: defaultRow.overview || INITIAL_MILESTONES.overview,
            stages: defaultRow.stages || INITIAL_MILESTONES.stages
          });
        }
      }
    } catch (err) {
      console.warn('Supabase initial fetch using fallback mock data:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseData();

    // Set up Realtime Sync Channel
    let channel;
    try {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          () => {
            fetchSupabaseData();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Supabase Realtime channel subscription skipped:', err);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      }
    };
  }, []);

  // Log Activity Helper
  const logActivity = async (text, type = 'info') => {
    const newAct = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 9)]);

    try {
      await supabase.from('audit_activities').insert([newAct]);
    } catch (err) {
      console.warn('Audit activity save skipped:', err);
    }
  };

  // --- USER MANAGEMENT ---
  const addUser = async (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      role: userData.role || ROLES.INSTRUCTOR,
      originalRole: userData.role || ROLES.INSTRUCTOR,
      phone: userData.phone || '+91 98765-43210',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...userData
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
  const addCourse = async (courseData) => {
    const newCourse = {
      id: `crs-${Date.now()}`,
      enrolledCount: 0,
      rating: 5.0,
      publishStatus: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      topics: courseData.topics || [],
      ...courseData
    };
    setCourses((prev) => [newCourse, ...prev]);
    logActivity(`Created new course: "${newCourse.title}"`, 'course');

    try {
      await supabase.from('courses').upsert([{
        id: newCourse.id,
        title: newCourse.title,
        category: newCourse.category,
        level: newCourse.level,
        instructor: newCourse.instructor,
        thumbnail: newCourse.thumbnail,
        description: newCourse.description
      }]);

      if (newCourse.topics && newCourse.topics.length > 0) {
        await supabase.from('course_topics').upsert(
          newCourse.topics.map((t) => ({
            id: t.id || `top-${Date.now()}-${Math.random()}`,
            course_id: newCourse.id,
            title: t.title,
            live_classes: t.liveClasses || 0,
            practice: t.practice || 0,
            assessments: t.assessments || 0
          }))
        );
      }
    } catch (err) {
      console.warn('Course insert handled:', err);
    }
  };

  const updateCourse = async (id, updatedFields) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    logActivity(`Updated course properties for ID ${id}`, 'course');

    const dbFields = {};
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
    if (updatedFields.level !== undefined) dbFields.level = updatedFields.level;
    if (updatedFields.instructor !== undefined) dbFields.instructor = updatedFields.instructor;
    if (updatedFields.thumbnail !== undefined) dbFields.thumbnail = updatedFields.thumbnail;
    if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
    if (updatedFields.publishStatus !== undefined) dbFields.publish_status = updatedFields.publishStatus;

    try {
      if (Object.keys(dbFields).length > 0) {
        const { error } = await supabase.from('courses').update(dbFields).eq('id', id);
        if (error) console.error('Supabase course update error:', error.message);
      }

      if (updatedFields.topics) {
        const topicPayloads = updatedFields.topics.map((t) => ({
          id: t.id || `top-${Date.now()}-${Math.random()}`,
          course_id: id,
          title: t.title,
          live_classes: t.liveClasses !== undefined ? t.liveClasses : (t.live_classes || 0),
          practice: t.practice !== undefined ? t.practice : 0,
          assessments: t.assessments !== undefined ? t.assessments : 0
        }));

        const { error: topicsErr } = await supabase.from('course_topics').upsert(topicPayloads);
        if (topicsErr) console.error('Supabase course_topics upsert error:', topicsErr.message);
      }
    } catch (err) {
      console.warn('Course update handled:', err);
    }
  };

  const deleteCourse = async (id) => {
    const c = courses.find((item) => item.id === id);
    setCourses((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Deleted course track: "${c?.title || id}"`, 'course');

    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (err) {
      console.warn('Course delete handled:', err);
    }
  };

  // --- ASSESSMENTS ---
  const addAssessment = async (asmData) => {
    const mcqCount = asmData.mcqs?.length || asmData.mcqCount || 0;
    const codingCount = asmData.codingQuestions?.length || asmData.codingCount || 0;
    const totalQuestions = mcqCount + codingCount;

    const newAsm = {
      id: `asm-${Date.now()}`,
      status: 'Active',
      publishStatus: 'Published',
      mcqCount,
      codingCount,
      totalQuestions,
      ...asmData
    };
    setAssessments((prev) => [newAsm, ...prev]);
    logActivity(`Published assessment evaluation: "${newAsm.title}" (${totalQuestions} Questions)`, 'assessment');

    try {
      await supabase.from('assessments').upsert([{
        id: newAsm.id,
        title: newAsm.title,
        course_id: newAsm.courseId,
        course_name: newAsm.courseName,
        duration_minutes: newAsm.durationMinutes,
        total_marks: newAsm.totalMarks,
        due_date: newAsm.dueDate,
        mcqs: newAsm.mcqs,
        coding_questions: newAsm.codingQuestions
      }]);
    } catch (err) {
      console.warn('Assessment insert handled:', err);
    }
  };

  const updateAssessment = async (id, updatedFields) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const mcqCount = updatedFields.mcqs ? updatedFields.mcqs.length : (a.mcqs?.length || a.mcqCount || 0);
        const codingCount = updatedFields.codingQuestions ? updatedFields.codingQuestions.length : (a.codingQuestions?.length || a.codingCount || 0);
        const totalQuestions = mcqCount + codingCount;

        return {
          ...a,
          ...updatedFields,
          mcqCount,
          codingCount,
          totalQuestions
        };
      })
    );
    logActivity(`Updated assessment quiz ID ${id}`, 'assessment');

    const dbFields = {};
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.courseId !== undefined) dbFields.course_id = updatedFields.courseId;
    if (updatedFields.courseName !== undefined) dbFields.course_name = updatedFields.courseName;
    if (updatedFields.durationMinutes !== undefined) dbFields.duration_minutes = updatedFields.durationMinutes;
    if (updatedFields.totalMarks !== undefined) dbFields.total_marks = updatedFields.totalMarks;
    if (updatedFields.dueDate !== undefined) dbFields.due_date = updatedFields.dueDate;
    if (updatedFields.mcqs !== undefined) dbFields.mcqs = updatedFields.mcqs;
    if (updatedFields.codingQuestions !== undefined) dbFields.coding_questions = updatedFields.codingQuestions;

    try {
      const { error } = await supabase.from('assessments').update(dbFields).eq('id', id);
      if (error) console.error('Supabase assessment update error:', error.message);
    } catch (err) {
      console.warn('Assessment update handled:', err);
    }
  };

  const deleteAssessment = async (id) => {
    const a = assessments.find((item) => item.id === id);
    setAssessments((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed assessment: "${a?.title || id}"`, 'assessment');

    try {
      await supabase.from('assessments').delete().eq('id', id);
    } catch (err) {
      console.warn('Assessment delete handled:', err);
    }
  };

  // --- LIVE SESSIONS ---
  const addLiveSession = async (sessData) => {
    const newSess = {
      id: `sess-${Date.now()}`,
      status: 'Live Soon',
      publishStatus: 'Published to Student LMS',
      ...sessData
    };
    setLiveSessions((prev) => [newSess, ...prev]);
    logActivity(`Scheduled live class: "${newSess.sessionTitle}"`, 'session');

    try {
      await supabase.from('live_sessions').upsert([{
        id: newSess.id,
        program_name: newSess.programName,
        technology: newSess.technology,
        session_title: newSess.sessionTitle,
        date: newSess.date,
        time: newSess.time,
        meeting_link: newSess.meetingLink,
        instructor: newSess.instructor,
        description: newSess.description
      }]);
    } catch (err) {
      console.warn('Live session insert handled:', err);
    }
  };

  const updateLiveSession = async (id, updatedFields) => {
    setLiveSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    logActivity(`Updated live session meeting details for ID ${id}`, 'session');

    const dbFields = {};
    if (updatedFields.programName !== undefined) dbFields.program_name = updatedFields.programName;
    if (updatedFields.technology !== undefined) dbFields.technology = updatedFields.technology;
    if (updatedFields.sessionTitle !== undefined) dbFields.session_title = updatedFields.sessionTitle;
    if (updatedFields.date !== undefined) dbFields.date = updatedFields.date;
    if (updatedFields.time !== undefined) dbFields.time = updatedFields.time;
    if (updatedFields.meetingLink !== undefined) dbFields.meeting_link = updatedFields.meetingLink;
    if (updatedFields.instructor !== undefined) dbFields.instructor = updatedFields.instructor;
    if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;

    try {
      const { error } = await supabase.from('live_sessions').update(dbFields).eq('id', id);
      if (error) console.error('Supabase live session update error:', error.message);
    } catch (err) {
      console.warn('Live session update handled:', err);
    }
  };

  const deleteLiveSession = async (id) => {
    const s = liveSessions.find((item) => item.id === id);
    setLiveSessions((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Cancelled live session: "${s?.sessionTitle || id}"`, 'session');

    try {
      await supabase.from('live_sessions').delete().eq('id', id);
    } catch (err) {
      console.warn('Live session delete handled:', err);
    }
  };

  // --- JOBS (IN INDIAN RUPEES ₹) ---
  const addJob = async (jobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      publishStatus: 'Live Feed',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      ...jobData
    };
    setJobs((prev) => [newJob, ...prev]);
    logActivity(`Posted job opening for ${newJob.company}: "${newJob.jobTitle}"`, 'job');

    try {
      await supabase.from('jobs').upsert([{
        id: newJob.id,
        company: newJob.company,
        job_title: newJob.jobTitle,
        job_type: newJob.jobType,
        salary: newJob.salary,
        location: newJob.location,
        logo: newJob.logo,
        description: newJob.description
      }]);
    } catch (err) {
      console.warn('Job insert handled:', err);
    }
  };

  const updateJob = async (id, updatedFields) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updatedFields } : j))
    );
    logActivity(`Updated job listing ID ${id}`, 'job');

    const dbFields = {};
    if (updatedFields.company !== undefined) dbFields.company = updatedFields.company;
    if (updatedFields.jobTitle !== undefined) dbFields.job_title = updatedFields.jobTitle;
    if (updatedFields.jobType !== undefined) dbFields.job_type = updatedFields.jobType;
    if (updatedFields.salary !== undefined) dbFields.salary = updatedFields.salary;
    if (updatedFields.location !== undefined) dbFields.location = updatedFields.location;
    if (updatedFields.logo !== undefined) dbFields.logo = updatedFields.logo;
    if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;

    try {
      const { error } = await supabase.from('jobs').update(dbFields).eq('id', id);
      if (error) console.error('Supabase job update error:', error.message);
    } catch (err) {
      console.warn('Job update handled:', err);
    }
  };

  const deleteJob = async (id) => {
    const j = jobs.find((item) => item.id === id);
    setJobs((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed job opening for ${j?.company || id}`, 'job');

    try {
      await supabase.from('jobs').delete().eq('id', id);
    } catch (err) {
      console.warn('Job delete handled:', err);
    }
  };

  // --- RECORDINGS ---
  const addRecording = async (recData) => {
    const newRec = {
      id: `rec-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      publishStatus: 'Available in Student Library',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=80',
      ...recData
    };
    setRecordings((prev) => [newRec, ...prev]);
    logActivity(`Uploaded lecture video: "${newRec.title}"`, 'library');

    try {
      await supabase.from('recordings').upsert([{
        id: newRec.id,
        title: newRec.title,
        concept_name: newRec.conceptName,
        duration: newRec.duration,
        instructor: newRec.instructor,
        video_url: newRec.videoUrl,
        thumbnail: newRec.thumbnail,
        description: newRec.description,
        instructions: newRec.instructions
      }]);
    } catch (err) {
      console.warn('Recording insert handled:', err);
    }
  };

  const updateRecording = async (id, updatedFields) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );
    logActivity(`Updated lecture recording ID ${id}`, 'library');

    const dbFields = {};
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.conceptName !== undefined) dbFields.concept_name = updatedFields.conceptName;
    if (updatedFields.duration !== undefined) dbFields.duration = updatedFields.duration;
    if (updatedFields.instructor !== undefined) dbFields.instructor = updatedFields.instructor;
    if (updatedFields.videoUrl !== undefined) dbFields.video_url = updatedFields.videoUrl;
    if (updatedFields.thumbnail !== undefined) dbFields.thumbnail = updatedFields.thumbnail;
    if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
    if (updatedFields.instructions !== undefined) dbFields.instructions = updatedFields.instructions;

    try {
      const { error } = await supabase.from('recordings').update(dbFields).eq('id', id);
      if (error) console.error('Supabase recording update error:', error.message);
    } catch (err) {
      console.warn('Recording update handled:', err);
    }
  };

  const deleteRecording = async (id) => {
    const r = recordings.find((item) => item.id === id);
    setRecordings((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed video recording: "${r?.title || id}"`, 'library');

    try {
      await supabase.from('recordings').delete().eq('id', id);
    } catch (err) {
      console.warn('Recording delete handled:', err);
    }
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
  const addProject = async (projectData) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      assignedCount: 0,
      submittedCount: 0,
      feedbackCount: 0,
      avgGrade: 0,
      status: 'Published',
      submissions: [],
      ...projectData
    };
    setProjects((prev) => [newProject, ...prev]);
    logActivity(`Published new project: "${newProject.title}"`, 'project');

    try {
      await supabase.from('projects').upsert([{
        id: newProject.id,
        title: newProject.title,
        type: newProject.type || 'Mini',
        category: newProject.category,
        difficulty: newProject.difficulty,
        description: newProject.description,
        tech_stack: newProject.techStack,
        due_date: newProject.dueDate,
        status: newProject.status,
        template_url: newProject.templateUrl
      }]);
    } catch (err) {
      console.warn('Project insert handled:', err);
    }
  };

  const updateProject = async (id, updatedFields) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    logActivity(`Updated project listing ID ${id}`, 'project');

    try {
      await supabase.from('projects').update(updatedFields).eq('id', id);
    } catch (err) {
      console.warn('Project update handled:', err);
    }
  };

  const deleteProject = async (id) => {
    const p = projects.find((item) => item.id === id);
    setProjects((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Deleted project: "${p?.title || id}"`, 'project');

    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Project delete handled:', err);
    }
  };

  const gradeSubmission = async (projectId, submissionId, grade, feedback) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedSubmissions = p.submissions.map((sub) =>
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
    );
    logActivity(`Graded submission ${submissionId} for project ${projectId}`, 'project');
  };

  // --- CODING QUESTIONS BANK ---
  const addCodingQuestion = async (cqData) => {
    const newCq = {
      id: `cq-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      postedBy: 'Admin Portal',
      ...cqData
    };
    const updated = [newCq, ...codingQuestions];
    setCodingQuestions(updated);
    localStorage.setItem('aspire_lms_coding_questions', JSON.stringify(updated));
    logActivity(`Posted new coding question: "${newCq.title}" (${newCq.difficulty})`, 'coding');

    try {
      await supabase.from('coding_questions').upsert([{
        id: newCq.id,
        title: newCq.title,
        category: newCq.category,
        difficulty: newCq.difficulty,
        marks: newCq.marks,
        language: newCq.language,
        problem_statement: newCq.problemStatement,
        starter_code: newCq.starterCode,
        solution_code: newCq.solutionCode,
        created_date: newCq.createdDate
      }]);
    } catch (err) {
      console.warn('Supabase coding question insert notice:', err);
    }
  };

  const updateCodingQuestion = async (id, updatedFields) => {
    setCodingQuestions((prev) => {
      const updated = prev.map((cq) => (cq.id === id ? { ...cq, ...updatedFields } : cq));
      localStorage.setItem('aspire_lms_coding_questions', JSON.stringify(updated));
      return updated;
    });
    logActivity(`Updated coding question ID ${id}`, 'coding');
  };

  const deleteCodingQuestion = async (id) => {
    const cq = codingQuestions.find((q) => q.id === id);
    setCodingQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      localStorage.setItem('aspire_lms_coding_questions', JSON.stringify(updated));
      return updated;
    });
    logActivity(`Deleted coding question: "${cq?.title || id}"`, 'coding');
  };

  // Milestones Dynamic Management Functions
  const addStage = (newStageData) => {
    setMilestones((prev) => {
      const newStage = {
        id: `stage-${Date.now()}`,
        stageNumber: newStageData.stageNumber || `STAGE 0${prev.stages.length + 1}`,
        phaseTag: newStageData.phaseTag || 'Phase Mastery',
        title: newStageData.title || 'New Milestone Stage',
        status: newStageData.status || 'AVAILABLE',
        statusType: newStageData.statusType || 'available',
        isLocked: newStageData.isLocked || false,
        subtopics: newStageData.subtopics || []
      };
      return {
        ...prev,
        stages: [...prev.stages, newStage]
      };
    });
  };

  const updateStage = (stageId, updatedData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => (stg.id === stageId ? { ...stg, ...updatedData } : stg))
    }));
  };

  const deleteStage = (stageId) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.filter((stg) => stg.id !== stageId)
    }));
  };

  const addSubtopic = (stageId, newSubtopicData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        const newSub = {
          id: `subtopic-${Date.now()}`,
          title: newSubtopicData.title || 'New Subtopic',
          description: newSubtopicData.description || 'Click to view subtopics',
          duration: newSubtopicData.duration || 'Topic overview description.',
          modulesCount: 0,
          modules: []
        };
        return {
          ...stg,
          subtopics: [...stg.subtopics, newSub]
        };
      })
    }));
  };

  const updateSubtopic = (stageId, subtopicId, updatedData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => (sub.id === subtopicId ? { ...sub, ...updatedData } : sub))
        };
      })
    }));
  };

  const deleteSubtopic = (stageId, subtopicId) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.filter((sub) => sub.id !== subtopicId)
        };
      })
    }));
  };

  const addModule = (stageId, subtopicId, newModuleData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            const newMod = {
              id: `mod-${Date.now()}`,
              title: newModuleData.title || 'New Module',
              items: []
            };
            const updatedMods = [...sub.modules, newMod];
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

  const updateModule = (stageId, subtopicId, moduleId, updatedData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            return {
              ...sub,
              modules: sub.modules.map((mod) => (mod.id === moduleId ? { ...mod, ...updatedData } : mod))
            };
          })
        };
      })
    }));
  };

  const deleteModule = (stageId, subtopicId, moduleId) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            const updatedMods = sub.modules.filter((mod) => mod.id !== moduleId);
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

  const addLearningItem = (stageId, subtopicId, moduleId, newItemData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            return {
              ...sub,
              modules: sub.modules.map((mod) => {
                if (mod.id !== moduleId) return mod;
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
                  items: [...mod.items, newItem]
                };
              })
            };
          })
        };
      })
    }));
  };

  const updateLearningItem = (stageId, subtopicId, moduleId, itemId, updatedData) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            return {
              ...sub,
              modules: sub.modules.map((mod) => {
                if (mod.id !== moduleId) return mod;
                return {
                  ...mod,
                  items: mod.items.map((itm) => (itm.id === itemId ? { ...itm, ...updatedData } : itm))
                };
              })
            };
          })
        };
      })
    }));
  };

  const deleteLearningItem = (stageId, subtopicId, moduleId, itemId) => {
    setMilestones((prev) => ({
      ...prev,
      stages: prev.stages.map((stg) => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          subtopics: stg.subtopics.map((sub) => {
            if (sub.id !== subtopicId) return sub;
            return {
              ...sub,
              modules: sub.modules.map((mod) => {
                if (mod.id !== moduleId) return mod;
                return {
                  ...mod,
                  items: mod.items.filter((itm) => itm.id !== itemId)
                };
              })
            };
          })
        };
      })
    }));
  };

  const updateMilestonesOverview = (updatedOverview) => {
    setMilestones((prev) => ({
      ...prev,
      overview: { ...prev.overview, ...updatedOverview }
    }));
  };

  return (
    <LmsDataContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
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
        jobs,
        addJob,
        updateJob,
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
        milestones,
        addStage,
        updateStage,
        deleteStage,
        addSubtopic,
        updateSubtopic,
        deleteSubtopic,
        addModule,
        updateModule,
        deleteModule,
        addLearningItem,
        updateLearningItem,
        deleteLearningItem,
        updateMilestonesOverview,
        gradeSubmission,
        activities,
        isSupabaseConnected
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
  projects: [],
  codingQuestions: [],
  activities: [],
  isSupabaseConnected: false,
  addCourse: async () => {},
  updateCourse: async () => {},
  deleteCourse: async () => {},
  addScheduleTopic: async () => {},
  updateScheduleTopic: async () => {},
  deleteScheduleTopic: async () => {},
  addLiveSession: async () => {},
  updateLiveSession: async () => {},
  deleteLiveSession: async () => {},
  addJob: async () => {},
  updateJob: async () => {},
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
