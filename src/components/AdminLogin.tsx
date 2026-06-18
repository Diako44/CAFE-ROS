import { useState } from 'react';
import { X, Lock, Shield, Eye, EyeOff, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminLoginProps {
  onClose: () => void;
  onLogin: () => void;
}

export default function AdminLogin({ onClose, onLogin }: AdminLoginProps) {
  const { validateAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('نام کاربری و رمز عبور را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate slight delay
    setTimeout(() => {
      const admin = validateAdmin(username, password);
      if (admin) {
        onLogin();
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm glass-effect rounded-2xl p-8 animate-fadeInUp">
        <button onClick={onClose} className="absolute top-4 left-4 text-coffee-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-4">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">پنل مدیریت</h2>
          <p className="text-coffee-400 text-sm">
            برای ورود نام کاربری و رمز عبور را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-coffee-300 mb-1 block">نام کاربری</label>
            <div className="relative">
              <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="admin"
                className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${
                  error ? 'border-red-500' : 'border-coffee-700'
                }`}
                dir="ltr"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-coffee-300 mb-1 block">رمز عبور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="رمز عبور"
                className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-12 text-coffee-100 text-sm ${
                  error ? 'border-red-500' : 'border-coffee-700'
                }`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500 hover:text-coffee-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <Shield size={18} />
                ورود به پنل مدیریت
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-coffee-800/30 rounded-xl">
          <p className="text-coffee-500 text-xs text-center">
            💡 پیش‌فرض: <span className="font-mono text-coffee-300" dir="ltr">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
