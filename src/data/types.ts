export interface MenuItem {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available: boolean;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
  floor: string;
}

export interface Reservation {
  id: number;
  tableId: number;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  tips: number;
  leaveDays: number;
  leaveUsed: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  level: 'bronze' | 'silver' | 'gold';
  points: number;
  totalSpent: number;
  joinDate: string;
  address: string;
}

export interface Order {
  id: number;
  items: { menuItem: MenuItem; quantity: number }[];
  total: number;
  date: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  tableNumber?: number;
  type: 'dine-in' | 'takeout' | 'delivery';
}

export interface DailyRevenue {
  date: string;
  totalSales: number;
  orders: number;
  avgOrderValue: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  lastRestocked: string;
  cost: number;
}
