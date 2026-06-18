import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem, Staff, InventoryItem, Table } from '../data/types';
import { menuItems as defaultMenu, staffMembers as defaultStaff, inventoryItems as defaultInventory, tables as defaultTables } from '../data/mockData';

// ── Types ──────────────────────────────────────────────
interface Reservation {
  id: number;
  tableId: number;
  tableNumber: number;
  floor: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  preOrderItems: { item: MenuItem; qty: number }[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Order {
  id: number;
  items: { item: MenuItem; qty: number }[];
  total: number;
  customerName: string;
  phone: string;
  address?: string;
  type: 'dine-in' | 'takeout' | 'delivery';
  tableNumber?: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  createdAt: string;
  deliveryFee?: number;
}

interface BillRequest {
  id: number;
  tableNumber: number;
  time: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

interface Admin {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'super' | 'manager' | 'staff';
  createdAt: string;
}

interface DeliverySettings {
  deliveryFee: number;
  takeoutDiscount: number;
  minOrderForFreeDelivery: number;
  isDeliveryActive: boolean;
  isTakeoutActive: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: string;
  time: string;
}

interface AppContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: number, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: number) => void;
  categories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  staffList: Staff[];
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: number, staff: Partial<Staff>) => void;
  deleteStaff: (id: number) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  tables: Table[];
  updateTableStatus: (id: number, status: Table['status']) => void;
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => number;
  updateReservation: (id: number, res: Partial<Reservation>) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => number;
  updateOrder: (id: number, order: Partial<Order>) => void;
  billRequests: BillRequest[];
  addBillRequest: (tableNumber: number) => void;
  updateBillRequest: (id: number, status: BillRequest['status']) => void;
  admins: Admin[];
  addAdmin: (admin: Omit<Admin, 'id' | 'createdAt'>) => void;
  deleteAdmin: (id: number) => void;
  validateAdmin: (username: string, password: string) => Admin | null;
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (settings: Partial<DeliverySettings>) => void;
  notifications: Notification[];
  addNotification: (message: string, type: string) => void;
}

// ── localStorage helpers ───────────────────────────────
const STORAGE_PREFIX = 'cafe_lounge_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // corrupted data → ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded → ignore
  }
}

// Hook: state that auto-persists to localStorage
function usePersisted<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => loadFromStorage(key, fallback));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}

// ── Defaults ───────────────────────────────────────────
const defaultAdmins: Admin[] = [
  { id: 1, username: 'admin', password: 'admin123', name: 'مدیر اصلی', role: 'super', createdAt: '1403/01/01' },
];

const defaultDeliverySettings: DeliverySettings = {
  deliveryFee: 25000,
  takeoutDiscount: 5,
  minOrderForFreeDelivery: 500000,
  isDeliveryActive: true,
  isTakeoutActive: true,
};

const defaultCategories = ['قهوه', 'نوشیدنی گرم', 'نوشیدنی سرد', 'دسر', 'فست فود'];

// ── Context ────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // All state is persisted
  const [menuItems, setMenuItems] = usePersisted<MenuItem[]>('menu', defaultMenu);
  const [categories, setCategories] = usePersisted<string[]>('categories', defaultCategories);
  const [staffList, setStaffList] = usePersisted<Staff[]>('staff', defaultStaff);
  const [inventory, setInventory] = usePersisted<InventoryItem[]>('inventory', defaultInventory);
  const [tables, setTables] = usePersisted<Table[]>('tables', defaultTables);
  const [reservations, setReservations] = usePersisted<Reservation[]>('reservations', []);
  const [orders, setOrders] = usePersisted<Order[]>('orders', []);
  const [billRequests, setBillRequests] = usePersisted<BillRequest[]>('billRequests', []);
  const [admins, setAdmins] = usePersisted<Admin[]>('admins', defaultAdmins);
  const [deliverySettings, setDeliverySettings] = usePersisted<DeliverySettings>('deliverySettings', defaultDeliverySettings);
  const [notifications, setNotifications] = usePersisted<Notification[]>('notifications', []);

  // ── Notification helper (no dependency on state to avoid loops) ──
  const addNotification = useCallback((message: string, type: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const n: Notification = { id: Date.now(), message, type, time };
    setNotifications(prev => [n, ...prev.slice(0, 49)]);
  }, [setNotifications]);

  // ── Next ID helper ──
  const nextId = (items: { id: number }[]) => (items.length > 0 ? Math.max(...items.map(i => i.id)) : 0) + 1;

  // ── Menu ──
  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => {
      const newItem = { ...item, id: nextId(prev) };
      return [...prev, newItem];
    });
    addNotification(`آیتم جدید "${item.name}" به منو اضافه شد`, 'menu');
  }, [setMenuItems, addNotification]);

  const updateMenuItem = useCallback((id: number, item: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...item } : m));
  }, [setMenuItems]);

  const deleteMenuItem = useCallback((id: number) => {
    setMenuItems(prev => {
      const item = prev.find(m => m.id === id);
      if (item) addNotification(`آیتم "${item.name}" از منو حذف شد`, 'menu');
      return prev.filter(m => m.id !== id);
    });
  }, [setMenuItems, addNotification]);

  // ── Categories ──
  const addCategory = useCallback((name: string) => {
    setCategories(prev => {
      if (prev.includes(name)) return prev;
      addNotification(`دسته‌بندی "${name}" اضافه شد`, 'category');
      return [...prev, name];
    });
  }, [setCategories, addNotification]);

  const deleteCategory = useCallback((name: string) => {
    setCategories(prev => {
      addNotification(`دسته‌بندی "${name}" حذف شد`, 'category');
      return prev.filter(c => c !== name);
    });
  }, [setCategories, addNotification]);

  // ── Staff ──
  const addStaff = useCallback((staff: Omit<Staff, 'id'>) => {
    setStaffList(prev => {
      const newStaff = { ...staff, id: nextId(prev) };
      return [...prev, newStaff];
    });
    addNotification(`پرسنل جدید "${staff.name}" ثبت شد`, 'staff');
  }, [setStaffList, addNotification]);

  const updateStaff = useCallback((id: number, staff: Partial<Staff>) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, ...staff } : s));
  }, [setStaffList]);

  const deleteStaff = useCallback((id: number) => {
    setStaffList(prev => {
      const staff = prev.find(s => s.id === id);
      if (staff) addNotification(`پرسنل "${staff.name}" حذف شد`, 'staff');
      return prev.filter(s => s.id !== id);
    });
  }, [setStaffList, addNotification]);

  // ── Inventory ──
  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => {
      const newItem = { ...item, id: nextId(prev) };
      return [...prev, newItem];
    });
    addNotification(`کالای "${item.name}" به انبار اضافه شد`, 'inventory');
  }, [setInventory, addNotification]);

  const updateInventoryItem = useCallback((id: number, item: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  }, [setInventory]);

  const deleteInventoryItem = useCallback((id: number) => {
    setInventory(prev => {
      const item = prev.find(i => i.id === id);
      if (item) addNotification(`کالای "${item.name}" از انبار حذف شد`, 'inventory');
      return prev.filter(i => i.id !== id);
    });
  }, [setInventory, addNotification]);

  // ── Tables ──
  const updateTableStatus = useCallback((id: number, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }, [setTables]);

  // ── Reservations ──
  const addReservation = useCallback((res: Omit<Reservation, 'id' | 'createdAt'>) => {
    let newId = 0;
    setReservations(prev => {
      newId = nextId(prev);
      return [...prev, { ...res, id: newId, createdAt: new Date().toISOString() }];
    });
    updateTableStatus(res.tableId, 'reserved');
    addNotification(`رزرو میز ${res.tableNumber} توسط ${res.customerName}`, 'reserve');
    return newId;
  }, [setReservations, updateTableStatus, addNotification]);

  const updateReservation = useCallback((id: number, res: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...res } : r));
  }, [setReservations]);

  // ── Orders ──
  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>) => {
    let newId = 0;
    setOrders(prev => {
      newId = nextId(prev);
      return [...prev, { ...order, id: newId, createdAt: new Date().toISOString() }];
    });
    const typeLabel = order.type === 'dine-in' ? 'میز ' + order.tableNumber : order.type === 'takeout' ? 'بیرون‌بر' : 'ارسال';
    addNotification(`سفارش جدید #${newId || '?'} - ${typeLabel} - ${order.customerName}`, 'order');
    return newId;
  }, [setOrders, addNotification]);

  const updateOrder = useCallback((id: number, order: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o));
  }, [setOrders]);

  // ── Bill Requests ──
  const addBillRequest = useCallback((tableNumber: number) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const req: BillRequest = { id: Date.now(), tableNumber, time, status: 'pending', createdAt: now.toISOString() };
    setBillRequests(prev => [req, ...prev]);
    addNotification(`درخواست صورتحساب میز ${tableNumber} 💳`, 'bill');
  }, [setBillRequests, addNotification]);

  const updateBillRequest = useCallback((id: number, status: BillRequest['status']) => {
    setBillRequests(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, [setBillRequests]);

  // ── Admins ──
  const addAdmin = useCallback((admin: Omit<Admin, 'id' | 'createdAt'>) => {
    setAdmins(prev => {
      const newAdmin: Admin = {
        ...admin,
        id: nextId(prev),
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      return [...prev, newAdmin];
    });
    addNotification(`ادمین جدید "${admin.name}" اضافه شد`, 'admin');
  }, [setAdmins, addNotification]);

  const deleteAdmin = useCallback((id: number) => {
    setAdmins(prev => {
      const admin = prev.find(a => a.id === id);
      if (!admin || admin.role === 'super') return prev;
      addNotification(`ادمین "${admin.name}" حذف شد`, 'admin');
      return prev.filter(a => a.id !== id);
    });
  }, [setAdmins, addNotification]);

  const validateAdmin = useCallback((username: string, password: string): Admin | null => {
    return admins.find(a => a.username === username && a.password === password) || null;
  }, [admins]);

  // ── Delivery Settings ──
  const updateDeliverySettingsFn = useCallback((settings: Partial<DeliverySettings>) => {
    setDeliverySettings(prev => ({ ...prev, ...settings }));
  }, [setDeliverySettings]);

  return (
    <AppContext.Provider value={{
      menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
      categories, addCategory, deleteCategory,
      staffList, addStaff, updateStaff, deleteStaff,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      tables, updateTableStatus,
      reservations, addReservation, updateReservation,
      orders, addOrder, updateOrder,
      billRequests, addBillRequest, updateBillRequest,
      admins, addAdmin, deleteAdmin, validateAdmin,
      deliverySettings, updateDeliverySettings: updateDeliverySettingsFn,
      notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
