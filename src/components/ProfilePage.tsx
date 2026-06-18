import { useState, useEffect } from 'react';
import { User, MapPin, Award, ShoppingBag, Edit3, Save, Gift, Star, TrendingUp, LogOut, MessageSquare, Check, X } from 'lucide-react';
import { formatPrice } from '../data/mockData';

interface ProfilePageProps {
  onLogout: () => void;
}

interface Review {
  id: number;
  rating: number;
  text: string;
  date: string;
  rewardClaimed: boolean;
  rewardCode?: string;
}

const REVIEW_STORAGE_KEY = 'cafe_lounge_user_review';

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editAddress, setEditAddress] = useState(false);
  const [address, setAddress] = useState('تهران، خیابان ولیعصر، پلاک ۱۲۰، واحد ۳');
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  // Load existing review from localStorage
  useEffect(() => {
    const savedReview = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (savedReview) {
      const review = JSON.parse(savedReview) as Review;
      setExistingReview(review);
      setHasReviewed(true);
    }
  }, []);

  const user = {
    name: 'مریم کاظمی',
    phone: '09131112222',
    email: 'maryam@email.com',
    level: 'gold' as const,
    points: 15000,
    totalSpent: 45000000,
    joinDate: '1402/01/15',
    orders: 142,
  };

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'gold': return { label: 'طلایی', color: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: '👑', discount: '۱۵٪', nextLevel: null, progress: 100 };
      case 'silver': return { label: 'نقره‌ای', color: 'from-gray-300 to-gray-500', textColor: 'text-gray-300', bgColor: 'bg-gray-500/10', icon: '🥈', discount: '۱۰٪', nextLevel: 'gold', progress: 65 };
      case 'bronze': return { label: 'برنزی', color: 'from-orange-400 to-orange-700', textColor: 'text-orange-400', bgColor: 'bg-orange-500/10', icon: '🥉', discount: '۵٪', nextLevel: 'silver', progress: 30 };
      default: return { label: 'عادی', color: 'from-coffee-400 to-coffee-600', textColor: 'text-coffee-400', bgColor: 'bg-coffee-500/10', icon: '☕', discount: '۰٪', nextLevel: 'bronze', progress: 10 };
    }
  };

  const levelInfo = getLevelInfo(user.level);

  const orderHistory = [
    { id: 1, date: '1403/02/20', items: 'کاپوچینو × ۲، چیزکیک', total: 290000, status: 'delivered' },
    { id: 2, date: '1403/02/18', items: 'لاته، تیرامیسو', total: 220000, status: 'delivered' },
    { id: 3, date: '1403/02/15', items: 'اسپرسو × ۳', total: 195000, status: 'delivered' },
    { id: 4, date: '1403/02/12', items: 'موکا، کروسان × ۲', total: 265000, status: 'delivered' },
    { id: 5, date: '1403/02/10', items: 'آیس لاته، براونی', total: 190000, status: 'delivered' },
  ];

  const discountCodes = [
    { code: 'GOLD15', discount: '۱۵٪', expiry: '1403/03/31', used: false },
    { code: 'BDAY20', discount: '۲۰٪', expiry: '1403/02/28', used: false },
    ...(existingReview?.rewardCode ? [{ code: existingReview.rewardCode, discount: '۱۰٪', expiry: '1403/04/30', used: false }] : []),
  ];

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: <User size={18} /> },
    { id: 'club', label: 'باشگاه مشتریان', icon: <Award size={18} /> },
    { id: 'reviews', label: 'نظرات و جوایز', icon: <MessageSquare size={18} /> },
    { id: 'orders', label: 'سفارشات', icon: <ShoppingBag size={18} /> },
    { id: 'address', label: 'آدرس‌ها', icon: <MapPin size={18} /> },
  ];

  const generateDiscountCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'REV';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewText.length < 10 || hasReviewed) return;
    
    const code = generateDiscountCode();
    const newReview: Review = {
      id: Date.now(),
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('fa-IR'),
      rewardClaimed: true,
      rewardCode: code,
    };
    
    // Save to localStorage (one review per user)
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(newReview));
    
    setExistingReview(newReview);
    setHasReviewed(true);
    setGeneratedCode(code);
    setReviewSubmitted(true);
  };

  const resetReviewForm = () => {
    setShowReviewForm(false);
    setReviewSubmitted(false);
    setReviewRating(5);
    setReviewText('');
    setGeneratedCode('');
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-800 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-4xl shadow-xl`}>
              {levelInfo.icon}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
              <p className="text-coffee-400 text-sm mb-3" dir="ltr">{user.phone} | {user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${levelInfo.bgColor} ${levelInfo.textColor} border border-current`}>
                  عضو {levelInfo.label} {levelInfo.icon}
                </span>
                <span className="text-coffee-500 text-xs">عضویت از {user.joinDate}</span>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 text-sm">
              <LogOut size={16} />
              خروج
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'امتیاز', value: user.points.toLocaleString('fa-IR'), icon: <Star size={20} className="text-yellow-400" /> },
              { label: 'تخفیف فعال', value: levelInfo.discount, icon: <Gift size={20} className="text-green-400" /> },
              { label: 'سفارشات', value: user.orders.toString(), icon: <ShoppingBag size={20} className="text-blue-400" /> },
              { label: 'مبلغ کل', value: formatPrice(user.totalSpent), icon: <TrendingUp size={20} className="text-purple-400" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-coffee-800/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-coffee-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'btn-primary text-white' : 'bg-coffee-800/50 text-coffee-400 border border-coffee-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">اطلاعات حساب</h3>
              <div className="space-y-4">
                {[
                  { label: 'نام', value: user.name },
                  { label: 'تلفن', value: user.phone },
                  { label: 'ایمیل', value: user.email },
                  { label: 'تاریخ عضویت', value: user.joinDate },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-coffee-700/30">
                    <span className="text-coffee-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">آخرین سفارشات</h3>
              <div className="space-y-3">
                {orderHistory.slice(0, 3).map(order => (
                  <div key={order.id} className="bg-coffee-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-coffee-400 text-xs">{order.date}</span>
                      <span className="text-green-400 text-xs">تحویل شده ✓</span>
                    </div>
                    <p className="text-white text-sm mb-1">{order.items}</p>
                    <p className="text-coffee-300 text-sm font-bold">{formatPrice(order.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'club' && (
          <div className="space-y-6">
            {/* Level Card */}
            <div className={`rounded-2xl p-8 bg-gradient-to-br ${levelInfo.color} relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-4 left-4 text-8xl opacity-30">☕</div>
                <div className="absolute bottom-4 right-4 text-6xl opacity-20">⭐</div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">کارت عضویت {levelInfo.label}</h3>
                    <p className="text-white/80 text-sm">کافه لانژ</p>
                  </div>
                  <div className="text-5xl">{levelInfo.icon}</div>
                </div>
                <p className="text-white font-bold text-lg mb-1">{user.name}</p>
                <p className="text-white/70 text-sm" dir="ltr">{user.phone}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <span className="text-white/70 text-xs">امتیاز</span>
                    <p className="text-white font-bold text-xl">{user.points.toLocaleString('fa-IR')}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-xs">تخفیف</span>
                    <p className="text-white font-bold text-xl">{levelInfo.discount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Codes */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Gift size={20} className="text-green-400" />
                کدهای تخفیف
              </h3>
              <div className="space-y-3">
                {discountCodes.map((code, i) => (
                  <div key={i} className={`flex items-center justify-between bg-coffee-800/50 rounded-xl p-4`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-lg font-bold text-coffee-200" dir="ltr">{code.code}</span>
                      </div>
                      <p className="text-xs text-coffee-500">اعتبار تا {code.expiry}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-green-400">{code.discount}</span>
                      <p className="text-xs text-coffee-500">تخفیف</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews & Rewards Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reward Banner */}
            <div className={`glass-effect rounded-2xl p-6 ${hasReviewed ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-600/30' : 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-600/30'} border`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${hasReviewed ? 'from-green-500 to-emerald-600' : 'from-amber-500 to-orange-600'} flex items-center justify-center text-4xl flex-shrink-0`}>
                  {hasReviewed ? '✅' : '🎁'}
                </div>
                <div className="flex-1 text-center md:text-right">
                  {hasReviewed ? (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">ممنون از نظر شما! 🎉</h3>
                      <p className="text-coffee-300 text-sm">
                        شما قبلاً نظر خود را ثبت کرده‌اید و کد تخفیف دریافت کرده‌اید.
                        <br />
                        <span className="text-green-400 font-bold">هر کاربر فقط یکبار می‌تواند کد تخفیف نظرات دریافت کند.</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">نظر بدهید، تخفیف بگیرید! 🎉</h3>
                      <p className="text-coffee-300 text-sm mb-4">
                        با ثبت نظر خود درباره کافه لانژ، یک کد تخفیف <span className="text-green-400 font-bold">۱۰٪</span> هدیه بگیرید!
                        <br />
                        <span className="text-amber-400 text-xs">⚠️ توجه: هر کاربر فقط یکبار می‌تواند از این جایزه استفاده کند.</span>
                      </p>
                      {!showReviewForm && (
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="btn-primary px-6 py-2.5 rounded-xl text-white font-medium"
                        >
                          ثبت نظر و دریافت تخفیف ✍️
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && !hasReviewed && (
              <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                {reviewSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check size={48} className="text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">ممنون از نظر شما! 🎉</h3>
                    <p className="text-coffee-300 mb-6">کد تخفیف ۱۰٪ شما:</p>
                    <div className="inline-block bg-coffee-800 rounded-xl px-8 py-4 mb-6">
                      <span className="font-mono text-3xl font-black text-green-400" dir="ltr">{generatedCode}</span>
                    </div>
                    <p className="text-coffee-500 text-sm mb-6">این کد به لیست تخفیف‌های شما اضافه شد</p>
                    <button
                      onClick={resetReviewForm}
                      className="btn-primary px-6 py-2.5 rounded-xl text-white font-medium"
                    >
                      بستن
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">ثبت نظر جدید</h3>
                      <button onClick={resetReviewForm} className="text-coffee-400 hover:text-white">
                        <X size={20} />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                      <label className="text-sm text-coffee-300 mb-3 block">امتیاز شما</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-3xl transition-transform hover:scale-110 ${
                              star <= reviewRating ? 'text-yellow-400' : 'text-coffee-700'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                        <span className="text-coffee-400 text-sm mr-3">{reviewRating} از ۵</span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                      <label className="text-sm text-coffee-300 mb-2 block">نظر شما (حداقل ۱۰ کاراکتر)</label>
                      <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        rows={4}
                        placeholder="تجربه خود از کافه لانژ را با ما به اشتراک بگذارید..."
                        className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm resize-none"
                      />
                      <p className="text-coffee-500 text-xs mt-1">{reviewText.length} / حداقل ۱۰ کاراکتر</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={resetReviewForm}
                        className="flex-1 py-3 rounded-xl border border-coffee-600 text-coffee-300 font-medium hover:bg-coffee-800/50"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewText.length < 10}
                        className="flex-1 btn-primary py-3 rounded-xl text-white font-medium disabled:opacity-50"
                      >
                        ثبت و دریافت کد تخفیف 🎁
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Previous Review */}
            {existingReview && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-coffee-400" />
                  نظر ثبت شده شما
                </h3>

                <div className="bg-coffee-800/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < existingReview.rating ? 'text-yellow-400' : 'text-coffee-700'}>⭐</span>
                      ))}
                    </div>
                    <span className="text-coffee-500 text-xs">{existingReview.date}</span>
                  </div>
                  <p className="text-coffee-200 text-sm mb-3">{existingReview.text}</p>
                  {existingReview.rewardCode && (
                    <div className="flex items-center gap-2 pt-3 border-t border-coffee-700/30">
                      <Gift size={16} className="text-green-400" />
                      <span className="text-coffee-400 text-xs">کد تخفیف دریافتی:</span>
                      <span className="font-mono text-sm font-bold text-green-400">{existingReview.rewardCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">تاریخچه سفارشات</h3>
            <div className="space-y-3">
              {orderHistory.map(order => (
                <div key={order.id} className="bg-coffee-800/50 rounded-xl p-5 hover:bg-coffee-700/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-coffee-500 text-sm">#{order.id}</span>
                        <span className="text-coffee-400 text-sm">{order.date}</span>
                      </div>
                      <p className="text-white text-sm">{order.items}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-white">{formatPrice(order.total)}</span>
                      <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        ✓ تحویل شده
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="glass-effect rounded-2xl p-6 max-w-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-coffee-400" />
              آدرس سفارشات بیرون‌بر
            </h3>

            <div className="bg-coffee-800/50 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏠</span>
                  <span className="text-sm font-bold text-white">آدرس اصلی</span>
                </div>
                <button
                  onClick={() => setEditAddress(!editAddress)}
                  className="text-coffee-400 hover:text-coffee-200 transition-colors"
                >
                  {editAddress ? <Save size={18} /> : <Edit3 size={18} />}
                </button>
              </div>

              {editAddress ? (
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-coffee-900/50 border border-coffee-600 rounded-xl py-3 px-4 text-coffee-100 text-sm resize-none"
                />
              ) : (
                <p className="text-coffee-300 text-sm leading-relaxed">{address}</p>
              )}

              {editAddress && (
                <button
                  onClick={() => setEditAddress(false)}
                  className="mt-4 btn-primary px-6 py-2 rounded-xl text-white text-sm font-medium"
                >
                  ذخیره آدرس
                </button>
              )}
            </div>

            <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-coffee-600 text-coffee-400 text-sm hover:border-coffee-400 hover:text-coffee-200 transition-colors">
              + افزودن آدرس جدید
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
