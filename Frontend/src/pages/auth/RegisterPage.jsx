import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { ROLES } from '../../utils/mockData';
import { UserPlus, Lock, Mail, User, ShieldCheck, ArrowLeft, BookOpen, Video, BarChart3, FileText } from 'lucide-react';
import { AINetworkCanvas } from '../../components/auth/AINetworkCanvas';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.INSTRUCTOR,
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Exclude Super Admin from self-registration choices
  const roleOptions = [
    { value: ROLES.ADMIN, label: '⚙️ Admin (Operational & Content Control)' },
    { value: ROLES.MANAGER, label: '📊 Manager (Course & Analytics Oversight)' },
    { value: ROLES.INSTRUCTOR, label: '💻 Instructor (Courseware & Live Classes)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address';
    
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === ROLES.SUPER_ADMIN) {
      errs.role = 'Super Admin registration is prohibited.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setIsLoading(false);

      if (res.success) {
        addToast(`Account created successfully! You can now log in as ${res.user.role}.`, 'success');
        navigate('/login');
      } else {
        addToast(res.message || 'Failed to register account.', 'error');
      }
    } catch (err) {
      setIsLoading(false);
      addToast('An error occurred during registration. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Brand Panel (Preserved with AI animations) */}
        <div className="lg:col-span-5 animate-purple-gradient p-8 text-white flex flex-col justify-between relative overflow-hidden select-none">
          {/* 1 & 2. Background Layers: AI Network Animation Canvas */}
          <AINetworkCanvas />

          {/* 3. Glassmorphism 3D Floating Orbs */}
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-purple-500/30 to-fuchsia-500/20 blur-3xl pointer-events-none animate-orb-1 z-0"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/25 blur-3xl pointer-events-none animate-orb-2 z-0"
            aria-hidden="true"
          />

          {/* Foreground Content with Staggered Entrance Animations */}
          <div className="relative z-10 space-y-6">
            {/* Logo & Header */}
            <div className="flex items-center gap-3 animate-entrance delay-100 opacity-0">
              <div className="relative rounded-xl animate-logo-glow">
                <img
                  src="/logo.jpg"
                  alt="Aspire LMS Logo"
                  className="w-10 h-10 object-contain rounded-xl border border-white/20 p-0.5 bg-white shadow-md relative z-10"
                />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight block">ASPIRE LMS</span>
                <span className="text-[10px] block uppercase font-bold text-purple-200 tracking-wider">Account Creation</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-snug animate-entrance delay-200 opacity-0">
                Join Aspire LMS
              </h2>
              <p className="text-xs text-purple-100/90 mt-2 leading-relaxed animate-entrance delay-300 opacity-0">
                Create your account to design courses, manage live classes, assess student progress, and collaborate with your team.
              </p>
            </div>

            {/* Feature-Focused LMS Information Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 animate-entrance delay-400 opacity-0">
              {/* Card 1: Course Management */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-md shadow-purple-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/30 cursor-default group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <BookOpen className="w-4 h-4 text-purple-300 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-300 shrink-0" />
                    <h4 className="font-bold text-xs text-white leading-tight tracking-tight">Course Management</h4>
                  </div>
                  <p className="text-[10px] text-purple-100/80 leading-snug">
                    Create, organize, and publish courses with an intuitive management system.
                  </p>
                </div>
              </div>

              {/* Card 2: Live Session Management */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-md shadow-purple-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/30 cursor-default group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <Video className="w-4 h-4 text-purple-300 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-300 shrink-0" />
                    <h4 className="font-bold text-xs text-white leading-tight tracking-tight">Live Session Management</h4>
                  </div>
                  <p className="text-[10px] text-purple-100/80 leading-snug">
                    Schedule, manage, and conduct live classes seamlessly.
                  </p>
                </div>
              </div>

              {/* Card 3: Student Analytics */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-md shadow-purple-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/30 cursor-default group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <BarChart3 className="w-4 h-4 text-purple-300 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-300 shrink-0" />
                    <h4 className="font-bold text-xs text-white leading-tight tracking-tight">Student Analytics</h4>
                  </div>
                  <p className="text-[10px] text-purple-100/80 leading-snug">
                    Monitor student engagement, attendance, and academic performance.
                  </p>
                </div>
              </div>

              {/* Card 4: Assessment Publishing */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-md shadow-purple-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/30 cursor-default group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <FileText className="w-4 h-4 text-purple-300 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-300 shrink-0" />
                    <h4 className="font-bold text-xs text-white leading-tight tracking-tight">Assessment Publishing</h4>
                  </div>
                  <p className="text-[10px] text-purple-100/80 leading-snug">
                    Create quizzes, assignments, and evaluations with ease.
                  </p>
                </div>
              </div>
            </div>

            {/* Security & Permissions Card (Glassmorphism & Soft Hover Effect) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/40 cursor-default animate-entrance delay-500 opacity-0 group">
              <span className="font-bold text-purple-200 uppercase tracking-wider block text-[10px] group-hover:text-purple-100 transition-colors">Security & Permissions</span>
              <p className="text-purple-100/90 leading-relaxed text-[11px]">
                Registration grants standard operational access (Admin, Manager, Instructor). <strong className="text-white">Super Admin</strong> privileges are enterprise-managed.
              </p>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center gap-2 text-[11px] text-purple-200 font-semibold animate-entrance delay-500 opacity-0">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>Enterprise Role-Based Access Control</span>
          </div>
        </div>

        {/* Right Form Panel (Restored to previous form layout) */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Create Your Account
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Fill in your details below to register your account
                </p>
              </div>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Full Name"
                icon={User}
                name="name"
                type="text"
                placeholder="e.g. Elena Rostova"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <Input
                label="Work Email Address"
                icon={Mail}
                name="email"
                type="email"
                placeholder="elena.rostova@gmail.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <Select
                label="Account Role"
                icon={ShieldCheck}
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                error={errors.role}
              />

              <Input
                label="Password"
                icon={Lock}
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                icon={Lock}
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-3"
                icon={UserPlus}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Sign In here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
