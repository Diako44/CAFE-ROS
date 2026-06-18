import { useState, useRef } from 'react';
import {
  LayoutDashboard, BookOpen, Users, Package, DollarSign, Printer,
  Award, Plus, Trash2, Edit3, Save, X, Download, AlertTriangle,
  Calendar, Gift, Bell, Settings, Upload, ShoppingBag, Table2, CreditCard,
  Truck, UserPlus, FolderPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useApp } from '../context/AppContext';
import { dailyRevenues, formatPrice } from '../data/mockData';
import type { MenuItem, Staff, InventoryItem } from '../data/types';

export default function AdminPanel() {
  const {
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    categories, addCategory, deleteCategory,
    staffList, addStaff, updateStaff, deleteStaff,
    inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
    tables, updateTableStatus,
    reservations, updateReservation,
    orders, updateOrder,
    billRequests, updateBillRequest,
    admins, addAdmin, deleteAdmin,
    deliverySettings, updateDeliverySettings,
    notifications
  } = useApp();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editStaffId, setEditStaffId] = useState<number | null>(null);
  const [editInventoryId, setEditInventoryId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [staffErrors, setStaffErrors] = useState<{ [key: string]: string }>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item forms
  const [newMenuItem, setNewMenuItem] = useState({ name: '', nameEn: '', price: 0, category: 'قهوه', description: '' });
  const [newStaff, setNewStaff] = useState<Omit<Staff, 'id'>>({ name: '', role: '', phone: '', avatar: '👤', tips: 0, leaveDays: 26, leaveUsed: 0 });
  const [newInventory, setNewInventory] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, unit: '', minStock: 0, lastRestocked: '', cost: 0 });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', name: '', role: 'staff' as 'super' | 'manager' | 'staff' });
  const [adminErrors, setAdminErrors] = useState<{ [key: string]: string }>({});

  // Edit menu item state
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editMenuImage, setEditMenuImage] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  // Device settings
  const defaultDevices = {
    thermalPrinter: { name: 'Epson TM-T88VI', ip: '192.168.1.100', port: '9100', connected: true },
    cardReader: { name: 'Ingenico Move/5000', terminal: 'TR-20458731', connection: 'WiFi', connected: true },
    barPrinter: { name: 'BIXOLON SRP-350III', ip: '192.168.1.101', port: '9100', connected: false },
  };
  const [devices, setDevices] = useState(() => {
    try { const s = localStorage.getItem('cafe_lounge_devices'); return s ? JSON.parse(s) : defaultDevices; } catch { return defaultDevices; }
  });
  const saveDevices = (d: typeof defaultDevices) => { setDevices(d); localStorage.setItem('cafe_lounge_devices', JSON.stringify(d)); };

  const sections = [
    { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
    { id: 'order-mgmt', label: 'مدیریت سفارشات', icon: <ShoppingBag size={20} /> },
    { id: 'tables-orders', label: 'میزها و رزروها', icon: <Table2 size={20} /> },
    { id: 'delivery', label: 'بیرون‌بر و ارسال', icon: <Truck size={20} /> },
    { id: 'menu-mgmt', label: 'مدیریت منو', icon: <BookOpen size={20} /> },
    { id: 'staff', label: 'مدیریت پرسنل', icon: <Users size={20} /> },
    { id: 'customers-mgmt', label: 'باشگاه مشتریان', icon: <Award size={20} /> },
    { id: 'finance', label: 'گزارش روزانه صندوق', icon: <DollarSign size={20} /> },
    { id: 'inventory', label: 'انبارداری', icon: <Package size={20} /> },
    { id: 'admins', label: 'مدیریت ادمین‌ها', icon: <UserPlus size={20} /> },
    { id: 'devices', label: 'دستگاه‌ها', icon: <Printer size={20} /> },
    { id: 'settings', label: 'تنظیمات', icon: <Settings size={20} /> },
  ];

  const totalRevenue = dailyRevenues.reduce((s, d) => s + d.totalSales, 0);
  const totalOrders = dailyRevenues.reduce((s, d) => s + d.orders, 0);
  const avgOrder = totalRevenue / totalOrders;

  const chartData = dailyRevenues.map(d => ({
    date: d.date.split('/').slice(1).join('/'),
    فروش: d.totalSales / 1000000,
    سفارش: d.orders,
  }));

  const categoryData = categories.map(cat => ({
    name: cat,
    value: menuItems.filter(m => m.category === cat).length * 10 + 10,
  }));
  const COLORS = ['#a0714a', '#c08b52', '#d4a574', '#e8c9a0', '#f5e6d3'];

  // Filter orders by type
  const takeoutOrders = orders.filter(o => o.type === 'takeout');
  const deliveryOrders = orders.filter(o => o.type === 'delivery');

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) return;
    addMenuItem({
      ...newMenuItem,
      image: uploadedImage || '/images/cappuccino.jpg',
      available: true,
    });
    setShowAddMenu(false);
    setNewMenuItem({ name: '', nameEn: '', price: 0, category: categories[0] || 'قهوه', description: '' });
    setUploadedImage('');
  };

  const validateStaffForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newStaff.name.trim()) errors.name = 'نام الزامی است';
    if (!newStaff.role) errors.role = 'سِمت الزامی است';
    if (!newStaff.phone.trim()) errors.phone = 'شماره تماس الزامی است';
    else if (!/^09\d{9}$/.test(newStaff.phone)) errors.phone = 'شماره تماس معتبر نیست (مثال: 09121234567)';
    setStaffErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStaff = () => {
    if (!validateStaffForm()) return;
    addStaff(newStaff);
    setShowAddStaff(false);
    setNewStaff({ name: '', role: '', phone: '', avatar: '👤', tips: 0, leaveDays: 26, leaveUsed: 0 });
    setStaffErrors({});
  };

  const handleAddInventory = () => {
    if (!newInventory.name || !newInventory.unit) return;
    addInventoryItem({
      ...newInventory,
      lastRestocked: new Date().toLocaleDateString('fa-IR'),
    });
    setShowAddInventory(false);
    setNewInventory({ name: '', quantity: 0, unit: '', minStock: 0, lastRestocked: '', cost: 0 });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const validateAdminForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newAdmin.username.trim()) errors.username = 'نام کاربری الزامی است';
    else if (admins.some(a => a.username === newAdmin.username)) errors.username = 'این نام کاربری قبلاً استفاده شده';
    if (!newAdmin.password.trim()) errors.password = 'رمز عبور الزامی است';
    else if (newAdmin.password.length < 6) errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    if (!newAdmin.name.trim()) errors.name = 'نام الزامی است';
    setAdminErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAdmin = () => {
    if (!validateAdminForm()) return;
    addAdmin(newAdmin);
    setShowAddAdmin(false);
    setNewAdmin({ username: '', password: '', name: '', role: 'staff' });
    setAdminErrors({});
  };

  // Export Excel
  const exportExcel = () => {
    const BOM = '\uFEFF';
    let csvContent = 'تاریخ,فروش کل (تومان),تعداد سفارش,میانگین سفارش (تومان)\n';
    dailyRevenues.forEach(d => {
      csvContent += `${d.date},${d.totalSales},${d.orders},${d.avgOrderValue}\n`;
    });
    csvContent += '\n';
    csvContent += `مجموع کل,${totalRevenue},${totalOrders},${Math.round(avgOrder)}\n`;

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `گزارش_درآمد_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const staffEmojis = ['👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '🧑‍🍳', '👨‍💻', '👩‍💻', '🧑‍🔧', '👷', '💂'];

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'preparing': return 'bg-blue-500/20 text-blue-400';
      case 'ready': return 'bg-green-500/20 text-green-400';
      case 'delivered': return 'bg-purple-500/20 text-purple-400';
      case 'paid': return 'bg-gray-500/20 text-gray-400';
      default: return '';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'در انتظار';
      case 'preparing': return 'در حال آماده‌سازی';
      case 'ready': return 'آماده';
      case 'delivered': return 'تحویل شده';
      case 'paid': return 'پرداخت شده';
      default: return status;
    }
  };

  return (
    <section className="min-h-screen bg-coffee-900 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-coffee-800/50 border-l border-coffee-700/30 min-h-screen sticky top-20 transition-all duration-300 overflow-hidden flex-shrink-0`}>
          <div className="p-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-coffee-400 hover:text-white mb-4 p-2">
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div className="space-y-1">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === sec.id
                      ? 'bg-coffee-600/50 text-coffee-100 shadow-lg'
                      : 'text-coffee-400 hover:text-coffee-200 hover:bg-coffee-700/30'
                  }`}
                >
                  {sec.icon}
                  {sidebarOpen && <span>{sec.label}</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <LayoutDashboard size={24} className="text-coffee-400" />
                داشبورد مدیریت
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'فروش کل', value: formatPrice(totalRevenue), icon: <DollarSign size={24} />, color: 'from-green-500 to-emerald-600', change: '+۱۲٪' },
                  { label: 'سفارشات', value: (totalOrders + orders.length).toLocaleString('fa-IR'), icon: <ShoppingBag size={24} />, color: 'from-blue-500 to-indigo-600', change: '+۸٪' },
                  { label: 'رزروها', value: reservations.length.toLocaleString('fa-IR'), icon: <Calendar size={24} />, color: 'from-purple-500 to-pink-600', change: `+${reservations.length}` },
                  { label: 'درخواست صورتحساب', value: billRequests.filter(b => b.status === 'pending').length.toString(), icon: <CreditCard size={24} />, color: 'from-orange-500 to-red-500', change: '' },
                ].map((stat, i) => (
                  <div key={i} className="glass-effect rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                        {stat.icon}
                      </div>
                      {stat.change && <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-lg">{stat.change}</span>}
                    </div>
                    <h3 className="text-xs text-coffee-400 mb-1">{stat.label}</h3>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">نمودار فروش (میلیون تومان)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3d281a" />
                      <XAxis dataKey="date" tick={{ fill: '#a0714a', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#a0714a', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#1e140d', border: '1px solid #5c3d28', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="فروش" fill="#a0714a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">سهم دسته‌بندی‌ها</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e140d', border: '1px solid #5c3d28', borderRadius: '12px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time Notification Alerts */}
              {(notifications.filter(n => n.type === 'bill' || n.type === 'waiter' || n.type === 'order').length > 0) && (
                <div className="space-y-3">
                  {/* Bill Requests */}
                  {billRequests.filter(b => b.status === 'pending').length > 0 && (
                    <div className="bg-purple-900/30 border border-purple-500/40 rounded-2xl p-4 animate-pulse-glow">
                      <div className="flex items-center gap-2 text-purple-400 mb-3">
                        <CreditCard size={20} />
                        <span className="font-bold">💳 درخواست صورتحساب ({billRequests.filter(b => b.status === 'pending').length})</span>
                      </div>
                      <div className="space-y-2">
                        {billRequests.filter(b => b.status === 'pending').map(req => (
                          <div key={req.id} className="flex items-center justify-between bg-purple-900/20 rounded-xl p-3">
                            <span className="text-white text-sm">🪑 میز {req.tableNumber} <span className="text-purple-400 text-xs">({req.time})</span></span>
                            <button onClick={() => updateBillRequest(req.id, 'completed')} className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 text-xs hover:bg-green-600/40 font-medium">تکمیل ✓</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Waiter Calls */}
                  {notifications.filter(n => n.type === 'waiter').slice(0, 3).length > 0 && (
                    <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-amber-400 mb-3">
                        <Bell size={20} />
                        <span className="font-bold">🔔 پیج گارسون</span>
                      </div>
                      <div className="space-y-2">
                        {notifications.filter(n => n.type === 'waiter').slice(0, 3).map(n => (
                          <div key={n.id} className="flex items-center justify-between bg-amber-900/20 rounded-xl p-3">
                            <span className="text-white text-sm">{n.message}</span>
                            <span className="text-amber-400 text-xs">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Orders */}
                  {orders.filter(o => o.status === 'pending').length > 0 && (
                    <div className="bg-green-900/30 border border-green-500/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-green-400 mb-3">
                        <ShoppingBag size={20} />
                        <span className="font-bold">🆕 سفارشات جدید ({orders.filter(o => o.status === 'pending').length})</span>
                      </div>
                      <div className="space-y-2">
                        {orders.filter(o => o.status === 'pending').map(order => (
                          <div key={order.id} className="flex items-center justify-between bg-green-900/20 rounded-xl p-3">
                            <div>
                              <span className="text-white text-sm font-bold">#{order.id}</span>
                              <span className="text-green-300 text-xs mr-2">
                                {order.type === 'dine-in' ? `میز ${order.tableNumber}` : order.type === 'takeout' ? 'بیرون‌بر' : 'ارسال'}
                              </span>
                              <span className="text-coffee-400 text-xs mr-2">- {order.customerName}</span>
                            </div>
                            <button onClick={() => updateOrder(order.id, { status: 'preparing' })} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/40 font-medium">شروع آماده‌سازی</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Activity */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-coffee-400" />
                  تاریخچه فعالیت‌ها
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? notifications.slice(0, 30).map(n => {
                    const icon = n.type === 'order' ? '📦' :
                                 n.type === 'reserve' ? '📅' :
                                 n.type === 'waiter' ? '🔔' :
                                 n.type === 'bill' ? '💳' :
                                 n.type === 'menu' ? '📋' :
                                 n.type === 'staff' ? '👤' :
                                 n.type === 'inventory' ? '📦' :
                                 n.type === 'admin' ? '🔑' :
                                 n.type === 'category' ? '📁' : '📌';
                    return (
                      <div key={n.id} className={`flex items-center gap-3 rounded-xl p-3 ${
                        n.type === 'bill' ? 'bg-purple-900/20 border border-purple-700/30' :
                        n.type === 'waiter' ? 'bg-amber-900/20 border border-amber-700/30' :
                        n.type === 'order' ? 'bg-green-900/20 border border-green-700/30' :
                        'bg-coffee-800/30'
                      }`}>
                        <span className="text-lg">{icon}</span>
                        <span className="text-coffee-500 text-xs whitespace-nowrap">{n.time}</span>
                        <span className="text-coffee-200 text-sm flex-1">{n.message}</span>
                      </div>
                    );
                  }) : (
                    <p className="text-coffee-500 text-center py-8">هنوز فعالیتی ثبت نشده</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Management */}
          {activeSection === 'order-mgmt' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <ShoppingBag size={24} className="text-coffee-400" />
                مدیریت سفارشات
              </h2>

              {/* Order Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
                  <p className="text-xs text-coffee-400">در انتظار</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-blue-400">{orders.filter(o => o.status === 'preparing').length}</p>
                  <p className="text-xs text-coffee-400">در حال آماده‌سازی</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-green-400">{orders.filter(o => o.status === 'ready').length}</p>
                  <p className="text-xs text-coffee-400">آماده تحویل</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-white">{orders.length}</p>
                  <p className="text-xs text-coffee-400">کل سفارشات</p>
                </div>
              </div>

              {/* All Orders */}
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className={`glass-effect rounded-2xl p-5 ${order.status === 'pending' ? 'border border-yellow-500/30' : ''}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-white">#{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                          <span className="text-coffee-500 text-xs">
                            {order.type === 'dine-in' ? '🪑 داخل سالن' : order.type === 'takeout' ? '🥡 بیرون‌بر' : '🛵 ارسال'}
                          </span>
                        </div>
                        <select value={order.status} onChange={e => updateOrder(order.id, { status: e.target.value as any })} className="bg-coffee-800/50 border border-coffee-600 rounded-lg py-2 px-3 text-coffee-100 text-sm">
                          <option value="pending">در انتظار</option>
                          <option value="preparing">آماده‌سازی</option>
                          <option value="ready">آماده تحویل</option>
                          <option value="delivered">تحویل شده</option>
                          <option value="paid">پرداخت شده</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">مشتری</p>
                          <p className="text-white font-bold">{order.customerName}</p>
                          <p className="text-coffee-400 text-xs" dir="ltr">{order.phone}</p>
                        </div>
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">{order.type === 'dine-in' ? 'شماره میز' : order.type === 'delivery' ? 'آدرس' : 'نوع'}</p>
                          <p className="text-white font-bold">
                            {order.type === 'dine-in' ? `میز ${order.tableNumber}` : order.type === 'delivery' ? (order.address || '-') : 'بیرون‌بر'}
                          </p>
                        </div>
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">مبلغ کل</p>
                          <p className="text-white font-bold text-lg">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-coffee-500 text-xs mb-2">آیتم‌های سفارش:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-coffee-700/40 rounded-lg px-3 py-1.5">
                              <img src={item.item.image} alt="" className="w-8 h-8 rounded object-cover" />
                              <span className="text-coffee-200 text-sm">{item.item.name}</span>
                              <span className="text-coffee-400 text-xs">×{item.qty}</span>
                              <span className="text-coffee-300 text-xs">{formatPrice(item.item.price * item.qty)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-effect rounded-2xl p-12 text-center">
                  <span className="text-6xl block mb-4">📭</span>
                  <p className="text-coffee-400">هنوز سفارشی ثبت نشده</p>
                </div>
              )}
            </div>
          )}

          {/* Tables & Reservations */}
          {activeSection === 'tables-orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Table2 size={24} className="text-coffee-400" />
                مدیریت میزها و سفارشات
              </h2>

              {/* Bill Requests Alert */}
              {billRequests.filter(b => b.status === 'pending').length > 0 && (
                <div className="bg-purple-900/30 border border-purple-600/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <CreditCard size={20} className="animate-pulse" />
                    <span className="font-bold">درخواست‌های صورتحساب ({billRequests.filter(b => b.status === 'pending').length})</span>
                  </div>
                  <div className="space-y-2">
                    {billRequests.filter(b => b.status === 'pending').map(req => (
                      <div key={req.id} className="flex items-center justify-between bg-purple-900/20 rounded-xl p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🪑</span>
                          <div>
                            <span className="text-white font-bold">میز {req.tableNumber}</span>
                            <span className="text-purple-400 text-xs mr-2">ساعت {req.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBillRequest(req.id, 'processing')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/40"
                          >
                            در حال بررسی
                          </button>
                          <button
                            onClick={() => updateBillRequest(req.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 text-xs hover:bg-green-600/40"
                          >
                            تکمیل ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tables Grid */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">وضعیت میزها</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tables.map(table => (
                    <div key={table.id} className={`rounded-xl border-2 p-4 text-center ${
                      table.status === 'available' ? 'bg-green-500/20 border-green-500 text-green-400' :
                      table.status === 'reserved' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                      'bg-red-500/20 border-red-500 text-red-400'
                    }`}>
                      <div className="text-2xl mb-2">🪑</div>
                      <h4 className="font-bold text-white">میز {table.number}</h4>
                      <p className="text-xs opacity-80">{table.floor}</p>
                      <select
                        value={table.status}
                        onChange={e => updateTableStatus(table.id, e.target.value as 'available' | 'reserved' | 'occupied')}
                        className="mt-2 w-full bg-coffee-900/50 border border-current rounded-lg py-1 px-2 text-xs"
                      >
                        <option value="available">آزاد</option>
                        <option value="reserved">رزرو شده</option>
                        <option value="occupied">اشغال</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reservations */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  رزروهای اخیر
                </h3>
                {reservations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-coffee-700/50">
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">#</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">میز</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">نام</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">تلفن</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">تاریخ</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">ساعت</th>
                          <th className="text-right py-3 px-3 text-coffee-400 text-xs">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map(res => (
                          <tr key={res.id} className="border-b border-coffee-700/20 hover:bg-coffee-800/30">
                            <td className="py-3 px-3 text-coffee-300 text-sm">#{res.id}</td>
                            <td className="py-3 px-3 text-white text-sm font-bold">میز {res.tableNumber}</td>
                            <td className="py-3 px-3 text-coffee-200 text-sm">{res.customerName}</td>
                            <td className="py-3 px-3 text-coffee-400 text-sm" dir="ltr">{res.phone}</td>
                            <td className="py-3 px-3 text-coffee-300 text-sm">{res.date}</td>
                            <td className="py-3 px-3 text-coffee-300 text-sm">{res.time}</td>
                            <td className="py-3 px-3">
                              <select
                                value={res.status}
                                onChange={e => updateReservation(res.id, { status: e.target.value as any })}
                                className="text-xs rounded-lg py-1 px-2 bg-coffee-800/50"
                              >
                                <option value="pending">در انتظار</option>
                                <option value="confirmed">تایید شده</option>
                                <option value="completed">تکمیل</option>
                                <option value="cancelled">لغو</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-coffee-500 text-center py-8">هنوز رزروی ثبت نشده</p>
                )}
              </div>
            </div>
          )}

          {/* Delivery & Takeout Section */}
          {activeSection === 'delivery' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Truck size={24} className="text-coffee-400" />
                مدیریت بیرون‌بر و ارسال
              </h2>

              {/* Delivery Settings */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">تنظیمات قیمت‌گذاری</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-coffee-400 mb-1 block">هزینه ارسال (تومان)</label>
                    <input
                      type="number"
                      value={deliverySettings.deliveryFee}
                      onChange={e => updateDeliverySettings({ deliveryFee: parseInt(e.target.value) || 0 })}
                      className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-coffee-400 mb-1 block">تخفیف بیرون‌بر (%)</label>
                    <input
                      type="number"
                      value={deliverySettings.takeoutDiscount}
                      onChange={e => updateDeliverySettings({ takeoutDiscount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-coffee-400 mb-1 block">حداقل برای ارسال رایگان</label>
                    <input
                      type="number"
                      value={deliverySettings.minOrderForFreeDelivery}
                      onChange={e => updateDeliverySettings({ minOrderForFreeDelivery: parseInt(e.target.value) || 0 })}
                      className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliverySettings.isDeliveryActive}
                        onChange={e => updateDeliverySettings({ isDeliveryActive: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-sm text-coffee-300">ارسال فعال</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliverySettings.isTakeoutActive}
                        onChange={e => updateDeliverySettings({ isTakeoutActive: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-sm text-coffee-300">بیرون‌بر فعال</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-effect rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">🥡</div>
                  <h3 className="text-2xl font-black text-white">{takeoutOrders.length}</h3>
                  <p className="text-coffee-400 text-sm">سفارشات بیرون‌بر</p>
                </div>
                <div className="glass-effect rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">🛵</div>
                  <h3 className="text-2xl font-black text-white">{deliveryOrders.length}</h3>
                  <p className="text-coffee-400 text-sm">سفارشات ارسالی</p>
                </div>
                <div className="glass-effect rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="text-2xl font-black text-white">
                    {formatPrice([...takeoutOrders, ...deliveryOrders].reduce((s, o) => s + o.total, 0))}
                  </h3>
                  <p className="text-coffee-400 text-sm">درآمد کل</p>
                </div>
              </div>

              {/* Takeout Orders */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  🥡 سفارشات بیرون‌بر
                </h3>
                {takeoutOrders.length > 0 ? (
                  <div className="space-y-3">
                    {takeoutOrders.map(order => (
                      <div key={order.id} className="bg-coffee-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">#{order.id}</span>
                            <span className={`px-2 py-1 rounded-lg text-xs ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusLabel(order.status)}
                            </span>
                          </div>
                          <select
                            value={order.status}
                            onChange={e => updateOrder(order.id, { status: e.target.value as any })}
                            className="bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-coffee-100 text-sm"
                          >
                            <option value="pending">در انتظار</option>
                            <option value="preparing">آماده‌سازی</option>
                            <option value="ready">آماده تحویل</option>
                            <option value="delivered">تحویل شده</option>
                            <option value="paid">پرداخت شده</option>
                          </select>
                        </div>
                        <p className="text-coffee-300 text-sm">{order.customerName} - {order.phone}</p>
                        <p className="text-coffee-400 text-xs mt-1">{order.items.map(i => `${i.item.name}×${i.qty}`).join('، ')}</p>
                        <p className="text-white font-bold mt-2">{formatPrice(order.total)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-coffee-500 text-center py-8">سفارش بیرون‌بری وجود ندارد</p>
                )}
              </div>

              {/* Delivery Orders */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  🛵 سفارشات ارسالی
                </h3>
                {deliveryOrders.length > 0 ? (
                  <div className="space-y-3">
                    {deliveryOrders.map(order => (
                      <div key={order.id} className="bg-coffee-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">#{order.id}</span>
                            <span className={`px-2 py-1 rounded-lg text-xs ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusLabel(order.status)}
                            </span>
                          </div>
                          <select
                            value={order.status}
                            onChange={e => updateOrder(order.id, { status: e.target.value as any })}
                            className="bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-coffee-100 text-sm"
                          >
                            <option value="pending">در انتظار</option>
                            <option value="preparing">آماده‌سازی</option>
                            <option value="ready">آماده ارسال</option>
                            <option value="delivered">ارسال شده</option>
                            <option value="paid">پرداخت شده</option>
                          </select>
                        </div>
                        <p className="text-coffee-300 text-sm">{order.customerName} - {order.phone}</p>
                        <p className="text-coffee-500 text-xs mt-1">📍 {order.address}</p>
                        <p className="text-coffee-400 text-xs mt-1">{order.items.map(i => `${i.item.name}×${i.qty}`).join('، ')}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white font-bold">{formatPrice(order.total)}</span>
                          <span className="text-coffee-500 text-xs">هزینه ارسال: {formatPrice(deliverySettings.deliveryFee)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-coffee-500 text-center py-8">سفارش ارسالی وجود ندارد</p>
                )}
              </div>
            </div>
          )}

          {/* Menu Management */}
          {activeSection === 'menu-mgmt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <BookOpen size={24} className="text-coffee-400" />
                  مدیریت منو
                </h2>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddCategory(true)} className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 bg-coffee-700/50 text-coffee-200 border border-coffee-600 hover:bg-coffee-600/50">
                    <FolderPlus size={18} />
                    دسته‌بندی جدید
                  </button>
                  <button onClick={() => setShowAddMenu(true)} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                    <Plus size={18} />
                    افزودن آیتم
                  </button>
                </div>
              </div>

              {/* Categories Management */}
              <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm font-bold text-coffee-400 mb-3">دسته‌بندی‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center gap-2 bg-coffee-800/50 px-3 py-1.5 rounded-lg">
                      <span className="text-sm text-coffee-200">{cat}</span>
                      <span className="text-xs text-coffee-500">({menuItems.filter(m => m.category === cat).length})</span>
                      {categories.length > 1 && (
                        <button onClick={() => deleteCategory(cat)} className="text-coffee-500 hover:text-red-400">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Category Modal */}
              {showAddCategory && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">افزودن دسته‌بندی جدید</h3>
                    <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="flex gap-3">
                    <input
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      placeholder="نام دسته‌بندی"
                      className="flex-1 bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm"
                    />
                    <button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50">
                      افزودن
                    </button>
                  </div>
                </div>
              )}

              {/* Add Menu Modal */}
              {showAddMenu && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">افزودن آیتم جدید</h3>
                    <button onClick={() => { setShowAddMenu(false); setUploadedImage(''); }} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="text-sm text-coffee-300 mb-2 block">تصویر آیتم</label>
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-xl border-2 border-dashed border-coffee-600 flex flex-col items-center justify-center cursor-pointer hover:border-coffee-400 transition-colors overflow-hidden"
                      >
                        {uploadedImage ? (
                          <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload size={24} className="text-coffee-500 mb-2" />
                            <span className="text-xs text-coffee-500">آپلود تصویر</span>
                          </>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {uploadedImage && (
                        <button onClick={() => setUploadedImage('')} className="text-red-400 text-sm hover:text-red-300">حذف تصویر</button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام فارسی *</label>
                      <input value={newMenuItem.name} onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })} placeholder="مثال: کاپوچینو" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام انگلیسی</label>
                      <input value={newMenuItem.nameEn} onChange={e => setNewMenuItem({ ...newMenuItem, nameEn: e.target.value })} placeholder="Cappuccino" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">قیمت (تومان) *</label>
                      <input type="number" value={newMenuItem.price || ''} onChange={e => setNewMenuItem({ ...newMenuItem, price: parseInt(e.target.value) || 0 })} placeholder="85000" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">دسته‌بندی</label>
                      <select value={newMenuItem.category} onChange={e => setNewMenuItem({ ...newMenuItem, category: e.target.value })} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-coffee-400 mb-1 block">توضیحات</label>
                      <input value={newMenuItem.description} onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })} placeholder="توضیح کوتاه" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                  </div>
                  <button onClick={handleAddMenuItem} disabled={!newMenuItem.name || !newMenuItem.price} className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                    <Save size={16} />
                    ذخیره
                  </button>
                </div>
              )}

              {/* Edit Menu Item Modal */}
              {editingMenuItem && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn ring-2 ring-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">✏️ ویرایش: {editingMenuItem.name}</h3>
                    <button onClick={() => { setEditingMenuItem(null); setEditMenuImage(''); }} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>

                  {/* Image */}
                  <div className="mb-4">
                    <label className="text-sm text-coffee-300 mb-2 block">تصویر</label>
                    <div className="flex items-center gap-4">
                      <div onClick={() => editFileRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-coffee-600 flex items-center justify-center cursor-pointer overflow-hidden hover:border-coffee-400">
                        <img src={editMenuImage || editingMenuItem.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onloadend = () => setEditMenuImage(r.result as string); r.readAsDataURL(file); }
                      }} />
                      {editMenuImage && <button onClick={() => setEditMenuImage('')} className="text-red-400 text-xs">بازگشت به قبلی</button>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام فارسی</label>
                      <input value={editingMenuItem.name} onChange={e => setEditingMenuItem({...editingMenuItem, name: e.target.value})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام انگلیسی</label>
                      <input value={editingMenuItem.nameEn} onChange={e => setEditingMenuItem({...editingMenuItem, nameEn: e.target.value})} dir="ltr" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">قیمت (تومان)</label>
                      <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({...editingMenuItem, price: parseInt(e.target.value) || 0})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">دسته‌بندی</label>
                      <select value={editingMenuItem.category} onChange={e => setEditingMenuItem({...editingMenuItem, category: e.target.value})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-coffee-400 mb-1 block">توضیحات</label>
                      <input value={editingMenuItem.description} onChange={e => setEditingMenuItem({...editingMenuItem, description: e.target.value})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => { setEditingMenuItem(null); setEditMenuImage(''); }} className="flex-1 py-2.5 rounded-xl border border-coffee-600 text-coffee-300 text-sm">انصراف</button>
                    <button onClick={() => {
                      updateMenuItem(editingMenuItem.id, { ...editingMenuItem, image: editMenuImage || editingMenuItem.image });
                      setEditingMenuItem(null); setEditMenuImage('');
                    }} className="flex-1 btn-primary py-2.5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2"><Save size={16} /> ذخیره تغییرات</button>
                  </div>
                </div>
              )}

              {/* Menu Table */}
              <div className="glass-effect rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-coffee-700/50">
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">تصویر</th>
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">نام</th>
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">دسته‌بندی</th>
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">قیمت</th>
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">وضعیت</th>
                        <th className="text-right py-4 px-4 text-coffee-400 text-xs font-medium">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id} className="border-b border-coffee-700/20 hover:bg-coffee-800/30">
                          <td className="py-3 px-4">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-white text-sm font-medium">{item.name}</p>
                            <p className="text-coffee-500 text-xs">{item.nameEn}</p>
                          </td>
                          <td className="py-3 px-4 text-coffee-300 text-sm">{item.category}</td>
                          <td className="py-3 px-4 text-coffee-200 text-sm font-medium">{formatPrice(item.price)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => updateMenuItem(item.id, { available: !item.available })}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${item.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}
                            >
                              {item.available ? 'فعال' : 'غیرفعال'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingMenuItem({...item})} className="p-2 rounded-lg hover:bg-blue-900/30 text-coffee-400 hover:text-blue-400">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => deleteMenuItem(item.id)} className="p-2 rounded-lg hover:bg-red-900/30 text-coffee-400 hover:text-red-400">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Admin Management */}
          {activeSection === 'admins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <UserPlus size={24} className="text-coffee-400" />
                  مدیریت ادمین‌ها
                </h2>
                <button onClick={() => setShowAddAdmin(true)} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <Plus size={18} />
                  افزودن ادمین
                </button>
              </div>

              {/* Add Admin Modal */}
              {showAddAdmin && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">افزودن ادمین جدید</h3>
                    <button onClick={() => { setShowAddAdmin(false); setAdminErrors({}); }} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام کاربری *</label>
                      <input
                        value={newAdmin.username}
                        onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                        placeholder="username"
                        dir="ltr"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${adminErrors.username ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {adminErrors.username && <p className="text-red-400 text-xs mt-1">{adminErrors.username}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">رمز عبور *</label>
                      <input
                        type="password"
                        value={newAdmin.password}
                        onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        placeholder="حداقل ۶ کاراکتر"
                        dir="ltr"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${adminErrors.password ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {adminErrors.password && <p className="text-red-400 text-xs mt-1">{adminErrors.password}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام و نام خانوادگی *</label>
                      <input
                        value={newAdmin.name}
                        onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        placeholder="علی محمدی"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${adminErrors.name ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {adminErrors.name && <p className="text-red-400 text-xs mt-1">{adminErrors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">سطح دسترسی</label>
                      <select
                        value={newAdmin.role}
                        onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                        className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm"
                      >
                        <option value="staff">کارمند</option>
                        <option value="manager">مدیر</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleAddAdmin} className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                    <Save size={16} />
                    ثبت ادمین
                  </button>
                </div>
              )}

              {/* Admins List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map(admin => (
                  <div key={admin.id} className="glass-effect rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        admin.role === 'super' ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                        admin.role === 'manager' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        'bg-gradient-to-br from-coffee-500 to-coffee-700'
                      }`}>
                        {admin.role === 'super' ? '👑' : admin.role === 'manager' ? '👔' : '👤'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{admin.name}</h3>
                        <p className="text-coffee-400 text-sm" dir="ltr">@{admin.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        admin.role === 'super' ? 'bg-yellow-500/20 text-yellow-400' :
                        admin.role === 'manager' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-coffee-500/20 text-coffee-400'
                      }`}>
                        {admin.role === 'super' ? 'مدیر ارشد' : admin.role === 'manager' ? 'مدیر' : 'کارمند'}
                      </span>
                      {admin.role !== 'super' && (
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className="text-coffee-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <p className="text-coffee-500 text-xs mt-3">تاریخ عضویت: {admin.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Management */}
          {activeSection === 'staff' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users size={24} className="text-coffee-400" />
                  مدیریت پرسنل
                </h2>
                <button onClick={() => setShowAddStaff(true)} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <Plus size={18} />
                  افزودن پرسنل
                </button>
              </div>

              {/* Add Staff Modal */}
              {showAddStaff && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">ثبت پرسنل جدید</h3>
                    <button onClick={() => { setShowAddStaff(false); setStaffErrors({}); }} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-coffee-400 mb-2 block">آواتار</label>
                    <div className="flex gap-2 flex-wrap">
                      {staffEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setNewStaff({ ...newStaff, avatar: emoji })}
                          className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                            newStaff.avatar === emoji ? 'bg-coffee-500 scale-110' : 'bg-coffee-800/50 hover:bg-coffee-700/50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام و نام خانوادگی *</label>
                      <input
                        value={newStaff.name}
                        onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                        placeholder="علی محمدی"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${staffErrors.name ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {staffErrors.name && <p className="text-red-400 text-xs mt-1">{staffErrors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">سمت *</label>
                      <select
                        value={newStaff.role}
                        onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${staffErrors.role ? 'border-red-500' : 'border-coffee-700'}`}
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="مدیر کافه">مدیر کافه</option>
                        <option value="باریستا ارشد">باریستا ارشد</option>
                        <option value="باریستا">باریستا</option>
                        <option value="گارسون">گارسون</option>
                        <option value="صندوقدار">صندوقدار</option>
                        <option value="آشپز">آشپز</option>
                      </select>
                      {staffErrors.role && <p className="text-red-400 text-xs mt-1">{staffErrors.role}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">شماره تماس *</label>
                      <input
                        value={newStaff.phone}
                        onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                        placeholder="09121234567"
                        dir="ltr"
                        className={`w-full bg-coffee-800/50 border rounded-xl py-3 px-4 text-coffee-100 text-sm ${staffErrors.phone ? 'border-red-500' : 'border-coffee-700'}`}
                      />
                      {staffErrors.phone && <p className="text-red-400 text-xs mt-1">{staffErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">روزهای مرخصی</label>
                      <input type="number" value={newStaff.leaveDays} onChange={e => setNewStaff({ ...newStaff, leaveDays: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                  </div>
                  <button onClick={handleAddStaff} className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                    <Save size={16} />
                    ثبت پرسنل
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffList.map(staff => (
                  <div key={staff.id} className="glass-effect rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{staff.avatar}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{staff.name}</h3>
                        <p className="text-coffee-400 text-sm">{staff.role}</p>
                        <p className="text-coffee-500 text-xs" dir="ltr">{staff.phone}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditStaffId(editStaffId === staff.id ? null : staff.id)} className="text-coffee-400 hover:text-white p-2">
                          {editStaffId === staff.id ? <Save size={18} /> : <Edit3 size={18} />}
                        </button>
                        <button onClick={() => deleteStaff(staff.id)} className="text-coffee-400 hover:text-red-400 p-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-coffee-800/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-coffee-400 text-xs mb-2">
                          <Gift size={14} />
                          انعام
                        </div>
                        {editStaffId === staff.id ? (
                          <input type="number" value={staff.tips} onChange={e => updateStaff(staff.id, { tips: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1.5 px-3 text-coffee-100 text-sm" />
                        ) : (
                          <p className="text-white text-sm font-bold">{formatPrice(staff.tips)}</p>
                        )}
                      </div>
                      <div className="bg-coffee-800/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-coffee-400 text-xs mb-2">
                          <Calendar size={14} />
                          مرخصی
                        </div>
                        {editStaffId === staff.id ? (
                          <input type="number" value={staff.leaveUsed} onChange={e => updateStaff(staff.id, { leaveUsed: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1.5 px-3 text-coffee-100 text-sm" />
                        ) : (
                          <p className="text-white text-sm font-bold">{staff.leaveUsed} / {staff.leaveDays}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections remain the same... */}
          {activeSection === 'customers-mgmt' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Award size={24} className="text-coffee-400" />
                مدیریت باشگاه مشتریان
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'مشتریان طلایی', count: 2, icon: '👑', color: 'from-yellow-500 to-amber-600' },
                  { label: 'مشتریان نقره‌ای', count: 2, icon: '🥈', color: 'from-gray-400 to-gray-600' },
                  { label: 'مشتریان برنزی', count: 2, icon: '🥉', color: 'from-orange-500 to-orange-700' },
                ].map((s, i) => (
                  <div key={i} className="glass-effect rounded-2xl p-5 text-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mx-auto mb-3`}>{s.icon}</div>
                    <h3 className="text-2xl font-black text-white">{s.count}</h3>
                    <p className="text-coffee-400 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Gift size={20} className="text-green-400" />
                  ارسال کد تخفیف پیامکی
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select className="bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm">
                    <option>همه مشتریان</option>
                    <option>مشتریان طلایی</option>
                    <option>مشتریان نقره‌ای</option>
                    <option>مشتریان برنزی</option>
                  </select>
                  <input placeholder="درصد تخفیف" type="number" className="bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                  <button className="btn-primary py-3 rounded-xl text-white text-sm font-medium">ارسال 📱</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <DollarSign size={24} className="text-coffee-400" />
                  گزارش روزانه صندوق
                </h2>
                <button onClick={exportExcel} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <Download size={18} />
                  خروجی اکسل
                </button>
              </div>

              {/* Today Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-effect rounded-xl p-5 text-center">
                  <p className="text-coffee-400 text-xs mb-1">فروش امروز</p>
                  <p className="text-2xl font-black text-white">{formatPrice(dailyRevenues[dailyRevenues.length - 1]?.totalSales || 0)}</p>
                </div>
                <div className="glass-effect rounded-xl p-5 text-center">
                  <p className="text-coffee-400 text-xs mb-1">تعداد سفارش امروز</p>
                  <p className="text-2xl font-black text-white">{(dailyRevenues[dailyRevenues.length - 1]?.orders || 0) + orders.length}</p>
                </div>
                <div className="glass-effect rounded-xl p-5 text-center">
                  <p className="text-coffee-400 text-xs mb-1">میانگین سفارش</p>
                  <p className="text-2xl font-black text-white">{formatPrice(dailyRevenues[dailyRevenues.length - 1]?.avgOrderValue || 0)}</p>
                </div>
                <div className="glass-effect rounded-xl p-5 text-center">
                  <p className="text-coffee-400 text-xs mb-1">سفارشات آنلاین امروز</p>
                  <p className="text-2xl font-black text-white">{orders.length}</p>
                </div>
              </div>

              {/* Today's Online Orders Detail */}
              {orders.length > 0 && (
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">ریز سفارشات آنلاین امروز</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-coffee-700/50">
                          {['#', 'نوع', 'مشتری', 'آیتم‌ها', 'مبلغ', 'وضعیت'].map(h => (
                            <th key={h} className="text-right py-3 px-3 text-coffee-400 text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-coffee-700/20 hover:bg-coffee-800/30">
                            <td className="py-3 px-3 text-white text-sm font-bold">#{o.id}</td>
                            <td className="py-3 px-3 text-coffee-300 text-xs">
                              {o.type === 'dine-in' ? `🪑 میز ${o.tableNumber}` : o.type === 'takeout' ? '🥡 بیرون‌بر' : '🛵 ارسال'}
                            </td>
                            <td className="py-3 px-3 text-coffee-200 text-sm">{o.customerName}</td>
                            <td className="py-3 px-3 text-coffee-400 text-xs">{o.items.map(i => `${i.item.name}×${i.qty}`).join('، ')}</td>
                            <td className="py-3 px-3 text-white text-sm font-bold">{formatPrice(o.total)}</td>
                            <td className="py-3 px-3 text-xs">
                              <span className={`px-2 py-1 rounded-full ${getOrderStatusColor(o.status)}`}>{getOrderStatusLabel(o.status)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-coffee-600">
                          <td colSpan={4} className="py-3 px-3 text-coffee-300 text-sm font-bold">جمع کل آنلاین:</td>
                          <td className="py-3 px-3 text-white text-lg font-black">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">نمودار فروش ۱۰ روز اخیر</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d281a" />
                    <XAxis dataKey="date" tick={{ fill: '#a0714a', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#a0714a', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1e140d', border: '1px solid #5c3d28', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="فروش" stroke="#a0714a" strokeWidth={3} dot={{ fill: '#c08b52', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Archive */}
              <div className="glass-effect rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-coffee-700/50 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">آرشیو درآمد روزانه</h3>
                  <span className="text-xs text-coffee-500">جمع: {formatPrice(totalRevenue)}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-coffee-700/50">
                        {['تاریخ', 'فروش کل', 'سفارشات', 'میانگین'].map(h => (
                          <th key={h} className="text-right py-3 px-4 text-coffee-400 text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dailyRevenues.map((d, i) => (
                        <tr key={i} className="border-b border-coffee-700/20 hover:bg-coffee-800/30">
                          <td className="py-3 px-4 text-coffee-300 text-sm">{d.date}</td>
                          <td className="py-3 px-4 text-white text-sm font-bold">{formatPrice(d.totalSales)}</td>
                          <td className="py-3 px-4 text-coffee-300 text-sm">{d.orders}</td>
                          <td className="py-3 px-4 text-coffee-300 text-sm">{formatPrice(d.avgOrderValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Package size={24} className="text-coffee-400" />
                  انبارداری
                </h2>
                <button onClick={() => setShowAddInventory(true)} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <Plus size={18} />
                  افزودن کالا
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-white">{inventory.length}</p>
                  <p className="text-xs text-coffee-400">کل اقلام</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-green-400">{inventory.filter(i => i.quantity > i.minStock * 2).length}</p>
                  <p className="text-xs text-coffee-400">موجودی کافی</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-yellow-400">{inventory.filter(i => i.quantity > i.minStock && i.quantity <= i.minStock * 2).length}</p>
                  <p className="text-xs text-coffee-400">رو به اتمام</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-red-400">{inventory.filter(i => i.quantity <= i.minStock).length}</p>
                  <p className="text-xs text-coffee-400">کمبود</p>
                </div>
              </div>

              {/* Add Inventory Form */}
              {showAddInventory && (
                <div className="glass-effect rounded-2xl p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">افزودن کالای جدید</h3>
                    <button onClick={() => setShowAddInventory(false)} className="text-coffee-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">نام کالا *</label>
                      <input value={newInventory.name} onChange={e => setNewInventory({ ...newInventory, name: e.target.value })} placeholder="دانه قهوه عربیکا" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">موجودی اولیه</label>
                      <input type="number" value={newInventory.quantity || ''} onChange={e => setNewInventory({ ...newInventory, quantity: parseInt(e.target.value) || 0 })} placeholder="25" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">واحد اندازه‌گیری *</label>
                      <input value={newInventory.unit} onChange={e => setNewInventory({ ...newInventory, unit: e.target.value })} placeholder="کیلوگرم" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">حداقل موجودی (هشدار)</label>
                      <input type="number" value={newInventory.minStock || ''} onChange={e => setNewInventory({ ...newInventory, minStock: parseInt(e.target.value) || 0 })} placeholder="10" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 mb-1 block">هزینه هر واحد (تومان)</label>
                      <input type="number" value={newInventory.cost || ''} onChange={e => setNewInventory({ ...newInventory, cost: parseInt(e.target.value) || 0 })} placeholder="2500000" className="w-full bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                    </div>
                  </div>
                  <button onClick={handleAddInventory} disabled={!newInventory.name || !newInventory.unit} className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"><Save size={16} /> ذخیره</button>
                </div>
              )}

              {/* Low Stock Alert */}
              {inventory.filter(i => i.quantity <= i.minStock).length > 0 && (
                <div className="bg-red-900/20 border border-red-600/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-bold text-sm">⚠️ هشدار کمبود موجودی!</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inventory.filter(i => i.quantity <= i.minStock).map(item => (
                      <span key={item.id} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-lg text-xs font-medium">{item.name}: {item.quantity} {item.unit} (حداقل: {item.minStock})</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.map(item => {
                  const isEditing = editInventoryId === item.id;
                  const stockPercent = item.minStock > 0 ? Math.min((item.quantity / (item.minStock * 3)) * 100, 100) : 100;
                  const stockColor = item.quantity <= item.minStock ? 'bg-red-500' : item.quantity <= item.minStock * 2 ? 'bg-yellow-500' : 'bg-green-500';
                  const statusLabel = item.quantity <= item.minStock ? 'کمبود ⚠️' : item.quantity <= item.minStock * 2 ? 'رو به اتمام' : 'کافی ✓';
                  const statusColor = item.quantity <= item.minStock ? 'text-red-400 bg-red-900/30' : item.quantity <= item.minStock * 2 ? 'text-yellow-400 bg-yellow-900/30' : 'text-green-400 bg-green-900/30';

                  return (
                    <div key={item.id} className={`glass-effect rounded-2xl p-5 ${isEditing ? 'ring-2 ring-coffee-400' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-coffee-700/50 flex items-center justify-center text-lg">📦</div>
                          <div>
                            {isEditing ? (
                              <input value={item.name} onChange={e => updateInventoryItem(item.id, { name: e.target.value })} className="bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-white text-sm font-bold w-40" />
                            ) : (
                              <h4 className="text-white font-bold">{item.name}</h4>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>{statusLabel}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setEditInventoryId(isEditing ? null : item.id)} className={`p-2 rounded-lg ${isEditing ? 'bg-green-600/20 text-green-400' : 'hover:bg-coffee-700/50 text-coffee-400'}`}>
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                          </button>
                          <button onClick={() => deleteInventoryItem(item.id)} className="p-2 rounded-lg hover:bg-red-900/30 text-coffee-400 hover:text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Stock Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-coffee-500 mb-1">
                          <span>موجودی</span>
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                        <div className="w-full h-2.5 bg-coffee-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${stockColor}`} style={{ width: `${stockPercent}%` }} />
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">موجودی فعلی</p>
                          {isEditing ? (
                            <input type="number" value={item.quantity} onChange={e => updateInventoryItem(item.id, { quantity: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-white text-sm font-bold" />
                          ) : (
                            <p className="text-white font-bold text-lg">{item.quantity} <span className="text-xs text-coffee-400 font-normal">{item.unit}</span></p>
                          )}
                        </div>
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">حداقل موجودی</p>
                          {isEditing ? (
                            <input type="number" value={item.minStock} onChange={e => updateInventoryItem(item.id, { minStock: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-white text-sm font-bold" />
                          ) : (
                            <p className="text-white font-bold text-lg">{item.minStock} <span className="text-xs text-coffee-400 font-normal">{item.unit}</span></p>
                          )}
                        </div>
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">هزینه واحد</p>
                          {isEditing ? (
                            <input type="number" value={item.cost} onChange={e => updateInventoryItem(item.id, { cost: parseInt(e.target.value) || 0 })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-white text-sm font-bold" />
                          ) : (
                            <p className="text-white font-bold">{formatPrice(item.cost)}</p>
                          )}
                        </div>
                        <div className="bg-coffee-800/50 rounded-xl p-3">
                          <p className="text-coffee-500 text-xs mb-1">آخرین تامین</p>
                          {isEditing ? (
                            <input value={item.lastRestocked} onChange={e => updateInventoryItem(item.id, { lastRestocked: e.target.value })} className="w-full bg-coffee-900/50 border border-coffee-600 rounded-lg py-1 px-2 text-white text-sm font-bold" />
                          ) : (
                            <p className="text-white font-bold text-sm">{item.lastRestocked}</p>
                          )}
                        </div>
                      </div>

                      {/* Total Value */}
                      <div className="mt-3 pt-3 border-t border-coffee-700/30 flex justify-between items-center">
                        <span className="text-coffee-500 text-xs">ارزش کل موجودی:</span>
                        <span className="text-coffee-300 font-bold text-sm">{formatPrice(item.quantity * item.cost)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Inventory Value */}
              <div className="glass-effect rounded-2xl p-6 text-center">
                <p className="text-coffee-400 text-sm mb-2">ارزش کل انبار</p>
                <p className="text-3xl font-black text-white">{formatPrice(inventory.reduce((s, i) => s + i.quantity * i.cost, 0))}</p>
              </div>
            </div>
          )}

          {activeSection === 'devices' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Printer size={24} className="text-coffee-400" />
                مدیریت دستگاه‌ها
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thermal Printer */}
                <div className="glass-effect rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">🖨️</div>
                    <h3 className="text-lg font-bold text-white">پرینتر حرارتی</h3>
                    <p className="text-coffee-500 text-xs">چاپ فاکتور مشتری</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">نام/مدل</label>
                      <input value={devices.thermalPrinter.name} onChange={e => saveDevices({...devices, thermalPrinter: {...devices.thermalPrinter, name: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">آدرس IP</label>
                      <input value={devices.thermalPrinter.ip} onChange={e => saveDevices({...devices, thermalPrinter: {...devices.thermalPrinter, ip: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">پورت</label>
                      <input value={devices.thermalPrinter.port} onChange={e => saveDevices({...devices, thermalPrinter: {...devices.thermalPrinter, port: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div className={`flex items-center justify-between rounded-lg p-2.5 border ${devices.thermalPrinter.connected ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-red-900/20 border-red-700/30 text-red-400'}`}>
                      <span className="text-sm font-medium">{devices.thermalPrinter.connected ? 'متصل ✓' : 'قطع ✗'}</span>
                      <button onClick={() => saveDevices({...devices, thermalPrinter: {...devices.thermalPrinter, connected: !devices.thermalPrinter.connected}})} className="text-xs underline">تغییر</button>
                    </div>
                  </div>
                </div>

                {/* Card Reader */}
                <div className="glass-effect rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">💳</div>
                    <h3 className="text-lg font-bold text-white">کارتخوان</h3>
                    <p className="text-coffee-500 text-xs">پرداخت مشتری</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">نام/مدل</label>
                      <input value={devices.cardReader.name} onChange={e => saveDevices({...devices, cardReader: {...devices.cardReader, name: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">شماره ترمینال</label>
                      <input value={devices.cardReader.terminal} onChange={e => saveDevices({...devices, cardReader: {...devices.cardReader, terminal: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">اتصال</label>
                      <select value={devices.cardReader.connection} onChange={e => saveDevices({...devices, cardReader: {...devices.cardReader, connection: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm">
                        <option>WiFi</option><option>Bluetooth</option><option>USB</option><option>LAN</option>
                      </select>
                    </div>
                    <div className={`flex items-center justify-between rounded-lg p-2.5 border ${devices.cardReader.connected ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-red-900/20 border-red-700/30 text-red-400'}`}>
                      <span className="text-sm font-medium">{devices.cardReader.connected ? 'متصل ✓' : 'قطع ✗'}</span>
                      <button onClick={() => saveDevices({...devices, cardReader: {...devices.cardReader, connected: !devices.cardReader.connected}})} className="text-xs underline">تغییر</button>
                    </div>
                  </div>
                </div>

                {/* Bar Printer */}
                <div className="glass-effect rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">🍺</div>
                    <h3 className="text-lg font-bold text-white">پرینتر بار</h3>
                    <p className="text-coffee-500 text-xs">چاپ سفارش بار</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">نام/مدل</label>
                      <input value={devices.barPrinter.name} onChange={e => saveDevices({...devices, barPrinter: {...devices.barPrinter, name: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">آدرس IP</label>
                      <input value={devices.barPrinter.ip} onChange={e => saveDevices({...devices, barPrinter: {...devices.barPrinter, ip: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-xs text-coffee-400 block mb-1">پورت</label>
                      <input value={devices.barPrinter.port} onChange={e => saveDevices({...devices, barPrinter: {...devices.barPrinter, port: e.target.value}})} className="w-full bg-coffee-800/50 border border-coffee-700 rounded-lg py-2 px-3 text-coffee-100 text-sm" dir="ltr" />
                    </div>
                    <div className={`flex items-center justify-between rounded-lg p-2.5 border ${devices.barPrinter.connected ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-red-900/20 border-red-700/30 text-red-400'}`}>
                      <span className="text-sm font-medium">{devices.barPrinter.connected ? 'متصل ✓' : 'قطع ✗'}</span>
                      <button onClick={() => saveDevices({...devices, barPrinter: {...devices.barPrinter, connected: !devices.barPrinter.connected}})} className="text-xs underline">تغییر</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Settings size={24} className="text-coffee-400" />
                تنظیمات
              </h2>
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">اطلاعات کافه</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input defaultValue="کافه لانژ" placeholder="نام کافه" className="bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                  <input defaultValue="021-88765432" placeholder="تلفن" dir="ltr" className="bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                  <input defaultValue="تهران، خیابان ولیعصر" placeholder="آدرس" className="sm:col-span-2 bg-coffee-800/50 border border-coffee-700 rounded-xl py-3 px-4 text-coffee-100 text-sm" />
                </div>
                <button className="mt-4 btn-primary px-8 py-3 rounded-xl text-white font-medium">ذخیره</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
