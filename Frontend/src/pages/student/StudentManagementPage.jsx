import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  GraduationCap,
  UserPlus,
  Search,
  Mail,
  Calendar,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  BookOpen,
  Filter,
  Eye,
  Sparkles,
  Award,
  Zap,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function StudentManagementPage() {
  const { students = [], addStudent, updateStudent, deleteStudent, courses = [], setActiveBatchFilter, availableBatches } = useLmsData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const batchList = availableBatches && availableBatches.length > 0
    ? availableBatches
    : ['A26W1', 'A26W2', 'A26W3', 'A26W4', 'A26S1', 'A26S2', 'A26S3'];

  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [testingStudent, setTestingStudent] = useState(null);

  const defaultBatch = batchList[0] || 'A26W1';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationId: '',
    batch: defaultBatch,
    enrolledCourses: ['crs-101'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const handleOpenAddModal = () => {
    const count = students.length + 1;
    const isWeekend = defaultBatch.startsWith('A26S') || defaultBatch.startsWith('A26WE');
    const prefix = isWeekend ? 'A26S' : 'A26W';
    const defaultRegId = `${prefix}${String(count).padStart(4, '0')}`;
    setFormData({
      name: '',
      email: '',
      registrationId: defaultRegId,
      batch: defaultBatch,
      enrolledCourses: ['crs-101'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  const handleBatchSelectChange = (e) => {
    const selectedBatch = e.target.value;
    const isWeekend = selectedBatch.startsWith('A26S') || selectedBatch.startsWith('A26WE');
    const prefix = isWeekend ? 'A26S' : 'A26W';
    const batchCount = students.filter(s => s.batch === selectedBatch).length + 1;
    const autoRegId = `${prefix}${String(batchCount).padStart(4, '0')}`;
    setFormData(prev => ({
      ...prev,
      batch: selectedBatch,
      registrationId: autoRegId
    }));
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      registrationId: student.registrationId || '',
      batch: student.batch || defaultBatch,
      enrolledCourses: student.enrolledCourses || ['crs-101'],
      avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.registrationId) {
      addToast('Please provide student name, email, and registration ID', 'error');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      addToast(`Updated student account for "${formData.name}" (${formData.registrationId})`, 'success');
      setEditingStudent(null);
    } else {
      addStudent(formData);
      addToast(`Added new student: "${formData.name}" [Reg ID: ${formData.registrationId}]`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingStudent) {
      deleteStudent(deletingStudent.id);
      addToast(`Removed student account for "${deletingStudent.name}"`, 'info');
      setDeletingStudent(null);
    }
  };

  const handleTestStudentAccess = (student) => {
    setTestingStudent(student);
    if (setActiveBatchFilter && student?.batch) {
      setActiveBatchFilter(student.batch);
    }
    addToast(`Testing active session as ${student.name} (${student.registrationId} - Batch ${student.batch})`, 'info');
  };

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    if (!s) return false;
    const name = (s.name || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    const regId = (s.registrationId || '').toLowerCase();
    const batch = (s.batch || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query) || regId.includes(query) || batch.includes(query);
    
    let matchesBatch = batchFilter === 'ALL' || s.batch === batchFilter;
    const isWeekdayFilter = batchFilter === 'WEEKDAY' || batchFilter === 'Weekday Batch';
    const isWeekendFilter = batchFilter === 'WEEKEND' || batchFilter === 'Weekend Batch';

    if (isWeekdayFilter) {
      matchesBatch = s.batch?.startsWith('A26W') && !s.batch?.startsWith('A26S');
    } else if (isWeekendFilter) {
      matchesBatch = s.batch?.startsWith('A26S') || s.batch?.startsWith('A26WE');
    }

    return matchesSearch && matchesBatch;
  });

  const weekdayCount = students.filter(s => s.batch?.startsWith('A26W') && !s.batch?.startsWith('A26S')).length;
  const weekendCount = students.filter(s => s.batch?.startsWith('A26S') || s.batch?.startsWith('A26WE')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-600" /> Student Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time batch allocation & course access for Weekday (`A26WXXXX`) and Weekend (`A26SXXXX`) batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={handleOpenAddModal} icon={Plus}>
            Add Student
          </Button>
        </div>
      </div>



      {/* Real-time Student Access Testing Modal / Drawer Banner if active */}
      {testingStudent && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">{testingStudent.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  testingStudent.batch === 'Weekday Batch' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' : 'bg-purple-500/30 text-purple-300 border border-purple-400/40'
                }`}>
                  {testingStudent.registrationId}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  {testingStudent.batch}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real-time test session active. Verify course access and batch milestone roadmap progression.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              onClick={() => navigate('/milestones')}
            >
              <span>Test Milestones Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              onClick={() => setTestingStudent(null)}
            >
              Close Simulator
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, email, Reg ID (A26W / A26S)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium transition-all"
          />
        </div>

        {/* Batch Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setBatchFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              batchFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Batches ({students.length})
          </button>
          <button
            onClick={() => setBatchFilter('Weekday Batch')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              batchFilter === 'Weekday Batch'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Weekday Batch ({weekdayCount})
          </button>
          <button
            onClick={() => setBatchFilter('Weekend Batch')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              batchFilter === 'Weekend Batch'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            Weekend Batch ({weekendCount})
          </button>
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No Students Found"
            description="No student records match your current search query or batch filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3.5 px-4">Student Profile</th>
                  <th className="py-3.5 px-4">Registration ID</th>
                  <th className="py-3.5 px-4">Batch Allocation</th>
                  <th className="py-3.5 px-4">Course Enrolments</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredStudents.map((student) => {
                  const isWeekday = student.batch === 'Weekday Batch';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {student.avatar && !student.avatar.includes('unsplash.com') ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200/80 ring-2 ring-slate-100 bg-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center justify-center font-black text-xs shadow-2xs flex-shrink-0">
                              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-400 font-normal">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Registration ID Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shadow-2xs ${
                            isWeekday
                              ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                              : 'bg-purple-50 text-purple-700 border-purple-200/80'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          {student.registrationId}
                        </span>
                      </td>

                      {/* Batch Allocation */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isWeekday
                              ? 'bg-blue-100/70 text-blue-800'
                              : 'bg-purple-100/70 text-purple-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isWeekday ? 'bg-blue-600' : 'bg-purple-600'
                            }`}
                          />
                          {student.batch}
                        </span>
                      </td>

                      {/* Course Access */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {student.enrolledCourses?.map((crsId) => {
                            const crs = courses.find((c) => c.id === crsId);
                            return (
                              <span
                                key={crsId}
                                className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px] font-semibold"
                              >
                                {crs ? crs.title.split(' ')[0] : crsId}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant="success">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Active
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTestStudentAccess(student)}
                            title="Test Real-Time Access"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-blue-200/60"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            title="Edit Student"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            title="Delete Student"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingStudent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Student: ${editingStudent.registrationId}` : 'Register New Student'}
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <Input
            label="Student Full Name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => {
              const nameVal = e.target.value;
              const generatedEmail = nameVal.trim()
                ? `${nameVal.toLowerCase().trim().replace(/\s+/g, '.')}@gmail.com`
                : '';
              setFormData({
                ...formData,
                name: nameVal,
                email: generatedEmail
              });
            }}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul.sharma@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Batch Allocation"
              value={formData.batch}
              onChange={handleBatchSelectChange}
              options={batchList.map((b) => ({
                value: b,
                label: b.startsWith('A26W') ? `${b} (Weekday)` : `${b} (Weekend)`
              }))}
            />

            <Input
              label="Registration ID"
              placeholder="e.g. A26W0001 or A26S0001"
              value={formData.registrationId}
              onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingStudent ? 'Update Account' : 'Register Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Account"
        message={`Are you sure you want to remove student "${deletingStudent?.name}" (${deletingStudent?.registrationId})? This action cannot be undone.`}
        confirmText="Remove Student"
        type="danger"
      />
    </div>
  );
}
