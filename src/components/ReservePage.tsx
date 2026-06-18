import { useState } from 'react';
import { Users, MapPin, Bell, CreditCard, FileText, CheckCircle, Coffee, Check, Phone, User, Hash, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import type { Table, MenuItem } from '../data/types';

export default function ReservePage() {
  const { tables, menuItems, addReservation, addNotification, addBillRequest } = useApp();
  
  // Main mode: 'choose' lets user pick between new reservation or existing table actions
  const [mainMode, setMainMode] = useState<'choose' | 'reserve' | 'table-actions'>('choose');
  
  // Reservation steps
  const [step, setStep] = useState<'select' | 'form' | 'menu' | 'confirmed'>('select');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedFloor, setSelectedFloor] = useState('همه');
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '', guests: 2 });
  const [orderItems, setOrderItems] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Table actions (for existing customers)
  const [tableNumber, setTableNumber] = useState('');
  const [tableError, setTableError] = useState('');
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tableOrderItems, setTableOrderItems] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const floors = ['همه', 'طبقه همکف', 'طبقه اول', 'تراس'];

  const filteredTables = tables.filter(t => selectedFloor === 'همه' || t.floor === selectedFloor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600/20 border-green-500 text-green-400';
      case 'reserved': return 'bg-yellow-600/20 border-yellow-500 text-yellow-400';
      case 'occupied': return 'bg-red-600/20 border-red-500 text-red-400';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'آزاد';
      case 'reserved': return 'رزرو شده';
      case 'occupied': return 'اشغال';
      default: return '';
    }
  };

  const addOrderItem = (item: MenuItem, isTableOrder = false) => {
    const setter = isTableOrder ? setTableOrderItems : setOrderItems;
    setter(prev => {
      const existing = prev.find(o => o.item.id === item.id);
      if (existing) return prev.map(o => o.item.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeOrderItem = (id: number, isTableOrder = false) => {
    const setter = isTableOrder ? setTableOrderItems : setOrderItems;
    setter(prev => {
      const existing = prev.find(o => o.item.id === id);
      if (existing && existing.qty > 1) return prev.map(o => o.item.id === id ? { ...o, qty: o.qty - 1 } : o);
      return prev.filter(o => o.item.id !== id);
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'نام الزامی است';
    if (!formData.phone.trim()) newErrors.phone = 'شماره تماس الزامی است';
    else if (!/^09\d{9}$/.test(formData.phone)) newErrors.phone = 'شماره تماس معتبر نیست';
    if (!formData.date) newErrors.date = 'تاریخ الزامی است';
    if (!formData.time) newErrors.time = 'ساعت الزامی است';
    if (formData.guests < 1 || formData.guests > (selectedTable?.capacity || 10)) {
      newErrors.guests = `تعداد مهمان باید بین ۱ تا ${selectedTable?.capacity} باشد`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReservation = () => {
    if (!selectedTable) return;

    const id = addReservation({
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      floor: selectedTable.floor,
      customerName: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      preOrderItems: orderItems,
      status: 'confirmed',
    });

    setReservationId(id);
    setStep('confirmed');
  };

  const handleFindTable = () => {
    const num = parseInt(tableNumber);
    if (!num || num < 1 || num > 12) {
      setTableError('شماره میز معتبر نیست (۱ تا ۱۲)');
      return;
    }

    const table = tables.find(t => t.number === num);
    if (!table) {
      setTableError('میز یافت نشد');
      return;
    }

    if (table.status === 'available') {
      setTableError('این میز رزرو نشده است. لطفاً ابتدا رزرو کنید.');
      return;
    }

    setActiveTable(table);
    setTableError('');
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    addNotification(`گارسون به میز ${activeTable?.number || tableNumber} صدا زده شد`, 'waiter');
    setTimeout(() => setWaiterCalled(false), 5000);
  };

  const handleRequestBill = () => {
    setBillRequested(true);
    const tableNum = activeTable?.number || parseInt(tableNumber);
    if (tableNum) {
      addBillRequest(tableNum);
    }
    setTimeout(() => setBillRequested(false), 5000);
  };

  const handleSubmitTableOrder = () => {
    if (tableOrderItems.length === 0) return;
    addNotification(`سفارش جدید میز ${activeTable?.number}: ${tableOrderItems.map(o => `${o.item.name}×${o.qty}`).join('، ')}`, 'order');
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setTableOrderItems([]);
      setShowTableMenu(false);
    }, 3000);
  };

  const resetReservation = () => {
    setMainMode('choose');
    setStep('select');
    setSelectedTable(null);
    setOrderItems([]);
    setFormData({ name: '', phone: '', date: '', time: '', guests: 2 });
    setReservationId(null);
    setErrors({});
  };

  const resetTableActions = () => {
    setMainMode('choose');
    setActiveTable(null);
    setTableNumber('');
    setTableError('');
    setTableOrderItems([]);
    setShowTableMenu(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-coffee-400 text-sm font-medium">خدمات میز</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            رزرو و <span className="text-coffee-400">سرویس میز</span>
          </h2>
          <p className="text-coffee-300 max-w-xl mx-auto">
            رزرو میز جدید یا درخواست خدمات برای میز فعلی خود
          </p>
        </div>

        {/* Main Mode Selection */}
        {mainMode === 'choose' && (
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Reservation */}
              <button
                onClick={() => setMainMode('reserve')}
                className="glass-effect rounded-2xl p-8 text-center hover:bg-coffee-700/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🪑</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">رزرو میز جدید</h3>
                <p className="text-coffee-400 text-sm">میز مورد نظر خود را انتخاب و رزرو کنید</p>
              </button>

              {/* Table Actions */}
              <button
                onClick={() => setMainMode('table-actions')}
                className="glass-effect rounded-2xl p-8 text-center hover:bg-coffee-700/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🔔</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">خدمات میز</h3>
                <p className="text-coffee-400 text-sm">پیج گارسون، سفارش جدید یا درخواست صورتحساب</p>
              </button>
            </div>
          </div>
        )}

        {/* Table Actions Mode */}
        {mainMode === 'table-actions' && !activeTable && (
          <div className="max-w-md mx-auto">
            <div className="glass-effect rounded-2xl p-8">
              <button onClick={resetTableActions} className="flex items-center gap-2 text-coffee-400 hover:text-white mb-6 text-sm">
                <ArrowRight size={16} />
                بازگشت
              </button>

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-white mb-2">شماره میز خود را وارد کنید</h3>
                <p className="text-coffee-400 text-sm">برای دریافت خدمات، شماره میز خود را وارد کنید</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-coffee-300 mb-1 block">شماره میز</label>
                  <div className="relative">
                    <Hash size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                    <input
                      type="number"
                      value={tableNumber}
                      onChange={e => { setTableNumber(e.target.value); setTableError(''); }}
                      placeholder="مثال: 5"
                      min={1}
                      max={12}
                      className={`w-full bg-coffee-800/50 border rounded-xl py-4 pr-12 pl-4 text-coffee-100 text-lg text-center font-bold ${
                        tableError ? 'border-red-500' : 'border-coffee-700'
                      }`}
                    />
                  </div>
                  {tableError && <p className="text-red-400 text-xs mt-2 text-center">{tableError}</p>}
                </div>

                <button
                  onClick={handleFindTable}
                  disabled={!tableNumber}
                  className="w-full btn-primary py-3.5 rounded-xl text-white font-bold disabled:opacity-50"
                >
                  ادامه
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Table Actions */}
        {mainMode === 'table-actions' && activeTable && !showTableMenu && (
          <div className="max-w-lg mx-auto">
            <div className="glass-effect rounded-2xl p-8">
              <button onClick={() => setActiveTable(null)} className="flex items-center gap-2 text-coffee-400 hover:text-white mb-6 text-sm">
                <ArrowRight size={16} />
                تغییر میز
              </button>

              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-coffee-500 to-coffee-700 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🪑</span>
                </div>
                <h3 className="text-2xl font-black text-white">میز {activeTable.number}</h3>
                <p className="text-coffee-400 text-sm">{activeTable.floor} • {activeTable.capacity} نفره</p>
              </div>

              <div className="space-y-4">
                {/* Call Waiter */}
                <button
                  onClick={handleCallWaiter}
                  disabled={waiterCalled}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                    waiterCalled
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-600/40'
                  }`}
                >
                  <Bell size={24} />
                  {waiterCalled ? '✓ گارسون در راه است...' : 'پیج گارسون'}
                </button>

                {/* New Order */}
                <button
                  onClick={() => setShowTableMenu(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg bg-coffee-600/20 border-2 border-coffee-500 text-coffee-300 hover:bg-coffee-600/40 transition-all"
                >
                  <Coffee size={24} />
                  سفارش جدید از منو
                </button>

                {/* Request Bill */}
                <button
                  onClick={handleRequestBill}
                  disabled={billRequested}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                    billRequested
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600/20 border-2 border-blue-500 text-blue-400 hover:bg-blue-600/40'
                  }`}
                >
                  <CreditCard size={24} />
                  {billRequested ? '✓ صورتحساب آماده می‌شود...' : 'درخواست صورتحساب'}
                </button>
              </div>

              <button
                onClick={resetTableActions}
                className="w-full mt-6 py-3 rounded-xl border border-coffee-600 text-coffee-400 text-sm hover:bg-coffee-800/50"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          </div>
        )}

        {/* Table Menu Order */}
        {mainMode === 'table-actions' && activeTable && showTableMenu && (
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">سفارش جدید - میز {activeTable.number}</h3>
                  <p className="text-coffee-400 text-sm">آیتم‌های مورد نظر را انتخاب کنید</p>
                </div>
                <button onClick={() => setShowTableMenu(false)} className="text-coffee-400 hover:text-white">
                  ✕
                </button>
              </div>

              {orderSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">سفارش ثبت شد! 🎉</h4>
                  <p className="text-coffee-400">سفارش شما به آشپزخانه ارسال شد</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                    {menuItems.filter(m => m.available).map(item => {
                      const inOrder = tableOrderItems.find(o => o.item.id === item.id);
                      return (
                        <div key={item.id} className="flex items-center gap-3 bg-coffee-800/50 rounded-xl p-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            <p className="text-xs text-coffee-400">{formatPrice(item.price)}</p>
                          </div>
                          {inOrder ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => addOrderItem(item, true)} className="w-7 h-7 rounded bg-coffee-500 text-white flex items-center justify-center text-xs">+</button>
                              <span className="text-white text-sm font-bold w-5 text-center">{inOrder.qty}</span>
                              <button onClick={() => removeOrderItem(item.id, true)} className="w-7 h-7 rounded bg-coffee-700 text-coffee-300 flex items-center justify-center text-xs">−</button>
                            </div>
                          ) : (
                            <button onClick={() => addOrderItem(item, true)} className="px-3 py-1.5 rounded-lg bg-coffee-600 text-white text-xs hover:bg-coffee-500">
                              افزودن
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {tableOrderItems.length > 0 && (
                    <div className="bg-coffee-800/50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-bold text-white mb-3">سفارش شما</h4>
                      {tableOrderItems.map(o => (
                        <div key={o.item.id} className="flex justify-between text-sm text-coffee-300 py-1">
                          <span>{o.item.name} × {o.qty}</span>
                          <span>{formatPrice(o.item.price * o.qty)}</span>
                        </div>
                      ))}
                      <hr className="border-coffee-700 my-2" />
                      <div className="flex justify-between font-bold text-white">
                        <span>مجموع:</span>
                        <span>{formatPrice(tableOrderItems.reduce((s, o) => s + o.item.price * o.qty, 0))}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setShowTableMenu(false)} className="flex-1 py-3 rounded-xl border border-coffee-600 text-coffee-300 font-medium hover:bg-coffee-800/50">
                      انصراف
                    </button>
                    <button
                      onClick={handleSubmitTableOrder}
                      disabled={tableOrderItems.length === 0}
                      className="flex-1 btn-primary py-3 rounded-xl text-white font-medium disabled:opacity-50"
                    >
                      ثبت سفارش ({tableOrderItems.length} آیتم)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reservation Mode */}
        {mainMode === 'reserve' && (
          <>
            {/* Back Button */}
            {step === 'select' && (
              <div className="max-w-7xl mx-auto mb-6">
                <button onClick={resetReservation} className="flex items-center gap-2 text-coffee-400 hover:text-white text-sm">
                  <ArrowRight size={16} />
                  بازگشت
                </button>
              </div>
            )}

            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-2 mb-12">
              {[
                { id: 'select', label: 'انتخاب میز', icon: <MapPin size={18} /> },
                { id: 'form', label: 'اطلاعات', icon: <FileText size={18} /> },
                { id: 'menu', label: 'پیش‌سفارش', icon: <Coffee size={18} /> },
                { id: 'confirmed', label: 'تایید', icon: <CheckCircle size={18} /> },
              ].map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                    step === s.id ? 'btn-primary text-white' :
                    ['select', 'form', 'menu', 'confirmed'].indexOf(step) > i ? 'bg-green-600/20 text-green-400' :
                    'bg-coffee-800/50 text-coffee-500'
                  }`}>
                    {s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < 3 && <div className="w-8 h-0.5 bg-coffee-700" />}
                </div>
              ))}
            </div>

            {/* Step: Select Table */}
            {step === 'select' && (
              <div>
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {floors.map(floor => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedFloor === floor ? 'btn-primary text-white' : 'bg-coffee-800/50 text-coffee-400 border border-coffee-700'
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500/30 border border-green-500" /><span className="text-xs text-coffee-400">آزاد</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500" /><span className="text-xs text-coffee-400">رزرو شده</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500/30 border border-red-500" /><span className="text-xs text-coffee-400">اشغال</span></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTables.map(table => (
                    <button
                      key={table.id}
                      onClick={() => {
                        if (table.status === 'available') {
                          setSelectedTable(table);
                          setStep('form');
                        }
                      }}
                      disabled={table.status !== 'available'}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${getStatusColor(table.status)} ${
                        table.status === 'available' ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'opacity-60 cursor-not-allowed'
                      } ${selectedTable?.id === table.id ? 'ring-2 ring-coffee-400' : ''}`}
                    >
                      <div className="text-4xl mb-3">🪑</div>
                      <h3 className="text-lg font-bold text-white mb-1">میز {table.number}</h3>
                      <div className="flex items-center justify-center gap-2 text-sm mb-2">
                        <Users size={14} />
                        <span>{table.capacity} نفره</span>
                      </div>
                      <span className="text-xs">{table.floor}</span>
                      <div className="mt-2 text-xs font-medium">{getStatusLabel(table.status)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Form */}
            {step === 'form' && selectedTable && (
              <div className="max-w-lg mx-auto">
                <div className="glass-effect rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🪑</div>
                    <h3 className="text-xl font-bold text-white">میز {selectedTable.number} - {selectedTable.floor}</h3>
                    <p className="text-coffee-400 text-sm">{selectedTable.capacity} نفره</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-coffee-300 mb-1 block">نام و نام خانوادگی *</label>
                      <div className="relative">
                        <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${errors.name ? 'border-red-500' : 'border-coffee-700'}`}
                          placeholder="مثال: علی محمدی"
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm text-coffee-300 mb-1 block">شماره تماس *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 pr-12 pl-4 text-coffee-100 text-sm ${errors.phone ? 'border-red-500' : 'border-coffee-700'}`}
                          placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                          dir="ltr"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-coffee-300 mb-1 block">تاریخ *</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={e => setFormData({ ...formData, date: e.target.value })}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${errors.date ? 'border-red-500' : 'border-coffee-700'}`}
                        />
                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-coffee-300 mb-1 block">ساعت *</label>
                        <select
                          value={formData.time}
                          onChange={e => setFormData({ ...formData, time: e.target.value })}
                          className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${errors.time ? 'border-red-500' : 'border-coffee-700'}`}
                        >
                          <option value="">انتخاب کنید</option>
                          {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-coffee-300 mb-1 block">تعداد مهمان *</label>
                      <input
                        type="number"
                        min={1}
                        max={selectedTable.capacity}
                        value={formData.guests}
                        onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${errors.guests ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button onClick={() => { setStep('select'); setErrors({}); }} className="flex-1 py-3 rounded-xl border border-coffee-600 text-coffee-300 font-medium hover:bg-coffee-800/50">
                      بازگشت
                    </button>
                    <button
                      onClick={() => {
                        if (validateForm()) setStep('menu');
                      }}
                      className="flex-1 btn-primary py-3 rounded-xl text-white font-medium"
                    >
                      ادامه و پیش‌سفارش
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Menu Pre-order */}
            {step === 'menu' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6 text-center">پیش‌سفارش از منو (اختیاری)</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {menuItems.filter(m => m.available).slice(0, 12).map(item => {
                    const inOrder = orderItems.find(o => o.item.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-3 glass-effect rounded-xl p-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-coffee-400">{formatPrice(item.price)}</p>
                        </div>
                        {inOrder ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => addOrderItem(item)} className="w-7 h-7 rounded bg-coffee-500 text-white flex items-center justify-center text-xs">+</button>
                            <span className="text-white text-sm font-bold w-5 text-center">{inOrder.qty}</span>
                            <button onClick={() => removeOrderItem(item.id)} className="w-7 h-7 rounded bg-coffee-700 text-coffee-300 flex items-center justify-center text-xs">−</button>
                          </div>
                        ) : (
                          <button onClick={() => addOrderItem(item)} className="px-3 py-1.5 rounded-lg bg-coffee-600 text-white text-xs hover:bg-coffee-500">
                            افزودن
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {orderItems.length > 0 && (
                  <div className="glass-effect rounded-xl p-4 mb-6 max-w-md mx-auto">
                    <h4 className="text-sm font-bold text-white mb-3">خلاصه پیش‌سفارش</h4>
                    {orderItems.map(o => (
                      <div key={o.item.id} className="flex justify-between text-sm text-coffee-300 py-1">
                        <span>{o.item.name} × {o.qty}</span>
                        <span>{formatPrice(o.item.price * o.qty)}</span>
                      </div>
                    ))}
                    <hr className="border-coffee-700 my-2" />
                    <div className="flex justify-between font-bold text-white">
                      <span>مجموع:</span>
                      <span>{formatPrice(orderItems.reduce((s, o) => s + o.item.price * o.qty, 0))}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 max-w-md mx-auto">
                  <button onClick={() => setStep('form')} className="flex-1 py-3 rounded-xl border border-coffee-600 text-coffee-300 font-medium hover:bg-coffee-800/50">
                    بازگشت
                  </button>
                  <button onClick={handleSubmitReservation} className="flex-1 btn-primary py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                    <Check size={18} />
                    ثبت رزرو
                  </button>
                </div>
              </div>
            )}

            {/* Step: Confirmed */}
            {step === 'confirmed' && (
              <div className="max-w-md mx-auto text-center">
                <div className="glass-effect rounded-2xl p-10 animate-fadeInUp">
                  <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check size={48} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">رزرو با موفقیت ثبت شد! 🎉</h3>
                  <p className="text-coffee-300 mb-2">شماره رزرو شما:</p>
                  <p className="text-3xl font-black text-coffee-400 mb-6">#{reservationId}</p>
                  <p className="text-coffee-400 text-sm mb-8">اطلاعات رزرو شما از طریق پیامک به شماره {formData.phone} ارسال خواهد شد</p>

                  <div className="bg-coffee-800/50 rounded-xl p-5 text-right space-y-3 mb-8">
                    <div className="flex justify-between">
                      <span className="text-coffee-400 text-sm">میز:</span>
                      <span className="text-white font-medium">میز {selectedTable?.number} - {selectedTable?.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coffee-400 text-sm">نام:</span>
                      <span className="text-white font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coffee-400 text-sm">تاریخ:</span>
                      <span className="text-white font-medium">{formData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coffee-400 text-sm">ساعت:</span>
                      <span className="text-white font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coffee-400 text-sm">تعداد:</span>
                      <span className="text-white font-medium">{formData.guests} نفر</span>
                    </div>
                    {orderItems.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-coffee-400 text-sm">پیش‌سفارش:</span>
                        <span className="text-white font-medium">{orderItems.length} آیتم - {formatPrice(orderItems.reduce((s, o) => s + o.item.price * o.qty, 0))}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetReservation}
                    className="btn-primary px-8 py-3 rounded-xl text-white font-medium"
                  >
                    بازگشت به صفحه اصلی
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
