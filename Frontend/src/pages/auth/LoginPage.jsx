import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LogIn, Lock, Mail, ShieldCheck, UserPlus } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        addToast(res.message || 'Invalid credentials. Please check and try again.', 'error');
      }
    }, 400);
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
                <span className="text-[10px] block uppercase font-bold text-blue-200 tracking-wider">Administration Portal</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-snug">
                Learning Management & Administration Platform
              </h2>
              <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                Welcome to Aspire LMS. Manage courses, track student performance, schedule live sessions, and publish assessments seamlessly.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs">
              <span className="font-bold text-blue-200 uppercase tracking-wider block text-[10px]">Portal Access</span>
              <ul className="text-blue-100/90 space-y-1.5 text-[11px] list-disc pl-3.5">
                <li><strong className="text-white">Super Admin</strong>: Full administrative control and platform settings.</li>
                <li><strong className="text-white">Educators & Staff</strong>: Manage courseware, live classes, student progress, and grading.</li>
              </ul>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-[11px] text-blue-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>Secure 256-Bit Encrypted Authentication</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Sign In to Aspire LMS
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your account credentials to access your administrative dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="aspireAdmin@gmail.com"
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
