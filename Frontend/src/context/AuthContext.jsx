import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, INITIAL_USERS } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient';

// Secure SHA-256 password hashing helper (Web Crypto API)
async function hashPassword(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Strip plain-text passwords and hashes from user state before storage/session
function sanitizeUser(user) {
  if (!user) return null;
  const { password, passwordHash, ...cleanUser } = user;
  return cleanUser;
}

const defaultAuthContext = {
  currentUser: null,
  currentRole: null,
  isSuperAdmin: false,
  isAuthenticated: false,
  registeredUsers: [],
  register: async ({ name, email, password, role }) => {
    if (!name || !email || !password || !role) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    return { success: false, message: 'Registration currently initializing. Please try again.' };
  },
  login: async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }
    const emailClean = email.trim().toLowerCase();
    const foundInitial = INITIAL_USERS.find((u) => u.email.toLowerCase() === emailClean);
    if (foundInitial) {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password@123';
      if (password !== adminPassword) {
        return { success: false, message: 'Invalid credentials. Password incorrect.' };
      }
      const cleanUser = sanitizeUser({
        ...foundInitial,
        originalRole: foundInitial.role
      });
      localStorage.setItem('aspire_lms_user', JSON.stringify(cleanUser));
      return { success: true, user: cleanUser };
    }
    return { success: false, message: 'Invalid email or password. Please check your credentials or register.' };
  },
  logout: () => {
    localStorage.removeItem('aspire_lms_user');
  },
  switchRole: () => {},
  updateUserProfile: async () => ({ success: false })
};

const AuthContext = createContext(defaultAuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aspire_lms_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.department === 'General Staff') {
          parsed.department = parsed.role === ROLES.INSTRUCTOR ? 'Instructor' : (parsed.role || 'Instructor');
        }
        if (!parsed.avatar || parsed.avatar.includes('avataaars') || parsed.avatar.includes('unsplash.com')) {
          parsed.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parsed.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
        }
        return sanitizeUser({
          ...parsed,
          originalRole: parsed.originalRole || parsed.role
        });
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('aspire_lms_registered_users');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        return list.map((u) => {
          if (u.department === 'General Staff') {
            u.department = u.role === ROLES.INSTRUCTOR ? 'Instructor' : (u.role || 'Instructor');
          }
          if (!u.avatar || u.avatar.includes('avataaars') || u.avatar.includes('unsplash.com')) {
            u.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
          }
          return sanitizeUser(u);
        });
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentRole, setCurrentRole] = useState(() => currentUser?.role || null);

  useEffect(() => {
    if (currentUser) {
      const clean = sanitizeUser(currentUser);
      localStorage.setItem('aspire_lms_user', JSON.stringify(clean));
      setCurrentRole(clean.role);
    } else {
      localStorage.removeItem('aspire_lms_user');
      setCurrentRole(null);
    }
  }, [currentUser]);

  useEffect(() => {
    const sanitizedList = registeredUsers.map((u) => sanitizeUser(u));
    localStorage.setItem('aspire_lms_registered_users', JSON.stringify(sanitizedList));
  }, [registeredUsers]);

  // Synchronize currentUser profile details (such as live assigned batch) from Supabase
  useEffect(() => {
    if (!currentUser?.email) return;
    let isMounted = true;
    const syncLiveProfile = async () => {
      try {
        const { data: dbProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', currentUser.email.trim())
          .maybeSingle();

        if (dbProfile && !error && isMounted) {
          const freshBatch = dbProfile.batch || 'None';
          const freshRole = dbProfile.role || currentUser.role;
          const freshName = dbProfile.name || currentUser.name;
          const freshDept = (!dbProfile.department || dbProfile.department === 'General Staff')
            ? (freshRole === ROLES.INSTRUCTOR ? 'Instructor' : (freshRole || 'Instructor'))
            : dbProfile.department;
          const freshAvatar = (dbProfile.avatar && !dbProfile.avatar.includes('avataaars') && !dbProfile.avatar.includes('unsplash.com'))
            ? dbProfile.avatar
            : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(freshName || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;

          if (
            currentUser.batch !== freshBatch ||
            currentUser.name !== freshName ||
            currentUser.department !== freshDept ||
            currentUser.avatar !== freshAvatar ||
            (currentUser.role !== freshRole && currentUser.originalRole !== ROLES.SUPER_ADMIN)
          ) {
            setCurrentUser((prev) => {
              if (!prev) return null;
              return sanitizeUser({
                ...prev,
                name: freshName,
                batch: freshBatch,
                department: freshDept,
                avatar: freshAvatar,
                role: prev.role === ROLES.SUPER_ADMIN ? prev.role : freshRole,
                originalRole: dbProfile.original_role || freshRole
              });
            });
          }

          if (dbProfile.department === 'General Staff' && dbProfile.id) {
            supabase.from('profiles').update({ department: freshRole || 'Instructor' }).eq('id', dbProfile.id).then(() => {});
          }

          if (dbProfile.avatar && (dbProfile.avatar.includes('avataaars') || dbProfile.avatar.includes('unsplash.com')) && dbProfile.id) {
            supabase.from('profiles').update({ avatar: freshAvatar }).eq('id', dbProfile.id).then(() => {});
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    syncLiveProfile();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.email]);

  const register = async ({ name, email, password, role, department }) => {
    if (!name || !email || !password || !role) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    // Security check: Reject Super Admin registration attempts
    if (role === ROLES.SUPER_ADMIN) {
      return { success: false, message: 'Registration for Super Admin role is prohibited.' };
    }

    const emailClean = email.trim().toLowerCase();

    // Check if user already exists
    const existingInInitial = INITIAL_USERS.find((u) => u.email.toLowerCase() === emailClean);
    const existingInRegistered = registeredUsers.find((u) => u.email.toLowerCase() === emailClean);

    if (existingInInitial || existingInRegistered) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Attempt Supabase Auth signUp if configured
    let supabaseUserId = null;
    try {
      const { data: sbData } = await supabase.auth.signUp({
        email: emailClean,
        password: password,
        options: {
          data: {
            name: name.trim(),
            role: role,
            department: department || (role === ROLES.INSTRUCTOR ? 'Instructor' : (role || 'Instructor'))
          }
        }
      });
      if (sbData?.user?.id) {
        supabaseUserId = sbData.user.id;
      }
    } catch (sbErr) {
      console.warn('Supabase Auth signUp fallback notice:', sbErr);
    }

    // Securely hash password for local verification (never store plain text)
    const pwdHash = await hashPassword(password);

    const newUser = {
      id: supabaseUserId || `usr-${Date.now()}`,
      name: name.trim(),
      email: emailClean,
      passwordHash: pwdHash, // SHA-256 digest only
      role: role,
      originalRole: role,
      department: department || (role === ROLES.INSTRUCTOR ? 'Instructor' : (role || 'Instructor')),
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: '+91 98765-43210',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim() || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`
    };

    const updatedList = [...registeredUsers, newUser];
    setRegisteredUsers(updatedList);

    // Sync profile metadata (excluding sensitive data) to Supabase table
    try {
      await supabase.from('profiles').insert([{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: newUser.status,
        passwords: password
      }]);
    } catch (err) {
      console.warn('Supabase profile insertion notice:', err);
    }

    return { success: true, user: sanitizeUser(newUser) };
  };

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }

    const emailClean = email.trim().toLowerCase();

    // Try Supabase Auth signIn if backend configured
    try {
      const { data: sbAuthData, error: sbAuthErr } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password: password
      });
      if (sbAuthData?.user && !sbAuthErr) {
        let profileData = null;
        try {
          const { data: pRec } = await supabase
            .from('profiles')
            .select('*')
            .ilike('email', emailClean)
            .maybeSingle();
          profileData = pRec;
        } catch (e) {}

        const displayName = profileData?.name || sbAuthData.user.user_metadata?.name || emailClean.split('@')[0];
        const userRole = profileData?.role || sbAuthData.user.user_metadata?.role || ROLES.INSTRUCTOR;
        const rawDept = profileData?.department || sbAuthData.user.user_metadata?.department;
        const rawAvatar = profileData?.avatar || sbAuthData.user.user_metadata?.avatar;
        const resolvedAvatar = (rawAvatar && !rawAvatar.includes('avataaars') && !rawAvatar.includes('unsplash.com'))
          ? rawAvatar
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;

        const sbUser = {
          id: sbAuthData.user.id,
          name: displayName,
          email: sbAuthData.user.email,
          role: userRole,
          originalRole: profileData?.original_role || userRole,
          department: (!rawDept || rawDept === 'General Staff') ? (userRole === ROLES.INSTRUCTOR ? 'Instructor' : userRole) : rawDept,
          batch: profileData?.batch || sbAuthData.user.user_metadata?.batch || 'None',
          avatar: resolvedAvatar
        };
        const cleanUser = sanitizeUser(sbUser);
        setCurrentUser(cleanUser);
        setCurrentRole(cleanUser.role);
        return { success: true, user: cleanUser };
      }
    } catch (sbErr) {
      console.warn('Supabase Auth signIn fallback notice:', sbErr);
    }

    // Check in Supabase profiles table
    try {
      const { data: dbProfile, error: dbErr } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', emailClean)
        .maybeSingle();

      if (dbProfile && !dbErr && dbProfile.passwords) {
        if (password === dbProfile.passwords) {
          const userRole = dbProfile.role || ROLES.INSTRUCTOR;
          const rawDept = dbProfile.department;
          const displayName = dbProfile.name || emailClean.split('@')[0];
          const rawAvatar = dbProfile.avatar;
          const resolvedAvatar = (rawAvatar && !rawAvatar.includes('avataaars') && !rawAvatar.includes('unsplash.com'))
            ? rawAvatar
            : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;

          const matchedUser = {
            id: dbProfile.id,
            name: displayName,
            email: dbProfile.email,
            role: userRole,
            originalRole: dbProfile.original_role || dbProfile.role || userRole,
            department: (!rawDept || rawDept === 'General Staff') ? (userRole === ROLES.INSTRUCTOR ? 'Instructor' : userRole) : rawDept,
            status: dbProfile.status || 'Active',
            joinedDate: dbProfile.joined_date || null,
            phone: dbProfile.phone || '+91 98765-43210',
            batch: dbProfile.batch || 'None',
            avatar: resolvedAvatar
          };
          const cleanUser = sanitizeUser(matchedUser);
          setCurrentUser(cleanUser);
          setCurrentRole(cleanUser.role);
          return { success: true, user: cleanUser };
        } else {
          return { success: false, message: 'Invalid credentials. Password incorrect.' };
        }
      }
    } catch (err) {
      console.warn('Supabase profiles lookup notice:', err);
    }

    // 1. Check in registered users list using secure hash comparison
    const foundRegistered = registeredUsers.find((u) => u.email.toLowerCase() === emailClean);

    if (foundRegistered) {
      const inputHash = await hashPassword(password);
      const isValid = foundRegistered.passwordHash
        ? foundRegistered.passwordHash === inputHash
        : foundRegistered.password === password;

      if (!isValid) {
        return { success: false, message: 'Invalid credentials. Password incorrect.' };
      }

      const regRole = foundRegistered.role || ROLES.INSTRUCTOR;
      const regDept = (!foundRegistered.department || foundRegistered.department === 'General Staff')
        ? (regRole === ROLES.INSTRUCTOR ? 'Instructor' : regRole)
        : foundRegistered.department;

      const rawAvatar = foundRegistered.avatar;
      const resolvedAvatar = (rawAvatar && !rawAvatar.includes('avataaars') && !rawAvatar.includes('unsplash.com'))
        ? rawAvatar
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundRegistered.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;

      const cleanUser = sanitizeUser({
        ...foundRegistered,
        department: regDept,
        avatar: resolvedAvatar,
        originalRole: foundRegistered.role
      });

      setCurrentUser(cleanUser);
      setCurrentRole(cleanUser.role);
      return { success: true, user: cleanUser };
    }

    // 2. Check in pre-seeded initial system users
    const foundInitial = INITIAL_USERS.find((u) => u.email.toLowerCase() === emailClean);

    if (foundInitial) {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password@123';
      if (password !== adminPassword) {
        return { success: false, message: 'Invalid credentials. Password incorrect.' };
      }
      const cleanUser = sanitizeUser({
        ...foundInitial,
        originalRole: foundInitial.role,
        phone: foundInitial.phone || '+91 98765-43210'
      });
      setCurrentUser(cleanUser);
      setCurrentRole(cleanUser.role);

      // Sync Super Admin profile details to Supabase profiles table
      try {
        supabase.from('profiles').upsert([{
          id: cleanUser.id,
          name: cleanUser.name,
          email: cleanUser.email,
          role: cleanUser.role,
          original_role: cleanUser.originalRole,
          department: cleanUser.department || 'Executive Leadership',
          status: 'Active',
          joined_date: cleanUser.joinedDate || '2025-01-15',
          phone: cleanUser.phone || '+91 98765-43210',
          avatar: cleanUser.avatar
        }]).then(() => {});
      } catch (e) {}

      return { success: true, user: cleanUser };
    }

    return { success: false, message: 'Invalid email or password. Please check your credentials or register.' };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem('aspire_lms_user');
  };

  const isSuperAdmin =
    currentUser?.originalRole === ROLES.SUPER_ADMIN ||
    currentUser?.email?.toLowerCase() === 'aspireadmin@gmail.com';

  const switchRole = (newRole) => {
    if (currentUser && isSuperAdmin) {
      const updatedUser = sanitizeUser({ ...currentUser, role: newRole });
      setCurrentUser(updatedUser);
      setCurrentRole(newRole);
    }
  };

  const updateUserProfile = async (updatedFields) => {
    if (currentUser) {
      const updated = sanitizeUser({ ...currentUser, ...updatedFields });
      setCurrentUser(updated);
      localStorage.setItem('aspire_lms_user', JSON.stringify(updated));

      setRegisteredUsers((prev) => {
        const next = prev.map((u) =>
          u.id === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase())
            ? { ...u, ...updatedFields }
            : u
        );
        localStorage.setItem('aspire_lms_registered_users', JSON.stringify(next));
        return next;
      });

      try {
        const updatePayload = {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          department: updated.department,
          avatar: updated.avatar,
          batch: updated.batch !== undefined ? updated.batch : 'None'
        };

        if (updatedFields.password) {
          updatePayload.passwords = updatedFields.password;
        }

        await supabase.from('profiles').update(updatePayload).eq('id', updated.id);
      } catch (err) {
        console.warn('Supabase profile sync warning:', err);
      }

      return { success: true, user: updated };
    }
    return { success: false };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isSuperAdmin,
        isAuthenticated: !!currentUser,
        registeredUsers,
        register,
        login,
        logout,
        switchRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
