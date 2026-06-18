import { ChevronDown, Star } from 'lucide-react';

interface HeroSectionProps {
  setCurrentPage: (page: string) => void;
}

export default function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Coffee Shop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/80 via-coffee-900/60 to-coffee-900/95" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-32 right-20 text-6xl animate-float opacity-20">☕</div>
      <div className="absolute bottom-40 left-16 text-5xl animate-float opacity-15" style={{ animationDelay: '1s' }}>🫘</div>
      <div className="absolute top-48 left-32 text-4xl animate-float opacity-10" style={{ animationDelay: '2s' }}>✨</div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-gold-400 fill-gold-400" />
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            کافه <span className="text-transparent bg-clip-text bg-gradient-to-l from-coffee-300 to-coffee-500">لانژ</span>
          </h1>
          <p className="text-lg md:text-2xl text-coffee-200 mb-3 font-light">
            تجربه‌ای بی‌نظیر از طعم و عطر قهوه
          </p>
          <p className="text-sm md:text-base text-coffee-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            با بیش از ۱۰ سال تجربه در ارائه بهترین نوشیدنی‌ها، کافه لانژ مکانی است برای لذت بردن از لحظات خوب زندگی
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => setCurrentPage('menu')}
            className="btn-primary px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl w-full sm:w-auto"
          >
            مشاهده منو ☕
          </button>
          <button
            onClick={() => setCurrentPage('reserve')}
            className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-coffee-500 text-coffee-200 hover:bg-coffee-500/20 transition-all w-full sm:w-auto"
          >
            رزرو میز 🪑
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {[
            { number: '+۱۰', label: 'سال تجربه' },
            { number: '+۵۰', label: 'آیتم منو' },
            { number: '+۱۰K', label: 'مشتری راضی' },
          ].map((stat, i) => (
            <div key={i} className="glass-effect rounded-2xl p-4">
              <div className="text-2xl md:text-3xl font-black text-coffee-300">{stat.number}</div>
              <div className="text-xs md:text-sm text-coffee-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-coffee-400" />
      </div>
    </section>
  );
}
