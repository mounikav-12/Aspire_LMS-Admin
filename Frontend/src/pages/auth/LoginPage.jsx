import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LogIn, Lock, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { AINetworkCanvas } from '../../components/auth/AINetworkCanvas';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      setIsLoading(false);

      if (res.success) {
        addToast(`Welcome back, ${res.user.name}! Logged in as ${res.user.role}`, 'success');
        if (res.user.role === 'student' || res.user.role?.toLowerCase() === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        addToast(res.message || 'Invalid credentials. Please check and try again.', 'error');
      }
    } catch (err) {
      setIsLoading(false);
      addToast('An error occurred during login. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Brand Panel */}
        <div className="lg:col-span-5 animate-purple-gradient p-8 text-white flex flex-col justify-between relative overflow-hidden select-none">
          {/* 1 & 2. Background Layers: AI Network Animation Canvas */}
          <AINetworkCanvas />

          {/* 3. Glassmorphism 3D Orbs */}
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
            {/* Logo & Header (Entrance Step 1 + Soft Glow Micro-interaction) */}
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
                <span className="text-[10px] block uppercase font-bold text-purple-200 tracking-wider">Administration Portal</span>
              </div>
            </div>

            {/* Title & Description (Entrance Steps 2 & 3) */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-snug animate-entrance delay-200 opacity-0">
                Learning Management & Administration Platform
              </h2>
              <p className="text-xs text-purple-100/90 mt-2 leading-relaxed animate-entrance delay-300 opacity-0">
                Welcome to Aspire LMS. Manage courses, track student performance, schedule live sessions, and publish assessments seamlessly.
              </p>
            </div>

            {/* Portal Access Card (Entrance Step 4 + Interactive Glassmorphism Hover Animation) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.14] hover:border-purple-300/40 hover:shadow-xl hover:shadow-purple-950/40 cursor-default animate-entrance delay-400 opacity-0 group">
              <span className="font-bold text-purple-200 uppercase tracking-wider block text-[10px] group-hover:text-purple-100 transition-colors">Portal Access</span>
              <ul className="text-purple-100/90 space-y-1.5 text-[11px] list-disc pl-3.5">
                <li><strong className="text-white">Super Admin</strong>: Full administrative control and platform settings.</li>
                <li><strong className="text-white">Educators & Staff</strong>: Manage courseware, live classes, student progress, and grading.</li>
              </ul>
            </div>
          </div>

          {/* Footer Security Badge (Entrance Step 5) */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center gap-2 text-[11px] text-purple-200 font-semibold animate-entrance delay-500 opacity-0">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
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
                placeholder="name@company.com"
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
