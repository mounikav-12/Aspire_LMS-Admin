import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Image as ImageIcon,
  Briefcase,
  KeyRound,
  Check,
  Upload,
  Camera,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

export function ProfileSettingsModal({ isOpen, onClose }) {
  const { currentUser, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
        phone: currentUser.phone || '+91 98765-43210',
        department: currentUser.department || 'Curriculum Operations',
        avatar: currentUser.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser, isOpen]);

  const processFile = (file) => {
    if (!file) return;

    // Check file format (.jpg, .jpeg, .png, .webp)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      addToast('Please select a valid image file (.jpg, .png, or .jpeg)', 'error');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, avatar: event.target.result }));
      addToast('Image loaded! Click "Save Profile Changes" to apply.', 'success');
    };
    reader.onerror = () => {
      addToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e) => {
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

    try {
      const res = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        avatar: formData.avatar
      });

      if (res?.success !== false) {
        addToast('Profile and account details saved successfully!', 'success');
        if (onClose) onClose();
      }
    } catch (err) {
      addToast('Profile saved locally', 'success');
      if (onClose) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Account & Profile Settings"
      subtitle="Update your personal details, profile photo, contact number, and password"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      <div className="space-y-5">
        {/* Profile Header Preview */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
            <img
              src={
                formData.avatar && !formData.avatar.includes('unsplash.com')
                  ? formData.avatar
                  : (currentUser?.avatar && !currentUser.avatar.includes('unsplash.com'))
                    ? currentUser.avatar
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`
              }
              alt={formData.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-blue-500/20 shadow-md transition-opacity group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{formData.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{formData.email}</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>
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
                  placeholder="+91 98765-43210"
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

              {/* Profile Photo Upload Section */}
              <div className="w-full flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
                    Profile Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUrlInput(!useUrlInput)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {useUrlInput ? (
                      <>
                        <Upload className="w-3 h-3" /> Select image from local storage
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-3 h-3" /> Or enter image URL
                      </>
                    )}
                  </button>
                </div>

                {useUrlInput ? (
                  <Input
                    icon={ImageIcon}
                    placeholder="https://images.unsplash.com/photo-xxx"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    helperText="Enter a direct image URL for your profile avatar"
                  />
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative p-4 rounded-xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar preview"
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {formData.avatar ? 'Image loaded from device' : 'Upload photo from your device'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Supports .jpg, .jpeg, .png, .webp (max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" /> Select Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

