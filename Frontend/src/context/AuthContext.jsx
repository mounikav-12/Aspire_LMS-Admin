import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, INITIAL_USERS } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

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

  const login = (email, password) => {
    const foundUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (foundUser) {
      const userWithOriginalRole = {
        ...foundUser,
        originalRole: foundUser.role,
        phone: foundUser.phone || '+1 (555) 234-5678'
      };
      setCurrentUser(userWithOriginalRole);
      setCurrentRole(foundUser.role);
      return { success: true, user: userWithOriginalRole };
    }

    const demoUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      role: ROLES.SUPER_ADMIN,
      originalRole: ROLES.SUPER_ADMIN,
      department: 'Technology',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setCurrentUser(demoUser);
    setCurrentRole(demoUser.role);
    return { success: true, user: demoUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem('aspire_lms_user');
  };

  const isSuperAdmin =
    currentUser?.originalRole === ROLES.SUPER_ADMIN ||
    currentUser?.email === 'sarah.admin@aspirelms.io';

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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
