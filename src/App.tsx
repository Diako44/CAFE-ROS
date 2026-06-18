import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import MenuPage from './components/MenuPage';
import ReservePage from './components/ReservePage';
import ContactPage from './components/ContactPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import type { MenuItem } from './data/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const menuSliderItems = [
    { name: 'اسپرسو', nameEn: 'Espresso', price: '۶۵,۰۰۰', img: '/images/espresso.jpg', desc: 'اسپرسو تازه دم با دانه‌های مرغوب' },
    { name: 'کاپوچینو', nameEn: 'Cappuccino', price: '۸۵,۰۰۰', img: '/images/cappuccino.jpg', desc: 'کاپوچینو با فوم شیر ابریشمی' },
    { name: 'چیزکیک', nameEn: 'Cheesecake', price: '۱۲۰,۰۰۰', img: '/images/cheesecake.jpg', desc: 'چیزکیک خامه‌ای نیویورکی' },
    { name: 'تیرامیسو', nameEn: 'Tiramisu', price: '۱۳۰,۰۰۰', img: '/images/tiramisu.jpg', desc: 'تیرامیسوی کلاسیک ایتالیایی' },
    { name: 'لاته', nameEn: 'Latte', price: '۹۰,۰۰۰', img: '/images/latte.jpg', desc: 'لاته آرت با شیر تازه' },
    { name: 'کروسان', nameEn: 'Croissant', price: '۸۵,۰۰۰', img: '/images/croissant.jpg', desc: 'کروسان تازه فرانسوی' },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Auto slider with pause on hover
  useEffect(() => {
    if (currentPage !== 'home' || isSliderPaused) return;
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % menuSliderItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentPage, menuSliderItems.length, isSliderPaused]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  const handleNavToAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const goToSlide = (index: number) => {
    setSliderIndex(index);
  };

  const nextSlide = () => {
    setSliderIndex(prev => (prev + 1) % menuSliderItems.length);
  };

  const prevSlide = () => {
    setSliderIndex(prev => (prev - 1 + menuSliderItems.length) % menuSliderItems.length);
  };

  // Get visible items for 3D carousel effect
  const getVisibleItems = () => {
    const items = [];
    const total = menuSliderItems.length;
    for (let i = -2; i <= 2; i++) {
      const index = (sliderIndex + i + total) % total;
      items.push({ ...menuSliderItems[index], position: i, originalIndex: index });
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-coffee-900 text-white">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        setShowLogin={setShowLogin}
        onAdminClick={handleNavToAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {currentPage === 'home' && (
        <>
          <HeroSection setCurrentPage={setCurrentPage} />
          <AboutSection />

          {/* Featured Menu Preview with 3D Carousel */}
          <section className="py-24 bg-gradient-to-b from-coffee-800 to-coffee-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <span className="text-coffee-400 text-sm font-medium tracking-wider uppercase">پیشنهاد ویژه</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
                  منوی <span className="text-transparent bg-clip-text bg-gradient-to-l from-coffee-300 to-coffee-500">محبوب</span>
                </h2>
                <p className="text-coffee-400 max-w-md mx-auto">بهترین انتخاب‌های مشتریان ما</p>
              </div>

              {/* 3D Carousel */}
              <div
                className="relative h-[450px] perspective-1000"
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
              >
                {/* Carousel Container */}
                <div className="relative h-full flex items-center justify-center">
                  {getVisibleItems().map((item, idx) => {
                    const isCenter = item.position === 0;
                    const isAdjacent = Math.abs(item.position) === 1;
                    const isFar = Math.abs(item.position) === 2;

                    return (
                      <div
                        key={`${item.originalIndex}-${idx}`}
                        onClick={() => goToSlide(item.originalIndex)}
                        className={`absolute cursor-pointer transition-all duration-700 ease-out ${
                          isCenter ? 'z-30' : isAdjacent ? 'z-20' : 'z-10'
                        }`}
                        style={{
                          transform: `
                            translateX(${item.position * (isCenter ? 0 : isAdjacent ? 280 : 450)}px)
                            scale(${isCenter ? 1 : isAdjacent ? 0.8 : 0.6})
                            rotateY(${item.position * -15}deg)
                          `,
                          opacity: isFar ? 0.3 : isAdjacent ? 0.7 : 1,
                        }}
                      >
                        <div className={`w-72 bg-gradient-to-b from-coffee-800 to-coffee-900 rounded-3xl overflow-hidden shadow-2xl border border-coffee-700/30 transition-all duration-500 ${
                          isCenter ? 'ring-2 ring-coffee-400 shadow-coffee-500/30' : ''
                        }`}>
                          {/* Image with overlay */}
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={item.img}
                              alt={item.name}
                              className={`w-full h-full object-cover transition-transform duration-700 ${
                                isCenter ? 'scale-110' : ''
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-transparent to-transparent" />
                            
                            {/* Badge */}
                            {isCenter && (
                              <div className="absolute top-4 right-4 bg-coffee-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                پرفروش ⭐
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6 text-center">
                            <h3 className="text-xl font-black text-white mb-1">{item.name}</h3>
                            <p className="text-coffee-500 text-xs mb-2">{item.nameEn}</p>
                            {isCenter && (
                              <p className="text-coffee-400 text-sm mb-3 animate-fadeIn">{item.desc}</p>
                            )}
                            <div className={`font-bold transition-all duration-500 ${
                              isCenter ? 'text-2xl text-coffee-300' : 'text-lg text-coffee-400'
                            }`}>
                              {item.price} <span className="text-sm font-normal">تومان</span>
                            </div>
                            
                            {isCenter && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setCurrentPage('menu'); }}
                                className="mt-4 w-full bg-gradient-to-r from-coffee-500 to-coffee-600 hover:from-coffee-400 hover:to-coffee-500 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                              >
                                سفارش دهید ☕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-coffee-800/80 backdrop-blur-sm text-coffee-200 flex items-center justify-center hover:bg-coffee-700 transition-all duration-300 shadow-xl border border-coffee-600/30 hover:scale-110"
                >
                  <ChevronRight size={28} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-coffee-800/80 backdrop-blur-sm text-coffee-200 flex items-center justify-center hover:bg-coffee-700 transition-all duration-300 shadow-xl border border-coffee-600/30 hover:scale-110"
                >
                  <ChevronLeft size={28} />
                </button>
              </div>

              {/* Dots Navigation */}
              <div className="flex items-center justify-center gap-3 mt-8">
                {menuSliderItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`relative transition-all duration-500 ${
                      i === sliderIndex
                        ? 'w-10 h-3 rounded-full bg-gradient-to-r from-coffee-400 to-coffee-500'
                        : 'w-3 h-3 rounded-full bg-coffee-700 hover:bg-coffee-600'
                    }`}
                  >
                    {i === sliderIndex && (
                      <span className="absolute inset-0 rounded-full bg-coffee-400 animate-ping opacity-50" />
                    )}
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mt-6">
                <div className="h-1 bg-coffee-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-coffee-500 to-coffee-400 transition-all duration-300"
                    style={{ width: `${((sliderIndex + 1) / menuSliderItems.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentPage('menu')}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-500 hover:to-coffee-600 px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>مشاهده منوی کامل</span>
                  <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                  <div className="absolute inset-0 rounded-2xl bg-coffee-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/images/interior.jpg"
                alt="CTA"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/95 via-coffee-900/80 to-coffee-900/95" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
              <div className="inline-block px-4 py-2 rounded-full bg-coffee-500/20 border border-coffee-500/30 text-coffee-300 text-sm mb-6">
                🎉 تخفیف ۱۵٪ برای اولین رزرو
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                همین الان میزتان را <span className="text-coffee-400">رزرو</span> کنید
              </h2>
              <p className="text-coffee-300 text-lg mb-10 leading-relaxed">
                فضای دلنشین کافه لانژ منتظر شماست. آنلاین رزرو کنید و از تخفیف ویژه بهره‌مند شوید.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage('reserve')}
                  className="btn-primary px-10 py-4 rounded-2xl text-white font-bold text-lg w-full sm:w-auto shadow-2xl hover:shadow-coffee-500/30"
                >
                  رزرو آنلاین 🪑
                </button>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="px-10 py-4 rounded-2xl font-bold text-lg border-2 border-coffee-500 text-coffee-200 hover:bg-coffee-500/20 transition-all w-full sm:w-auto"
                >
                  تماس بگیرید 📞
                </button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-24 bg-gradient-to-b from-coffee-900 to-coffee-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <span className="text-coffee-400 text-sm font-medium tracking-wider uppercase">نظرات مشتریان</span>
                <h2 className="text-4xl font-black text-white mt-3">مشتریان ما چه می‌گویند؟</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'مریم کاظمی', text: 'بهترین قهوه‌ای که تا حالا خوردم! محیط کافه هم فوق‌العاده دلنشینه. هر هفته حتماً سر می‌زنم.', level: '👑 عضو طلایی', rating: 5 },
                  { name: 'حسین نوری', text: 'سیستم رزرو آنلاین خیلی راحته. چیزکیکشون حرف نداره! سرویس‌دهی عالی و پرسنل مودب.', level: '🥈 عضو نقره‌ای', rating: 5 },
                  { name: 'زهرا میرزایی', text: 'باشگاه مشتریان کافه لانژ واقعاً ارزشمنده. تخفیف‌های خوبی میدن و همیشه حس خاصی دارم.', level: '👑 عضو طلایی', rating: 5 },
                ].map((review, i) => (
                  <div key={i} className="group glass-effect rounded-3xl p-8 hover:bg-coffee-700/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(review.rating)].map((_, j) => (
                        <span key={j} className="text-gold-400 text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-coffee-300 text-base leading-relaxed mb-6">"{review.text}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-coffee-700/30">
                      <div>
                        <h4 className="text-white font-bold">{review.name}</h4>
                        <p className="text-coffee-500 text-sm">{review.level}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-500 to-coffee-700 flex items-center justify-center text-2xl">
                        ☕
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'menu' && <MenuPage cart={cart} setCart={setCart} />}
      {currentPage === 'reserve' && <ReservePage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'profile' && isLoggedIn && <ProfilePage onLogout={handleLogout} />}
      {currentPage === 'admin' && isAdminLoggedIn && <AdminPanel />}

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} onLogin={handleAdminLogin} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
