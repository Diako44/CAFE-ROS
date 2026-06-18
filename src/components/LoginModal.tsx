import { useState } from 'react';
import { X, Phone, User, ArrowLeft } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = () => {
    if (mode === 'verify') {
      onLogin();
      return;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('شماره موبایل را وارد کنید');
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setPhoneError('شماره موبایل معتبر نیست');
      return;
    }

    if (mode === 'register' && !name.trim()) return;

    setPhoneError('');
    setMode('verify');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md glass-effect rounded-2xl p-8 animate-fadeInUp">
        <button onClick={onClose} className="absolute top-4 left-4 text-coffee-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-2xl font-black text-white mb-2">
            {mode === 'login' ? 'ورود به حساب' : mode === 'register' ? 'ثبت نام' : 'تایید شماره'}
          </h2>
          <p className="text-coffee-400 text-sm">
            {mode === 'verify'
              ? `کد تایید به شماره ${phone} ارسال شد`
              : 'به کافه لانژ خوش آمدید'
            }
          </p>
        </div>

        <div className="space-y-4">
          {mode === 'verify' ? (
            <div>
              <label className="text-sm text-coffee-300 mb-1 block">کد تایید ۴ رقمی</label>
              <div className="flex gap-2" dir="ltr">
                {[0, 1, 2, 3].map(i => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={e => {
                      const newOtp = otp.split('');
                      newOtp[i] = e.target.value;
                      setOtp(newOtp.join(''));
                      if (e.target.value && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                    className="w-14 h-14 text-center text-2xl font-bold bg-coffee-800/50 border border-coffee-700 rounded-xl text-coffee-100"
                  />
                ))}
              </div>
              <button className="text-coffee-400 text-xs mt-3 hover:text-coffee-200">ارسال مجدد کد</button>
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <div>
                  <label className="text-sm text-coffee-300 mb-1 block">نام و نام خانوادگی</label>
                  <div className="relative">
                    <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="نام شما"
                      className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-coffee-300 mb-1 block">شماره موبایل</label>
                <div className="relative">
                  <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
                    placeholder="09121234567"
                    dir="ltr"
                    className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${
                      phoneError ? 'border-red-500' : 'border-coffee-700'
                    }`}
                  />
                </div>
                {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
              </div>
            </>
          )}

          <button onClick={handleSubmit} className="w-full btn-primary py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2">
            {mode === 'verify' ? 'تایید و ورود' : mode === 'login' ? 'دریافت کد تایید' : 'ثبت نام و دریافت کد'}
            <ArrowLeft size={18} />
          </button>

          {mode !== 'verify' && (
            <div className="text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-coffee-400 text-sm hover:text-coffee-200 transition-colors"
              >
                {mode === 'login' ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'حساب کاربری دارید؟ وارد شوید'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
