import { MenuItem, Table, Staff, Customer, InventoryItem, DailyRevenue } from './types';

// Local images
const IMAGES = {
  espresso: '/images/espresso.jpg',
  cappuccino: '/images/cappuccino.jpg',
  latte: '/images/latte.jpg',
  mocha: '/images/mocha.jpg',
  cheesecake: '/images/cheesecake.jpg',
  tiramisu: '/images/tiramisu.jpg',
  croissant: '/images/croissant.jpg',
  hero: '/images/hero-bg.jpg',
  interior: '/images/interior.jpg',
  terrace: '/images/terrace.jpg',
};

export const menuImages = IMAGES;

export const menuItems: MenuItem[] = [
  { id: 1, name: 'اسپرسو', nameEn: 'Espresso', price: 65000, category: 'قهوه', image: IMAGES.espresso, description: 'اسپرسو تازه دم با دانه‌های مرغوب', available: true },
  { id: 2, name: 'کاپوچینو', nameEn: 'Cappuccino', price: 85000, category: 'قهوه', image: IMAGES.cappuccino, description: 'کاپوچینو با فوم شیر ابریشمی', available: true },
  { id: 3, name: 'لاته', nameEn: 'Latte', price: 90000, category: 'قهوه', image: IMAGES.latte, description: 'لاته آرت با شیر تازه', available: true },
  { id: 4, name: 'موکا', nameEn: 'Mocha', price: 95000, category: 'قهوه', image: IMAGES.mocha, description: 'ترکیب بی‌نظیر قهوه و شکلات', available: true },
  { id: 5, name: 'آمریکانو', nameEn: 'Americano', price: 70000, category: 'قهوه', image: IMAGES.espresso, description: 'آمریکانو تازه و معطر', available: true },
  { id: 6, name: 'قهوه ترک', nameEn: 'Turkish Coffee', price: 75000, category: 'قهوه', image: IMAGES.mocha, description: 'قهوه ترک اصیل با هل', available: true },
  { id: 7, name: 'چای ماسالا', nameEn: 'Masala Tea', price: 60000, category: 'نوشیدنی گرم', image: IMAGES.cappuccino, description: 'چای ماسالا با ادویه‌جات هندی', available: true },
  { id: 8, name: 'هات چاکلت', nameEn: 'Hot Chocolate', price: 80000, category: 'نوشیدنی گرم', image: IMAGES.mocha, description: 'شکلات داغ غلیظ با خامه', available: true },
  { id: 9, name: 'آیس لاته', nameEn: 'Iced Latte', price: 95000, category: 'نوشیدنی سرد', image: IMAGES.latte, description: 'لاته سرد با یخ و شیر تازه', available: true },
  { id: 10, name: 'اسموتی توت فرنگی', nameEn: 'Strawberry Smoothie', price: 110000, category: 'نوشیدنی سرد', image: IMAGES.latte, description: 'اسموتی تازه با توت فرنگی', available: true },
  { id: 11, name: 'موهیتو', nameEn: 'Mojito', price: 100000, category: 'نوشیدنی سرد', image: IMAGES.latte, description: 'موهیتو نعنا و لیمو تازه', available: true },
  { id: 12, name: 'چیزکیک', nameEn: 'Cheesecake', price: 120000, category: 'دسر', image: IMAGES.cheesecake, description: 'چیزکیک خامه‌ای نیویورکی', available: true },
  { id: 13, name: 'تیرامیسو', nameEn: 'Tiramisu', price: 130000, category: 'دسر', image: IMAGES.tiramisu, description: 'تیرامیسوی کلاسیک ایتالیایی', available: true },
  { id: 14, name: 'کروسان', nameEn: 'Croissant', price: 85000, category: 'دسر', image: IMAGES.croissant, description: 'کروسان تازه فرانسوی', available: true },
  { id: 15, name: 'براونی', nameEn: 'Brownie', price: 95000, category: 'دسر', image: IMAGES.tiramisu, description: 'براونی شکلاتی خانگی', available: true },
  { id: 16, name: 'ساندویچ مرغ', nameEn: 'Chicken Sandwich', price: 150000, category: 'فست فود', image: IMAGES.croissant, description: 'ساندویچ مرغ گریل شده', available: true },
  { id: 17, name: 'پنینی', nameEn: 'Panini', price: 140000, category: 'فست فود', image: IMAGES.croissant, description: 'پنینی گوشت و پنیر', available: true },
  { id: 18, name: 'سالاد سزار', nameEn: 'Caesar Salad', price: 130000, category: 'فست فود', image: IMAGES.croissant, description: 'سالاد سزار با مرغ گریل', available: true },
];

export const tables: Table[] = [
  { id: 1, number: 1, capacity: 2, status: 'available', floor: 'طبقه همکف' },
  { id: 2, number: 2, capacity: 2, status: 'reserved', floor: 'طبقه همکف' },
  { id: 3, number: 3, capacity: 4, status: 'available', floor: 'طبقه همکف' },
  { id: 4, number: 4, capacity: 4, status: 'occupied', floor: 'طبقه همکف' },
  { id: 5, number: 5, capacity: 6, status: 'available', floor: 'طبقه همکف' },
  { id: 6, number: 6, capacity: 2, status: 'available', floor: 'طبقه اول' },
  { id: 7, number: 7, capacity: 4, status: 'reserved', floor: 'طبقه اول' },
  { id: 8, number: 8, capacity: 8, status: 'available', floor: 'طبقه اول' },
  { id: 9, number: 9, capacity: 4, status: 'available', floor: 'تراس' },
  { id: 10, number: 10, capacity: 6, status: 'occupied', floor: 'تراس' },
  { id: 11, number: 11, capacity: 2, status: 'available', floor: 'تراس' },
  { id: 12, number: 12, capacity: 4, status: 'available', floor: 'تراس' },
];

export const staffMembers: Staff[] = [
  { id: 1, name: 'علی محمدی', role: 'مدیر کافه', phone: '09121234567', avatar: '👨‍💼', tips: 0, leaveDays: 26, leaveUsed: 5 },
  { id: 2, name: 'سارا احمدی', role: 'باریستا ارشد', phone: '09129876543', avatar: '👩‍🍳', tips: 2500000, leaveDays: 26, leaveUsed: 8 },
  { id: 3, name: 'محمد رضایی', role: 'باریستا', phone: '09123456789', avatar: '👨‍🍳', tips: 1800000, leaveDays: 26, leaveUsed: 3 },
  { id: 4, name: 'فاطمه حسینی', role: 'گارسون', phone: '09127654321', avatar: '👩‍🍳', tips: 3200000, leaveDays: 26, leaveUsed: 10 },
  { id: 5, name: 'رضا کریمی', role: 'گارسون', phone: '09125551234', avatar: '🧑‍🍳', tips: 2900000, leaveDays: 26, leaveUsed: 7 },
  { id: 6, name: 'نازنین عباسی', role: 'صندوقدار', phone: '09128889999', avatar: '👩‍💻', tips: 500000, leaveDays: 26, leaveUsed: 4 },
  { id: 7, name: 'امیر جعفری', role: 'آشپز', phone: '09124447777', avatar: '👨‍🍳', tips: 1200000, leaveDays: 26, leaveUsed: 12 },
];

export const customers: Customer[] = [
  { id: 1, name: 'مریم کاظمی', phone: '09131112222', email: 'maryam@email.com', level: 'gold', points: 15000, totalSpent: 45000000, joinDate: '1402/01/15', address: 'تهران، خیابان ولیعصر، پلاک 120' },
  { id: 2, name: 'حسین نوری', phone: '09133334444', email: 'hossein@email.com', level: 'silver', points: 8500, totalSpent: 22000000, joinDate: '1402/03/20', address: 'تهران، خیابان شریعتی، پلاک 85' },
  { id: 3, name: 'زهرا میرزایی', phone: '09135556666', email: 'zahra@email.com', level: 'gold', points: 12000, totalSpent: 38000000, joinDate: '1401/11/05', address: 'تهران، جردن، بلوار آفریقا' },
  { id: 4, name: 'امیرعلی صادقی', phone: '09137778888', email: 'amir@email.com', level: 'bronze', points: 3000, totalSpent: 8500000, joinDate: '1402/06/10', address: 'تهران، تجریش، میدان قدس' },
  { id: 5, name: 'نگین رحیمی', phone: '09139990000', email: 'negin@email.com', level: 'silver', points: 7200, totalSpent: 19000000, joinDate: '1402/02/25', address: 'تهران، سعادت‌آباد، بلوار 24 متری' },
  { id: 6, name: 'پارسا دهقانی', phone: '09131231234', email: 'parsa@email.com', level: 'bronze', points: 1500, totalSpent: 4200000, joinDate: '1403/01/01', address: 'تهران، پونک، بلوار عدل' },
];

export const inventoryItems: InventoryItem[] = [
  { id: 1, name: 'دانه قهوه عربیکا', quantity: 25, unit: 'کیلوگرم', minStock: 10, lastRestocked: '1403/02/15', cost: 2500000 },
  { id: 2, name: 'شیر تازه', quantity: 40, unit: 'لیتر', minStock: 20, lastRestocked: '1403/02/20', cost: 120000 },
  { id: 3, name: 'شکر', quantity: 15, unit: 'کیلوگرم', minStock: 5, lastRestocked: '1403/02/10', cost: 80000 },
  { id: 4, name: 'خامه فرم', quantity: 8, unit: 'لیتر', minStock: 5, lastRestocked: '1403/02/18', cost: 250000 },
  { id: 5, name: 'شکلات تخته‌ای', quantity: 12, unit: 'کیلوگرم', minStock: 5, lastRestocked: '1403/02/12', cost: 450000 },
  { id: 6, name: 'چای ایرانی', quantity: 5, unit: 'کیلوگرم', minStock: 3, lastRestocked: '1403/02/05', cost: 350000 },
  { id: 7, name: 'وانیل', quantity: 3, unit: 'لیتر', minStock: 2, lastRestocked: '1403/02/08', cost: 180000 },
  { id: 8, name: 'نعنا تازه', quantity: 2, unit: 'کیلوگرم', minStock: 1, lastRestocked: '1403/02/19', cost: 60000 },
  { id: 9, name: 'لیوان یکبار مصرف', quantity: 500, unit: 'عدد', minStock: 200, lastRestocked: '1403/02/14', cost: 350000 },
  { id: 10, name: 'دستمال کاغذی', quantity: 100, unit: 'بسته', minStock: 30, lastRestocked: '1403/02/16', cost: 150000 },
];

export const dailyRevenues: DailyRevenue[] = [
  { date: '1403/02/15', totalSales: 12500000, orders: 85, avgOrderValue: 147000 },
  { date: '1403/02/16', totalSales: 14200000, orders: 92, avgOrderValue: 154000 },
  { date: '1403/02/17', totalSales: 18900000, orders: 120, avgOrderValue: 157500 },
  { date: '1403/02/18', totalSales: 16700000, orders: 105, avgOrderValue: 159000 },
  { date: '1403/02/19', totalSales: 11300000, orders: 78, avgOrderValue: 144800 },
  { date: '1403/02/20', totalSales: 19800000, orders: 130, avgOrderValue: 152300 },
  { date: '1403/02/21', totalSales: 21500000, orders: 142, avgOrderValue: 151400 },
  { date: '1403/02/22', totalSales: 15600000, orders: 98, avgOrderValue: 159100 },
  { date: '1403/02/23', totalSales: 17400000, orders: 112, avgOrderValue: 155300 },
  { date: '1403/02/24', totalSales: 20100000, orders: 128, avgOrderValue: 157000 },
];

export const formatPrice = (price: number): string => {
  return price.toLocaleString('fa-IR') + ' تومان';
};
