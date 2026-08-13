import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, INITIAL_USERS } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient';

const defaultAuthContext = {
  currentUser: null,
  currentRole: null,
  isSuperAdmin: false,
  isAuthenticated: false,
  registeredUsers: [],
  register: async () => ({ success: false, message: 'Auth provider not ready' }),
  login: () => ({ success: false, message: 'Auth provider not ready' }),
  logout: () => {},
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
        return {
          ...parsed,
          originalRole: parsed.originalRole || parsed.role
        };
      } catch (e) {
        return null;
      }
    }
    return null; // Default to unauthenticated so Login page opens first
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('aspire_lms_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return currentUser?.role || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aspire_lms_user', JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('aspire_lms_user');
      setCurrentRole(null);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aspire_lms_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: emailClean,
      password: password,
      role: role,
      originalRole: role,
      department: department || 'General Staff',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: '+91 98765-43210',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    const updatedList = [...registeredUsers, newUser];
    setRegisteredUsers(updatedList);
    localStorage.setItem('aspire_lms_registered_users', JSON.stringify(updatedList));

    // Try syncing profile to Supabase if accessible
    try {
      await supabase.from('profiles').insert([{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: newUser.status
      }]);
    } catch (err) {
      console.warn('Supabase profile registration sync notice:', err);
    }

    return { success: true, user: newUser };
  };

  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }

    const emailClean = email.trim().toLowerCase();

    // 1. Check in registered users list
    const foundRegistered = registeredUsers.find(
      (u) => u.email.toLowerCase() === emailClean
    );

    if (foundRegistered) {
      if (foundRegistered.password && foundRegistered.password !== password) {
        return { success: false, message: 'Invalid credentials. Password incorrect.' };
      }
      const userWithOriginalRole = {
        ...foundRegistered,
        originalRole: foundRegistered.role
      };
      setCurrentUser(userWithOriginalRole);
      setCurrentRole(foundRegistered.role);
      return { success: true, user: userWithOriginalRole };
    }

    // 2. Check in pre-seeded initial system users (e.g., Super Admin)
    // Passwords for INITIAL_USERS are NOT hardcoded in source code.
    // Validated against VITE_ADMIN_PASSWORD env var (default: 'password@123').
    // In production, set VITE_ADMIN_PASSWORD in your Vercel environment variables.
    const foundInitial = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === emailClean
    );

    if (foundInitial) {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password@123';
      if (password !== adminPassword) {
        return { success: false, message: 'Invalid credentials. Password incorrect.' };
      }
      const userWithOriginalRole = {
        ...foundInitial,
        originalRole: foundInitial.role,
        phone: foundInitial.phone || '+91 98765-43210'
      };
      setCurrentUser(userWithOriginalRole);
      setCurrentRole(foundInitial.role);
      return { success: true, user: userWithOriginalRole };
    }

    return { success: false, message: 'Invalid email or password. Please check your credentials or register.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem('aspire_lms_user');
  };

  const isSuperAdmin =
    currentUser?.originalRole === ROLES.SUPER_ADMIN ||
    currentUser?.email?.toLowerCase() === 'aspireadmin@gmail.com';

  const switchRole = (newRole) => {
    if (currentUser && isSuperAdmin) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      setCurrentRole(newRole);
    }
  };

  const updateUserProfile = async (updatedFields) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedFields };
      setCurrentUser(updated);
      localStorage.setItem('aspire_lms_user', JSON.stringify(updated));

      try {
        await supabase.from('profiles').update({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          department: updated.department,
          avatar: updated.avatar
        }).eq('id', updated.id);
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
