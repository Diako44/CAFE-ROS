import { useState, useEffect } from 'react';
import { Coffee, Menu, X, User, Home, BookOpen, CalendarCheck, Phone, Shield } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  setShowLogin: (show: boolean) => void;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({ currentPage, setCurrentPage, isLoggedIn, setShowLogin, onAdminClick, isAdminLoggedIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'خانه', icon: <Home size={18} /> },
    { id: 'menu', label: 'منوی کافه', icon: <BookOpen size={18} /> },
    { id: 'reserve', label: 'رزرو میز', icon: <CalendarCheck size={18} /> },
    { id: 'contact', label: 'ارتباط با ما', icon: <Phone size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-effect shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center shadow-lg">
              <Coffee size={24} className="text-coffee-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-coffee-100">کافه لانژ</h1>
              <p className="text-xs text-coffee-400">Café Lounge</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-coffee-600/50 text-coffee-100 shadow-lg'
                    : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800/30'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onAdminClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'admin' || isAdminLoggedIn
                  ? 'bg-red-900/50 text-red-300 ring-1 ring-red-500'
                  : 'text-coffee-400 hover:text-red-300 hover:bg-red-900/30'
              }`}
            >
              <Shield size={18} />
              {isAdminLoggedIn ? 'پنل مدیریت' : 'ورود ادمین'}
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => setCurrentPage('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium btn-primary text-white ${
                  currentPage === 'profile' ? 'ring-2 ring-coffee-300' : ''
                }`}
              >
                <User size={18} />
                پنل کاربری
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium btn-primary text-white"
              >
                <User size={18} />
                ورود / ثبت نام
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-coffee-200 p-2">
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-effect border-t border-coffee-700/30 animate-fadeIn">
          <div className="p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-coffee-600/50 text-coffee-100'
                    : 'text-coffee-300 hover:bg-coffee-800/30'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <hr className="border-coffee-700/30" />
            <button
              onClick={() => { onAdminClick(); setMobileOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm ${
                isAdminLoggedIn ? 'bg-red-900/30 text-red-300' : 'text-coffee-400 hover:bg-red-900/30'
              }`}
            >
              <Shield size={18} />
              {isAdminLoggedIn ? 'پنل مدیریت' : 'ورود ادمین'}
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => { setCurrentPage('profile'); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm btn-primary text-white"
              >
                <User size={18} />
                پنل کاربری
              </button>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm btn-primary text-white"
              >
                <User size={18} />
                ورود / ثبت نام
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
