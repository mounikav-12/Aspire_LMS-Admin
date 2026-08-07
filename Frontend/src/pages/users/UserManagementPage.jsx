import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';

export function UserManagementPage() {
  const { users = [], addUser, updateUser, deleteUser } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.INSTRUCTOR,
    department: 'Curriculum Operations',
    phone: '+91 98765-43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: ROLES.INSTRUCTOR,
      department: 'Curriculum Operations',
      phone: '+91 98765-43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || ROLES.INSTRUCTOR,
      department: user.department || 'Curriculum Operations',
      phone: user.phone || '+91 98765-43210',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Please provide user name and email address', 'error');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
      addToast(`Updated user profile for "${formData.name}"`, 'success');
      setEditingUser(null);
    } else {
      addUser(formData);
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

  // Defensive Filter Logic for User Directory
  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const department = (u.department || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query) || department.includes(query);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
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
            Manage administrative credentials, assign staff roles, and audit account access levels.
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
            placeholder="Search users by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-56">
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Member Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
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
                      {u.department || 'Curriculum Operations'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
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
                ))}
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
        }}
        title={editingUser ? 'Edit Staff User Account' : 'Add New Staff Member'}
        subtitle="Specify staff credentials, role assignment, and department placement"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
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

            <Input
              label="Department"
              icon={Building2}
              placeholder="e.g. Curriculum Operations"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Phone Number"
              icon={Phone}
              placeholder="+91 98765-43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Avatar Image URL"
              icon={ImageIcon}
              placeholder="https://images.unsplash.com/photo-xxx"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingUser(null);
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
