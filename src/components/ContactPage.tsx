import { Phone, MapPin, Clock, Mail, MessageCircle, Send, Camera } from 'lucide-react';
import { staffMembers } from '../data/mockData';

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-coffee-400 text-sm font-medium">تماس با ما</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            ارتباط <span className="text-coffee-400">با ما</span>
          </h2>
          <p className="text-coffee-300 max-w-xl mx-auto">
            ما همیشه آماده شنیدن نظرات و پیشنهادات شما هستیم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin size={22} className="text-coffee-400" />
                اطلاعات تماس
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coffee-700/50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">آدرس کافه</h4>
                    <p className="text-coffee-400 text-sm leading-relaxed">تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۲۴۵، کافه لانژ</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coffee-700/50 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">شماره تماس کافه</h4>
                    <p className="text-coffee-400 text-sm" dir="ltr">021-8876-5432</p>
                    <p className="text-coffee-400 text-sm" dir="ltr">0912-345-6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coffee-700/50 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">ساعات کاری</h4>
                    <p className="text-coffee-400 text-sm">شنبه تا چهارشنبه: ۱۰ صبح تا ۱۱ شب</p>
                    <p className="text-coffee-400 text-sm">پنجشنبه و جمعه: ۱۰ صبح تا ۱۲ شب</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coffee-700/50 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">ایمیل</h4>
                    <p className="text-coffee-400 text-sm" dir="ltr">info@cafelounge.ir</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-coffee-700/50">
                <h4 className="text-sm font-bold text-white mb-4">ما را در شبکه‌های اجتماعی دنبال کنید</h4>
                <div className="flex gap-3">
                  {[
                    { icon: <Camera size={20} />, label: 'Instagram', color: 'from-pink-500 to-purple-500' },
                    { icon: <Send size={20} />, label: 'Telegram', color: 'from-blue-400 to-blue-600' },
                    { icon: <MessageCircle size={20} />, label: 'WhatsApp', color: 'from-green-400 to-green-600' },
                  ].map((s, i) => (
                    <button key={i} className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white hover:scale-110 transition-transform`}>
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="glass-effect rounded-2xl p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">🗺️</div>
                <p className="text-coffee-400 text-sm">نقشه گوگل</p>
                <p className="text-coffee-500 text-xs mt-1">تهران، خیابان ولیعصر، پلاک ۲۴۵</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle size={22} className="text-coffee-400" />
              فرم تماس
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-coffee-300 mb-1 block">نام و نام خانوادگی</label>
                <input type="text" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" placeholder="نام شما" />
              </div>
              <div>
                <label className="text-sm text-coffee-300 mb-1 block">شماره تماس</label>
                <input type="tel" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" placeholder="۰۹۱۲..." dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-coffee-300 mb-1 block">ایمیل</label>
                <input type="email" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" placeholder="email@example.com" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-coffee-300 mb-1 block">موضوع</label>
                <select className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm">
                  <option>پیشنهاد</option>
                  <option>انتقاد</option>
                  <option>سوال</option>
                  <option>همکاری</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-coffee-300 mb-1 block">پیام شما</label>
                <textarea rows={5} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm resize-none" placeholder="پیام خود را بنویسید..." />
              </div>
              <button className="w-full btn-primary py-3.5 rounded-xl text-white font-bold text-sm">
                ارسال پیام
              </button>
            </div>
          </div>
        </div>

        {/* Staff Section */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-white mb-3">تیم <span className="text-coffee-400">ما</span></h3>
            <p className="text-coffee-400 text-sm">افرادی که تجربه بی‌نظیر کافه لانژ را می‌سازند</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {staffMembers.map(staff => (
              <div key={staff.id} className="glass-effect rounded-2xl p-6 text-center hover:bg-coffee-700/20 transition-all group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{staff.avatar}</div>
                <h4 className="text-lg font-bold text-white mb-1">{staff.name}</h4>
                <p className="text-coffee-400 text-sm mb-4">{staff.role}</p>
                <div className="flex items-center justify-center gap-2 text-coffee-500 text-sm">
                  <Phone size={14} />
                  <span dir="ltr">{staff.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
