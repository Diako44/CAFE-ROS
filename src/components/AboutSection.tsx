import { Award, Clock, Heart, Leaf } from 'lucide-react';

export default function AboutSection() {
  const features = [
    { icon: <Award size={32} />, title: 'کیفیت برتر', desc: 'استفاده از مرغوب‌ترین دانه‌های قهوه از سراسر جهان' },
    { icon: <Clock size={32} />, title: 'همیشه تازه', desc: 'آسیاب و دم‌آوری در لحظه برای بهترین طعم' },
    { icon: <Heart size={32} />, title: 'با عشق', desc: 'تهیه شده با عشق و دقت توسط باریستاهای حرفه‌ای' },
    { icon: <Leaf size={32} />, title: 'ارگانیک', desc: 'مواد اولیه طبیعی و ارگانیک بدون مواد افزودنی' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-coffee-900 to-coffee-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-coffee-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-coffee-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-coffee-400 text-sm font-medium tracking-wider uppercase">درباره ما</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6">
            داستان <span className="text-coffee-400">کافه لانژ</span>
          </h2>
          <p className="text-coffee-300 max-w-2xl mx-auto leading-relaxed">
            کافه لانژ از سال ۱۳۹۲ با هدف ارائه بهترین تجربه نوشیدن قهوه در فضایی دلنشین و مدرن تاسیس شده است.
            ما با انتخاب بهترین دانه‌های قهوه از سراسر جهان و باریستاهای حرفه‌ای، تجربه‌ای بی‌نظیر را برای شما فراهم می‌کنیم.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-effect rounded-2xl p-8 text-center hover:bg-coffee-700/30 transition-all duration-300 group hover:scale-105"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coffee-500 to-coffee-700 flex items-center justify-center mx-auto mb-5 text-coffee-100 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-coffee-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Image Gallery */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-2xl overflow-hidden h-72 relative group">
            <img
              src="/images/interior.jpg"
              alt="Interior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 to-transparent" />
            <div className="absolute bottom-6 right-6">
              <h3 className="text-2xl font-bold text-white">فضای داخلی</h3>
              <p className="text-coffee-300 text-sm">طراحی مدرن و دلنشین</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-72 relative group">
            <img
              src="/images/terrace.jpg"
              alt="Terrace"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 to-transparent" />
            <div className="absolute bottom-6 right-6">
              <h3 className="text-xl font-bold text-white">تراس روباز</h3>
              <p className="text-coffee-300 text-sm">لذت قهوه در هوای آزاد</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
