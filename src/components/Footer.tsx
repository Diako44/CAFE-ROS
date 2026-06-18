import { Coffee, Phone, MapPin, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-coffee-900 border-t border-coffee-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center">
                <Coffee size={24} className="text-coffee-50" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-coffee-100">کافه لانژ</h3>
                <p className="text-xs text-coffee-500">Café Lounge</p>
              </div>
            </div>
            <p className="text-coffee-400 text-sm leading-relaxed">
              با بیش از ۱۰ سال تجربه، کافه لانژ بهترین تجربه نوشیدن قهوه را در فضایی دلنشین و مدرن برای شما فراهم می‌کند.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">لینک‌های سریع</h4>
            <ul className="space-y-3">
              {['صفحه اصلی', 'منوی کافه', 'رزرو میز', 'باشگاه مشتریان', 'ارتباط با ما'].map(link => (
                <li key={link}>
                  <span className="text-coffee-400 text-sm hover:text-coffee-200 cursor-pointer transition-colors">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">تماس با ما</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-coffee-400 text-sm">
                <Phone size={16} className="text-coffee-500 flex-shrink-0" />
                <span dir="ltr">021-8876-5432</span>
              </div>
              <div className="flex items-start gap-3 text-coffee-400 text-sm">
                <MapPin size={16} className="text-coffee-500 flex-shrink-0 mt-1" />
                <span>تهران، خیابان ولیعصر، پلاک ۲۴۵</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-400 text-sm">
                <Clock size={16} className="text-coffee-500 flex-shrink-0" />
                <span>هر روز ۱۰ صبح تا ۱۱ شب</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">خبرنامه</h4>
            <p className="text-coffee-400 text-sm mb-4">برای دریافت آخرین اخبار و تخفیف‌ها ثبت‌نام کنید</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                dir="ltr"
                className="flex-1 bg-coffee-800/50 border border-coffee-700 rounded-xl py-2.5 px-4 text-coffee-100 text-sm"
              />
              <button className="btn-primary px-4 py-2.5 rounded-xl text-white text-sm font-medium">
                ثبت
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-coffee-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-coffee-500 text-xs flex items-center gap-1">
              ساخته شده با <Heart size={12} className="text-red-400 fill-red-400" /> برای کافه لانژ
            </p>
            <p className="text-coffee-600 text-xs">
              © ۱۴۰۳ تمامی حقوق محفوظ است
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
