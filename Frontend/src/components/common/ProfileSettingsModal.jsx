import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, Lock, Image as ImageIcon, Briefcase, KeyRound, Check } from 'lucide-react';

export function ProfileSettingsModal({ isOpen, onClose }) {
  const { currentUser, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '+1 (555) 234-5678',
        department: currentUser.department || 'Curriculum Operations',
        avatar: currentUser.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser, isOpen]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Please fill in your name and email address', 'error');
      return;
    }

    if (activeTab === 'security') {
      if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          addToast('New passwords do not match', 'error');
          return;
        }
        if (formData.newPassword.length < 6) {
          addToast('Password must be at least 6 characters long', 'error');
          return;
        }
      }
    }

    const updated = updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      avatar: formData.avatar
    });

    if (updated.success) {
      addToast('Profile and account details saved successfully!', 'success');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Account & Profile Settings"
      subtitle="Update your personal details, profile photo, contact number, and password"
    >
      <div className="space-y-5">
        {/* Profile Header Preview */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <img
            src={formData.avatar || currentUser?.avatar}
            alt={formData.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-blue-500/20 shadow-md"
          />
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">{formData.name}</h4>
            <p className="text-xs text-slate-500 font-medium">{formData.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase">
              Role: {currentUser?.role}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <User className="w-4 h-4" /> Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <KeyRound className="w-4 h-4" /> Password & Security
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {activeTab === 'profile' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  placeholder="name@aspirelms.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone / Contact Number"
                  icon={Phone}
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <Input
                  label="Department"
                  icon={Briefcase}
                  placeholder="e.g. Curriculum Operations"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <Input
                label="Profile Photo URL"
                icon={ImageIcon}
                placeholder="https://images.unsplash.com/photo-xxx"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                helperText="Enter a direct image URL for your profile avatar"
              />
            </>
          ) : (
            <>
              <Input
                label="Current Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />

                <Input
                  label="Confirm New Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
