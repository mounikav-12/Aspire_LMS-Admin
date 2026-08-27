import React from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { ROLES, PERMISSION_LIST } from '../../utils/mockData';
import { ShieldAlert, ShieldCheck, Check } from 'lucide-react';

export function PermissionManagementPage() {
  // rolePermissions comes from Supabase `role_permissions` table via LmsDataContext (database-driven).
  // PERMISSION_LIST is a static schema of available permission keys — it defines which rows appear in the matrix.
  // The enabled/disabled toggle state per role is fully database-driven via rolePermissions.
  const { rolePermissions, toggleRolePermission } = useLmsData();
  const { addToast } = useToast();

  const handleToggle = (role, permId) => {
    if (role === ROLES.SUPER_ADMIN) {
      addToast('Super Admin role retains full uneditable system permissions.', 'info');
      return;
    }
    // Silent toggle without toast popup
    toggleRolePermission(role, permId);
  };

  const rolesList = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.INSTRUCTOR];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-blue-600" /> Staff Role Permissions Matrix
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Configure fine-grained access control policies for Super Admin, Admin, Manager, and Instructor staff roles.
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="px-6 py-4">Permission Module</th>
                <th className="px-6 py-4">Category</th>
                {rolesList.map((role) => (
                  <th key={role} className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-900 font-extrabold text-xs">{role}</span>
                      <span className="text-[10px] text-blue-600 font-bold lowercase">
                        {(rolePermissions[role] || []).length} perms
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {PERMISSION_LIST.map((perm) => (
                <tr key={perm.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 font-extrabold text-slate-800">{perm.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant="blue">{perm.category}</Badge>
                  </td>

                  {rolesList.map((role) => {
                    const isChecked = (rolePermissions[role] || []).includes(perm.id);
                    const isSuperAdmin = role === ROLES.SUPER_ADMIN;

                    return (
                      <td key={role} className="px-6 py-4 text-center">
                        <button
                          type="button"
                          disabled={isSuperAdmin}
                          onClick={() => handleToggle(role, perm.id)}
                          className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-blue-600 text-white shadow-2xs hover:bg-blue-700'
                              : 'border border-slate-300 bg-white hover:border-blue-400'
                          } ${isSuperAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
