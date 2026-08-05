import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LogIn, Lock, Mail, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('sarah.admin@aspirelms.io');
  const [password, setPassword] = useState('password123');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState('Super Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);

      if (res.success) {
        addToast(`Welcome back, ${res.user.name}! Logged in as ${res.user.role}`, 'success');
        navigate('/dashboard');
      } else {
        addToast('Invalid credentials. Please check and try again.', 'error');
      }
    }, 400);
  };

  const fillDemoAccount = (roleEmail, roleTitle) => {
    setEmail(roleEmail);
    setPassword('password123');
    setSelectedRoleTitle(roleTitle);
    addToast(`Selected demo credentials for ${roleTitle}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Brand Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Aspire LMS Logo"
                className="w-10 h-10 object-contain rounded-xl border border-white/20 p-0.5 bg-white shadow-md"
              />
              <div>
                <span className="font-black text-lg text-white tracking-tight">ASPIRE LMS</span>
                <span className="text-[10px] block uppercase font-bold text-blue-200 tracking-wider">Staff Console</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-snug">
                Staff Publishing & Management Portal
              </h2>
              <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                Sign in to manage courseware, schedule live classes, publish assessments, and broadcast data to the Student LMS.
              </p>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-2">
              <p className="text-[11px] font-extrabold uppercase text-blue-200 tracking-wider mb-2.5">
                Staff Accounts (Click to Select):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('sarah.admin@aspirelms.io', 'Super Admin')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all text-left truncate cursor-pointer ${
                    selectedRoleTitle === 'Super Admin'
                      ? 'bg-white text-blue-900 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('alex.rivera@aspirelms.io', 'Admin')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all text-left truncate cursor-pointer ${
                    selectedRoleTitle === 'Admin'
                      ? 'bg-white text-blue-900 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  ⚙️ Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('priya.s@aspirelms.io', 'Manager')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all text-left truncate cursor-pointer ${
                    selectedRoleTitle === 'Manager'
                      ? 'bg-white text-blue-900 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  📊 Manager
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('david.chen@aspirelms.io', 'Instructor')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all text-left truncate cursor-pointer ${
                    selectedRoleTitle === 'Instructor'
                      ? 'bg-white text-blue-900 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  💻 Instructor
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-[11px] text-blue-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>Staff Authentication Protected</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedRoleTitle ? `${selectedRoleTitle} Sign In` : 'Staff Console Sign In'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your staff credentials to access the console as {selectedRoleTitle || 'staff'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Staff Email Address"
                icon={Mail}
                type="email"
                placeholder="staff@aspirelms.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                icon={LogIn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In to Console'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
