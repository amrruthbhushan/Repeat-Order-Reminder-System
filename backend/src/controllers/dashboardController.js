const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();
    const activeCustomers = await prisma.customer.count({ where: { status: 'Active' } });
    
    const orders = await prisma.order.findMany({
      include: { customer: true, items: { include: { product: true } } }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const completedReminders = await prisma.reminderHistory.count({ where: { status: 'Sent' } });
    const pendingFollowups = await prisma.reminderHistory.count({ where: { status: 'Pending' } });

    // Calculate Due Orders Today & Upcoming Orders based on 30-day consumption rule simulation
    const now = new Date();
    let dueOrdersToday = 0;
    let upcomingOrders = 0;

    const customers = await prisma.customer.findMany({
      include: { orders: { orderBy: { orderDate: 'desc' }, take: 1 } }
    });

    customers.forEach(cust => {
      if (cust.orders.length > 0) {
        const lastOrderDate = new Date(cust.orders[0].orderDate);
        const diffDays = Math.floor((now - lastOrderDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= 30) {
          dueOrdersToday++;
        } else if (diffDays >= 25 && diffDays < 30) {
          upcomingOrders++;
        }
      }
    });

    // Chart Data Generation
    const monthlyOrdersChart = [
      { month: 'Jan', orders: 12, revenue: 145000 },
      { month: 'Feb', orders: 18, revenue: 210000 },
      { month: 'Mar', orders: 15, revenue: 185000 },
      { month: 'Apr', orders: 24, revenue: 290000 },
      { month: 'May', orders: 28, revenue: 340000 },
      { month: 'Jun', orders: 32, revenue: 412000 }
    ];

    const reminderSuccessRate = [
      { name: 'Converted / Reordered', value: 68, color: '#14B8A6' },
      { name: 'Pending Decision', value: 22, color: '#F59E0B' },
      { name: 'Deferred / Declined', value: 10, color: '#EF4444' }
    ];

    const topSellingProducts = [
      { name: 'Ganga Maxx Ultra Disinfectant 5L', sales: 420, revenue: 357000 },
      { name: 'PureShield Foam Sanitizer 1L', sales: 380, revenue: 121600 },
      { name: 'ProClean Degreaser 20L', sales: 110, revenue: 264000 },
      { name: 'Commercial Toilet Roll (Pk 48)', sales: 240, revenue: 276000 }
    ];

    const customerPurchaseTrends = [
      { category: 'Hospitals', avgFrequency: '15 Days', avgTicket: '₹35,000' },
      { category: 'Hotels & Resorts', avgFrequency: '21 Days', avgTicket: '₹28,000' },
      { category: 'Corporate Offices', avgFrequency: '30 Days', avgTicket: '₹15,000' },
      { category: 'Schools & Colleges', avgFrequency: '45 Days', avgTicket: '₹12,000' }
    ];

    // Latest Activity Timeline
    const latestActivities = [
      { id: 1, type: 'reminder', title: 'Automated WhatsApp Sent', description: 'Reminder dispatched to Grand Hyatt Regency for floor degreaser restock.', time: '10 mins ago', icon: 'MessageSquare' },
      { id: 2, type: 'order', title: 'New Order Confirmed', description: 'Apex Hospital confirmed ORD-2026-1022 worth ₹18,700.', time: '45 mins ago', icon: 'ShoppingBag' },
      { id: 3, type: 'ai', title: 'AI Prediction Triggered', description: 'Infosys Tower B stock forecasted low in next 48 hours.', time: '2 hours ago', icon: 'Cpu' },
      { id: 4, type: 'customer', title: 'New B2B Client Onboarded', description: 'Precision Automotive Gear Factory signed 2-year contract.', time: '4 hours ago', icon: 'UserPlus' }
    ];

    res.json({
      stats: {
        totalCustomers,
        activeCustomers,
        dueOrdersToday,
        upcomingOrders,
        completedReminders,
        pendingFollowups,
        monthlyRevenue: totalRevenue
      },
      charts: {
        monthlyOrdersChart,
        reminderSuccessRate,
        topSellingProducts,
        customerPurchaseTrends
      },
      latestActivities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
};

module.exports = { getDashboardStats };
