import React, { useState, useRef, useEffect } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ROLES } from '../../utils/mockData';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Building2,
  Shield,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  CheckSquare,
  Square,
  X
} from 'lucide-react';

function getInitialAvatar(name = 'User') {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=2563eb&textColor=ffffff&bold=true`;
}

export function parseUserBatches(user) {
  if (!user) return [];
  if (Array.isArray(user.batches) && user.batches.length > 0) {
    return user.batches.filter((b) => b && b !== 'None' && b !== 'none' && b !== 'Not Assigned');
  }
  if (Array.isArray(user.batch) && user.batch.length > 0) {
    return user.batch.filter((b) => b && b !== 'None' && b !== 'none' && b !== 'Not Assigned');
  }
  const raw = user.batch || user.batches;
  if (typeof raw === 'string' && raw.trim() && raw !== 'None' && raw !== 'none' && raw !== 'Not Assigned') {
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((b) => b && b !== 'None' && b !== 'none');
      } catch (e) {}
    }
    return raw.split(',').map((s) => s.trim()).filter((b) => b && b !== 'None' && b !== 'none');
  }
  return [];
}

export function UserManagementPage() {
  const { users = [], addUser, updateUser, deleteUser, availableBatches = [] } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
  const batchDropdownRef = useRef(null);

  // Close batch multi-select dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target)) {
        setIsBatchDropdownOpen(false);
      }
    }
    if (isBatchDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isBatchDropdownOpen]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.INSTRUCTOR,
    department: '',
    phone: '',
    avatar: '',
    batches: []
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: ROLES.INSTRUCTOR,
      department: '',
      phone: '',
      avatar: '',
      batches: []
    });
    setIsBatchDropdownOpen(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || ROLES.INSTRUCTOR,
      department: user.department || '',
      phone: user.phone || '',
      avatar: (user.avatar && !user.avatar.includes('unsplash.com')) ? user.avatar : '',
      batches: parseUserBatches(user)
    });
    setIsBatchDropdownOpen(false);
  };

  const handleToggleBatch = (batchCode) => {
    setFormData((prev) => {
      const current = prev.batches || [];
      if (current.includes(batchCode)) {
        return { ...prev, batches: current.filter((b) => b !== batchCode) };
      } else {
        return { ...prev, batches: [...current, batchCode] };
      }
    });
  };

  const handleSelectNoneBatches = () => {
    setFormData((prev) => ({ ...prev, batches: [] }));
    setIsBatchDropdownOpen(false);
  };

  const handleSelectAllBatches = (batchList) => {
    setFormData((prev) => ({ ...prev, batches: [...batchList] }));
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Please provide user name and email address', 'error');
      return;
    }

    const finalAvatar = (formData.avatar && !formData.avatar.includes('unsplash.com'))
      ? formData.avatar
      : getInitialAvatar(formData.name);

    const safeBatches = Array.isArray(formData.batches)
      ? formData.batches.filter((b) => b && b !== 'None' && b !== 'none')
      : [];

    const payload = {
      ...formData,
      avatar: finalAvatar,
      batches: safeBatches,
      batch: safeBatches.length > 0 ? safeBatches.join(', ') : 'None'
    };

    if (editingUser) {
      updateUser(editingUser.id, payload);
      addToast(`Updated user profile for "${formData.name}"`, 'success');
      setEditingUser(null);
    } else {
      addUser(payload);
      addToast(`Added new staff member: "${formData.name}"`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      addToast(`Removed staff user account for "${deletingUser.name}"`, 'info');
      setDeletingUser(null);
    }
  };

  // All unique batches present across system batches and user assignments
  const allBatchesInUsers = users.flatMap((u) => parseUserBatches(u));
  const uniqueBatchOptions = Array.from(
    new Set([
      ...availableBatches,
      ...allBatchesInUsers
    ])
  ).filter((b) => b && b !== 'None' && b !== 'none').sort();

  // Batch Options for Filter
  const filterBatchOptions = [
    { value: 'ALL', label: 'All Batches' },
    { value: 'None', label: 'Batch: None' },
    ...uniqueBatchOptions.map((b) => ({
      value: b,
      label: `Batch: ${b}`
    }))
  ];

  // Batch Options for Modal Form
  const modalBatchList = Array.from(
    new Set([
      ...availableBatches,
      ...(formData.batches || [])
    ])
  ).filter((b) => b && b !== 'None' && b !== 'none').sort();

  // Defensive Filter Logic for User Directory
  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const department = (u.department || '').toLowerCase();
    const userBatches = parseUserBatches(u);
    const batchesStr = userBatches.join(' ').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    const matchesSearch =
      name.includes(query) ||
      email.includes(query) ||
      department.includes(query) ||
      batchesStr.includes(query) ||
      (userBatches.length === 0 && 'none'.includes(query));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    let matchesBatch = true;
    if (batchFilter === 'None') {
      matchesBatch = userBatches.length === 0;
    } else if (batchFilter !== 'ALL') {
      matchesBatch = userBatches.some(
        (b) => b.toLowerCase() === batchFilter.toLowerCase()
      );
    }

    return matchesSearch && matchesRole && matchesBatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" /> Staff & User Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage administrative credentials, assign staff roles and batches, and audit account access levels.
          </p>
        </div>
        <Button variant="primary" size="md" icon={UserPlus} onClick={handleOpenAddModal}>
          Add New Staff User
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, department, batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: ROLES.SUPER_ADMIN, label: ROLES.SUPER_ADMIN },
              { value: ROLES.ADMIN, label: ROLES.ADMIN },
              { value: ROLES.MANAGER, label: ROLES.MANAGER },
              { value: ROLES.INSTRUCTOR, label: ROLES.INSTRUCTOR }
            ]}
          />
        </div>

        <div className="w-full md:w-52">
          <Select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            options={filterBatchOptions}
          />
        </div>
      </div>

      {/* Staff Table Directory */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4">User Member</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Assigned Batches</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => {
                  const userBatches = parseUserBatches(u);
                  return (
                    <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Member Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={(u.avatar && !u.avatar.includes('unsplash.com')) ? u.avatar : getInitialAvatar(u.name)}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 ring-2 ring-blue-500/10"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-slate-400 font-medium text-xs mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <Badge variant={u.role === ROLES.SUPER_ADMIN ? 'purple' : u.role === ROLES.ADMIN ? 'blue' : 'slate'}>
                          {u.role}
                        </Badge>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {u.department || '—'}
                      </td>

                      {/* Assigned Batches */}
                      <td className="px-6 py-4">
                        {userBatches.length === 0 ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-xl text-slate-500 bg-slate-100/80 border border-slate-200/60 text-xs">
                            None
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5 max-w-[280px]">
                            {userBatches.map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg text-blue-700 bg-blue-50 border border-blue-200/60 text-[11px] shadow-2xs"
                              >
                                <Layers className="w-3 h-3 text-blue-600" />
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-xl border ${u.status === 'Inactive' ? 'text-slate-500 bg-slate-50 border-slate-200/60' : 'text-emerald-700 bg-emerald-50 border-emerald-200/60'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${u.status === 'Inactive' ? 'text-slate-400' : 'text-emerald-600'}`} />
                          {u.status || 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Staff Members Found"
          description="Add your first staff member to assign management permissions."
          actionLabel="Add Staff User"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingUser}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
          setIsBatchDropdownOpen(false);
        }}
        maxWidth="max-w-3xl"
        title={editingUser ? 'Edit Staff User Account' : 'Add New Staff Member'}
        subtitle="Specify staff credentials, role assignment, department, and assigned batches"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="e.g. eleanor@aspirelms.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Staff Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: ROLES.SUPER_ADMIN, label: ROLES.SUPER_ADMIN },
                { value: ROLES.ADMIN, label: ROLES.ADMIN },
                { value: ROLES.MANAGER, label: ROLES.MANAGER },
                { value: ROLES.INSTRUCTOR, label: ROLES.INSTRUCTOR }
              ]}
            />

            {/* Multi-Select Assigned Batches Dropdown */}
            <div className="w-full min-w-0 flex flex-col gap-1.5 relative" ref={batchDropdownRef}>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase truncate">
                  Assigned Batches
                </label>
                {formData.batches && formData.batches.length > 0 && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {formData.batches.length} selected
                  </span>
                )}
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all cursor-pointer shadow-2xs ${
                  isBatchDropdownOpen
                    ? 'border-blue-500 bg-white ring-4 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate text-xs">
                    {(!formData.batches || formData.batches.length === 0)
                      ? 'None (No Batch Assigned)'
                      : formData.batches.length === 1
                      ? `1 Batch (${formData.batches[0]})`
                      : `${formData.batches.length} Batches (${formData.batches.slice(0, 2).join(', ')}${formData.batches.length > 2 ? '...' : ''})`}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isBatchDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isBatchDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in duration-150 max-h-56 overflow-y-auto">
                  {/* None Option */}
                  <div
                    onClick={handleSelectNoneBatches}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors select-none ${
                      !formData.batches || formData.batches.length === 0
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {!formData.batches || formData.batches.length === 0 ? (
                        <CheckSquare className="w-4 h-4 text-slate-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                      <span>None (No Batch Assigned)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Clear</span>
                  </div>

                  <div className="border-t border-slate-100 my-1" />

                  {/* Quick Select All / Deselect All */}
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500 font-bold">
                    <span>Available Batches</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAllBatches(modalBatchList);
                        }}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNoneBatches();
                        }}
                        className="text-slate-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Batch Checkboxes */}
                  {modalBatchList.map((batchCode) => {
                    const isChecked = formData.batches && formData.batches.includes(batchCode);
                    return (
                      <div
                        key={batchCode}
                        onClick={() => handleToggleBatch(batchCode)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors select-none ${
                          isChecked
                            ? 'bg-blue-50/80 text-blue-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span>{batchCode}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {batchCode.startsWith('A26S') || batchCode.startsWith('A26WE') ? 'Weekend' : 'Weekday'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Batches Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(!formData.batches || formData.batches.length === 0) ? (
                  <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg text-slate-500 bg-slate-100/90 border border-slate-200/60 text-[11px]">
                    None Assigned
                  </span>
                ) : (
                  formData.batches.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg text-blue-700 bg-blue-50 border border-blue-200/70 text-[11px] shadow-2xs"
                    >
                      <Layers className="w-3 h-3 text-blue-600" />
                      {b}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBatch(b);
                        }}
                        className="ml-0.5 p-0.5 hover:bg-blue-200/60 rounded text-blue-500 hover:text-blue-800 cursor-pointer"
                        title={`Remove ${b}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department"
              icon={Building2}
              placeholder="e.g. Curriculum Operations"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />

            <Input
              label="Contact Phone Number"
              icon={Phone}
              placeholder="+91 98765-43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Avatar Image URL"
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/photo-xxx"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingUser(null);
                setIsBatchDropdownOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Save User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff Account"
        message={`Are you sure you want to remove staff user account for "${deletingUser?.name}"?`}
        confirmText="Delete User"
      />
    </div>
  );
}
