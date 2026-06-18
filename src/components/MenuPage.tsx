import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, ShoppingCart, Plus, Minus, X, Star, Check, MapPin, Phone, User, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import type { MenuItem } from '../data/types';

interface MenuPageProps {
  cart: { item: MenuItem; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ item: MenuItem; qty: number }[]>>;
}

export default function MenuPage({ cart, setCart }: MenuPageProps) {
  const { menuItems, categories, addOrder, deliverySettings } = useApp();
  const [activeCategory, setActiveCategory] = useState('همه');
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout' | 'delivery'>('takeout');
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', tableNumber: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<{[k:string]:string}>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  const allCategories = ['همه', ...categories];

  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === 'همه' || item.category === activeCategory;
    const matchSearch = item.name.includes(search) || item.nameEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === id);
      if (existing && existing.qty > 1) return prev.map(c => c.item.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.item.id !== id);
    });
  };

  const totalCart = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const deliveryFee = orderType === 'delivery' ? deliverySettings.deliveryFee : 0;
  const finalTotal = totalCart + deliveryFee;

  const scrollSlider = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const validateOrder = () => {
    const errors: {[k:string]:string} = {};
    if (!orderForm.name.trim()) errors.name = 'نام الزامی است';
    if (!orderForm.phone.trim()) errors.phone = 'شماره تماس الزامی است';
    else if (!/^09\d{9}$/.test(orderForm.phone)) errors.phone = 'شماره معتبر نیست';
    if (orderType === 'delivery' && !orderForm.address.trim()) errors.address = 'آدرس الزامی است';
    if (orderType === 'dine-in' && !orderForm.tableNumber.trim()) errors.tableNumber = 'شماره میز الزامی است';
    else if (orderType === 'dine-in') {
      const n = parseInt(orderForm.tableNumber);
      if (!n || n < 1 || n > 12) errors.tableNumber = 'شماره میز ۱ تا ۱۲';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validateOrder()) return;

    const id = addOrder({
      items: cart,
      total: finalTotal,
      customerName: orderForm.name,
      phone: orderForm.phone,
      address: orderType === 'delivery' ? orderForm.address : undefined,
      tableNumber: orderType === 'dine-in' ? parseInt(orderForm.tableNumber) : undefined,
      type: orderType,
      status: 'pending',
      deliveryFee: orderType === 'delivery' ? deliverySettings.deliveryFee : 0,
    });

    setOrderId(id);
    setOrderSuccess(true);
    setCart([]);
  };

  const resetOrder = () => {
    setShowCart(false);
    setShowCheckout(false);
    setOrderSuccess(false);
    setOrderId(null);
    setOrderForm({ name: '', phone: '', address: '', tableNumber: '' });
    setFormErrors({});
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-coffee-400 text-sm font-medium">بهترین طعم‌ها</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">منوی <span className="text-coffee-400">کافه</span></h2>
        </div>

        {/* Search & Cart */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در منو..." className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 pr-12 pl-4 text-coffee-100 placeholder-coffee-500 text-sm" />
          </div>
          <button onClick={() => setShowCart(true)} className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 relative">
            <ShoppingCart size={20} />
            سبد خرید
            {totalItems > 0 && <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">{totalItems}</span>}
          </button>
        </div>

        {/* Categories */}
        <div className="relative mb-10">
          <button onClick={() => scrollSlider('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-coffee-700/80 text-coffee-200 flex items-center justify-center hover:bg-coffee-600"><ChevronRight size={20} /></button>
          <div ref={sliderRef} className="flex gap-3 overflow-x-auto px-12 py-2" style={{ scrollbarWidth: 'none' }}>
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'btn-primary text-white shadow-lg' : 'bg-coffee-800/50 text-coffee-400 border border-coffee-700 hover:border-coffee-500'}`}>{cat}</button>
            ))}
          </div>
          <button onClick={() => scrollSlider('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-coffee-700/80 text-coffee-200 flex items-center justify-center hover:bg-coffee-600"><ChevronLeft size={20} /></button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const inCart = cart.find(c => c.item.id === item.id);
            return (
              <div key={item.id} className="menu-card glass-effect rounded-2xl overflow-hidden transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-coffee-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-coffee-300">{item.category}</div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-coffee-900/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star size={12} className="text-gold-400 fill-gold-400" /><span className="text-xs text-coffee-200">۴.۸</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-xs text-coffee-500">{item.nameEn}</p>
                    </div>
                    <span className="text-coffee-300 font-bold text-sm whitespace-nowrap">{formatPrice(item.price)}</span>
                  </div>
                  <p className="text-coffee-400 text-sm mb-4">{item.description}</p>
                  {inCart ? (
                    <div className="flex items-center justify-between bg-coffee-700/30 rounded-xl px-4 py-2">
                      <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-coffee-500 text-white flex items-center justify-center"><Plus size={16} /></button>
                      <span className="text-white font-bold">{inCart.qty}</span>
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-coffee-700 text-coffee-300 flex items-center justify-center hover:bg-red-600 hover:text-white"><Minus size={16} /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item)} className="w-full btn-primary py-2.5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2"><Plus size={16} />افزودن به سبد</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="text-center py-20"><span className="text-6xl mb-4 block">🔍</span><p className="text-coffee-400 text-lg">موردی یافت نشد</p></div>}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => !showCheckout && resetOrder()} />
          <div className="relative mr-auto w-full max-w-md bg-coffee-900 h-full overflow-y-auto animate-slideInLeft border-r border-coffee-700">

            {orderSuccess ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"><Check size={48} className="text-green-400" /></div>
                <h3 className="text-2xl font-black text-white mb-3">سفارش ثبت شد! 🎉</h3>
                <p className="text-coffee-300 mb-2">شماره سفارش:</p>
                <p className="text-3xl font-black text-coffee-400 mb-2">#{orderId}</p>
                {orderType === 'dine-in' && <p className="text-coffee-400 text-sm mb-6">میز {orderForm.tableNumber} - {orderForm.name}</p>}
                {orderType === 'takeout' && <p className="text-coffee-400 text-sm mb-6">بیرون‌بر - {orderForm.name}</p>}
                {orderType === 'delivery' && <p className="text-coffee-400 text-sm mb-6">ارسال - {orderForm.name}</p>}
                <button onClick={resetOrder} className="btn-primary px-8 py-3 rounded-xl text-white font-medium">بازگشت به منو</button>
              </div>
            ) : showCheckout ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">اطلاعات سفارش</h3>
                  <button onClick={() => setShowCheckout(false)} className="text-coffee-400 hover:text-white"><X size={24} /></button>
                </div>

                {/* Order Type */}
                <div className="flex gap-2 mb-6">
                  {[
                    { type: 'dine-in' as const, label: '🪑 داخل سالن', active: orderType === 'dine-in' },
                    { type: 'takeout' as const, label: '🥡 بیرون‌بر', active: orderType === 'takeout' },
                    { type: 'delivery' as const, label: '🛵 ارسال', active: orderType === 'delivery' },
                  ].map(t => (
                    <button key={t.type} onClick={() => { setOrderType(t.type); setFormErrors({}); }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${t.active ? 'btn-primary text-white' : 'bg-coffee-800/50 text-coffee-400 border border-coffee-700'}`}
                    >{t.label}</button>
                  ))}
                </div>

                <div className="space-y-4">
                  {/* Table Number for dine-in */}
                  {orderType === 'dine-in' && (
                    <div>
                      <label className="text-sm text-coffee-300 mb-1 block">شماره میز *</label>
                      <div className="relative">
                        <Hash size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                        <input type="number" value={orderForm.tableNumber} onChange={e => { setOrderForm({ ...orderForm, tableNumber: e.target.value }); setFormErrors(p => ({...p, tableNumber: ''})); }} placeholder="مثال: 5" min={1} max={12}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${formErrors.tableNumber ? 'border-red-500' : 'border-coffee-700'}`} />
                      </div>
                      {formErrors.tableNumber && <p className="text-red-400 text-xs mt-1">{formErrors.tableNumber}</p>}
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-coffee-300 mb-1 block">نام و نام خانوادگی *</label>
                    <div className="relative">
                      <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                      <input type="text" value={orderForm.name} onChange={e => { setOrderForm({ ...orderForm, name: e.target.value }); setFormErrors(p => ({...p, name: ''})); }} placeholder="نام شما"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${formErrors.name ? 'border-red-500' : 'border-coffee-700'}`} />
                    </div>
                    {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="text-sm text-coffee-300 mb-1 block">شماره تماس *</label>
                    <div className="relative">
                      <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                      <input type="tel" value={orderForm.phone} onChange={e => { setOrderForm({ ...orderForm, phone: e.target.value }); setFormErrors(p => ({...p, phone: ''})); }} placeholder="09121234567" dir="ltr"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${formErrors.phone ? 'border-red-500' : 'border-coffee-700'}`} />
                    </div>
                    {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="text-sm text-coffee-300 mb-1 block">آدرس *</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute right-4 top-3 text-coffee-500" />
                        <textarea value={orderForm.address} onChange={e => { setOrderForm({ ...orderForm, address: e.target.value }); setFormErrors(p => ({...p, address: ''})); }} placeholder="آدرس کامل..." rows={3}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm resize-none ${formErrors.address ? 'border-red-500' : 'border-coffee-700'}`} />
                      </div>
                      {formErrors.address && <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-coffee-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3">خلاصه سفارش</h4>
                  {cart.map(c => (
                    <div key={c.item.id} className="flex justify-between text-sm text-coffee-300 py-1">
                      <span>{c.item.name} × {c.qty}</span>
                      <span>{formatPrice(c.item.price * c.qty)}</span>
                    </div>
                  ))}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm text-coffee-400 py-1 border-t border-coffee-700 mt-2 pt-2">
                      <span>هزینه ارسال</span><span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <hr className="border-coffee-700 my-2" />
                  <div className="flex justify-between font-bold text-white">
                    <span>مجموع:</span><span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button onClick={handleSubmitOrder} className="w-full btn-primary py-3.5 rounded-xl text-white font-bold text-lg mt-6">ثبت سفارش ✓</button>
              </div>
            ) : (
              <>
                <div className="sticky top-0 bg-coffee-900 p-6 border-b border-coffee-700 z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart size={22} />سبد خرید</h3>
                    <button onClick={resetOrder} className="text-coffee-400 hover:text-white"><X size={24} /></button>
                  </div>
                </div>
                <div className="p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-16"><span className="text-6xl block mb-4">🛒</span><p className="text-coffee-400">سبد خرید خالی است</p></div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(c => (
                        <div key={c.item.id} className="flex items-center gap-4 bg-coffee-800/50 rounded-xl p-3">
                          <img src={c.item.image} alt={c.item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">{c.item.name}</h4>
                            <p className="text-xs text-coffee-400">{formatPrice(c.item.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => addToCart(c.item)} className="w-7 h-7 rounded-lg bg-coffee-600 text-white flex items-center justify-center text-xs"><Plus size={14} /></button>
                            <span className="text-white font-bold text-sm w-6 text-center">{c.qty}</span>
                            <button onClick={() => removeFromCart(c.item.id)} className="w-7 h-7 rounded-lg bg-coffee-700 text-coffee-300 flex items-center justify-center text-xs hover:bg-red-600 hover:text-white"><Minus size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="sticky bottom-0 bg-coffee-900 p-6 border-t border-coffee-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-coffee-300">مجموع:</span>
                      <span className="text-xl font-black text-white">{formatPrice(totalCart)}</span>
                    </div>
                    <button onClick={() => setShowCheckout(true)} className="w-full btn-primary py-3.5 rounded-xl text-white font-bold text-lg">ادامه و ثبت سفارش</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
