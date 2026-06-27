const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed database for Ganga Maxx Repeat Order Reminder System...');

  // 1. Clear existing data
  await prisma.notification.deleteMany({});
  await prisma.reminderHistory.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.reminderRule.deleteMany({});
  await prisma.setting.deleteMany({});

  // 2. Roles
  const rolesData = [
    { name: 'Admin', permissions: JSON.stringify(['all']) },
    { name: 'Sales Admin', permissions: JSON.stringify(['customers', 'orders', 'reminders', 'reports']) },
    { name: 'Salesman', permissions: JSON.stringify(['customers', 'orders', 'reminders']) },
    { name: 'Warehouse Staff', permissions: JSON.stringify(['products', 'orders']) },
    { name: 'Accounts Manager', permissions: JSON.stringify(['orders', 'reports']) },
    { name: 'Compliance Admin', permissions: JSON.stringify(['products', 'reports', 'settings']) },
  ];

  const roles = {};
  for (const r of rolesData) {
    roles[r.name] = await prisma.role.create({ data: r });
  }

  // 3. Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const usersData = [
    { name: 'Vikram Sharma', email: 'admin@gangamaxx.com', roleId: roles['Admin'].id },
    { name: 'Neha Gupta', email: 'salesadmin@gangamaxx.com', roleId: roles['Sales Admin'].id },
    { name: 'Rajesh Kumar', email: 'rajesh@gangamaxx.com', roleId: roles['Salesman'].id },
    { name: 'Amit Verma', email: 'amit@gangamaxx.com', roleId: roles['Salesman'].id },
    { name: 'Sanjay Patel', email: 'warehouse@gangamaxx.com', roleId: roles['Warehouse Staff'].id },
    { name: 'Pooja Mehta', email: 'accounts@gangamaxx.com', roleId: roles['Accounts Manager'].id },
    { name: 'Dr. Alok Nath', email: 'compliance@gangamaxx.com', roleId: roles['Compliance Admin'].id },
  ];

  const users = {};
  for (const u of usersData) {
    users[u.email] = await prisma.user.create({
      data: { ...u, password: hashedPassword }
    });
  }

  // 4. Products (Cleaning & Hygiene Supplies for B2B)
  const productsData = [
    { name: 'Ganga Maxx Ultra Disinfectant Cleaner 5L', sku: 'GM-DIS-5L', category: 'Disinfectants', price: 850.0, warehouse: 'North Central Hub', stock: 420, minStock: 50, safetyInfo: 'Wear gloves during dilution. Keep away from direct sunlight.' },
    { name: 'ProClean Heavy Duty Floor Degreaser 20L', sku: 'GM-DEG-20L', category: 'Surface Cleaners', price: 2400.0, warehouse: 'North Central Hub', stock: 150, minStock: 20, safetyInfo: 'Corrosive concentrate. Use alkaline resistant safety eyewear.' },
    { name: 'PureShield Foam Hand Sanitizer Refill 1L', sku: 'GM-SAN-1L', category: 'Hand Hygiene', price: 320.0, warehouse: 'East Bay Warehouse', stock: 890, minStock: 100, safetyInfo: 'Flammable liquid Class 3. Store in cool place.' },
    { name: 'Ganga Soft Commercial Toilet Roll (Pack of 48)', sku: 'GM-PPR-48', category: 'Accessories', price: 1150.0, warehouse: 'North Central Hub', stock: 300, minStock: 40, safetyInfo: 'Eco-friendly recycled paper pulp.' },
    { name: 'BioSan Hospital Grade Surface Sanitizing Wipes', sku: 'GM-WIP-100', category: 'Disinfectants', price: 450.0, warehouse: 'West Hub Mumbai', stock: 650, minStock: 80, safetyInfo: 'Alcohol-free quaternary ammonium formula.' },
    { name: 'Industrial Automated Floor Scrubber Pads (Set of 5)', sku: 'GM-PAD-IND', category: 'Accessories', price: 1800.0, warehouse: 'South Hub Bangalore', stock: 45, minStock: 15, safetyInfo: 'Heavy duty abrasive nylon weave.' },
    { name: 'LaundroMax Ultra Concentrate Detergent 25kg', sku: 'GM-LND-25K', category: 'Laundry', price: 3800.0, warehouse: 'North Central Hub', stock: 90, minStock: 25, safetyInfo: 'Enzymatic commercial laundry wash.' }
  ];

  const products = [];
  for (const p of productsData) {
    products.push(await prisma.product.create({ data: p }));
  }

  // 5. Institutional Customers
  const customersData = [
    {
      institutionName: 'Apex Super Specialty Hospital',
      contactPerson: 'Dr. Sunita Deshmukh (Procurement Dir.)',
      phone: '+91 98765 43210',
      email: 'procurement@apexhospital.org',
      location: 'Connaught Place, New Delhi',
      customerType: 'Hospital',
      contractStart: new Date('2025-01-15'),
      contractEnd: new Date('2027-01-14'),
      preferredReminderMethod: 'WhatsApp',
      status: 'Active'
    },
    {
      institutionName: 'Grand Hyatt Regency Hotel',
      contactPerson: 'Rohan Kapoor (Executive Housekeeper)',
      phone: '+91 98112 34567',
      email: 'housekeeping@grandhyattregency.com',
      location: 'Aerocity, New Delhi',
      customerType: 'Hotel',
      contractStart: new Date('2024-06-01'),
      contractEnd: new Date('2026-05-31'),
      preferredReminderMethod: 'Email',
      status: 'Active'
    },
    {
      institutionName: 'Infosys Software Campus - Tower B',
      contactPerson: 'Manish Malhotra (Facilities Manager)',
      phone: '+91 99001 12233',
      email: 'facilities.delhi@infosys.com',
      location: 'Noida Sector 62',
      customerType: 'Corporate',
      contractStart: new Date('2025-03-01'),
      contractEnd: new Date('2026-02-28'),
      preferredReminderMethod: 'WhatsApp',
      status: 'Active'
    },
    {
      institutionName: 'St. Xavier International Academy',
      contactPerson: 'Brother Joseph (Admin Officer)',
      phone: '+91 97170 88990',
      email: 'admin@stxavierschool.edu.in',
      location: 'Gurugram Phase 5',
      customerType: 'School',
      contractStart: new Date('2024-04-01'),
      contractEnd: new Date('2026-03-31'),
      preferredReminderMethod: 'SMS',
      status: 'Active'
    },
    {
      institutionName: 'Precision Automotive Gear Factory',
      contactPerson: 'Karan Sharma (Plant Admin)',
      phone: '+91 94550 66778',
      email: 'karan.s@precisionauto.co.in',
      location: 'IMT Manesar, Haryana',
      customerType: 'Industrial',
      contractStart: new Date('2024-10-01'),
      contractEnd: new Date('2026-09-30'),
      preferredReminderMethod: 'WhatsApp',
      status: 'Active'
    }
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(await prisma.customer.create({ data: c }));
  }

  // 6. Reminder Rules
  const reminderRulesData = [
    { name: 'Standard Institutional Monthly Cycle', intervalType: 'Monthly', intervalDays: 30, reminderBefore: 3, reminderAfter: 2, priorityLevel: 'High', reminderMethod: 'WhatsApp', isActive: true },
    { name: 'High-Volume Hospital Disinfectant Rule', intervalType: 'Custom Interval', intervalDays: 15, reminderBefore: 4, reminderAfter: 1, priorityLevel: 'High', reminderMethod: 'WhatsApp', isActive: true },
    { name: 'Hotel Housekeeping Bi-Weekly Replenishment', intervalType: 'Custom Interval', intervalDays: 14, reminderBefore: 2, reminderAfter: 2, priorityLevel: 'Medium', reminderMethod: 'Email', isActive: true },
    { name: 'Quarterly Industrial Degreaser Restock', intervalType: 'Custom Interval', intervalDays: 90, reminderBefore: 7, reminderAfter: 5, priorityLevel: 'Low', reminderMethod: 'SMS', isActive: true },
  ];

  for (const rule of reminderRulesData) {
    await prisma.reminderRule.create({ data: rule });
  }

  // 7. Orders & Order Items (creating rich history to feed AI consumption predictor)
  const rajesh = users['rajesh@gangamaxx.com'];
  const amit = users['amit@gangamaxx.com'];

  // Order 1 for Apex Hospital (28 days ago - so due in 2 days based on 30 day cycle)
  const date28DaysAgo = new Date();
  date28DaysAgo.setDate(date28DaysAgo.getDate() - 28);

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-1001',
      customerId: customers[0].id, // Apex Hospital
      salesmanId: rajesh.id,
      totalAmount: 18700.0,
      orderDate: date28DaysAgo,
      deliveryDate: new Date(date28DaysAgo.getTime() + 86400000),
      status: 'Delivered',
      items: {
        create: [
          { productId: products[0].id, quantity: 15, price: 850.0 }, // Disinfectant 5L
          { productId: products[2].id, quantity: 10, price: 320.0 }, // Sanitizer 1L
          { productId: products[4].id, quantity: 6, price: 450.0 }   // Wipes
        ]
      }
    }
  });

  // Order 2 for Grand Hyatt (32 days ago - OVERDUE for 30 day cycle)
  const date32DaysAgo = new Date();
  date32DaysAgo.setDate(date32DaysAgo.getDate() - 32);

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-0984',
      customerId: customers[1].id, // Grand Hyatt
      salesmanId: amit.id,
      totalAmount: 34500.0,
      orderDate: date32DaysAgo,
      deliveryDate: new Date(date32DaysAgo.getTime() + 86400000),
      status: 'Delivered',
      items: {
        create: [
          { productId: products[1].id, quantity: 8, price: 2400.0 }, // Degreaser 20L
          { productId: products[3].id, quantity: 10, price: 1150.0 },// Paper Rolls
          { productId: products[6].id, quantity: 1, price: 3800.0 }  // Laundry Detergent
        ]
      }
    }
  });

  // Order 3 for Infosys Campus (12 days ago)
  const date12DaysAgo = new Date();
  date12DaysAgo.setDate(date12DaysAgo.getDate() - 12);

  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-1015',
      customerId: customers[2].id,
      salesmanId: rajesh.id,
      totalAmount: 14700.0,
      orderDate: date12DaysAgo,
      deliveryDate: new Date(date12DaysAgo.getTime() + 86400000),
      status: 'Delivered',
      items: {
        create: [
          { productId: products[0].id, quantity: 10, price: 850.0 },
          { productId: products[2].id, quantity: 10, price: 320.0 },
          { productId: products[3].id, quantity: 2, price: 1150.0 }
        ]
      }
    }
  });

  // 8. Reminder History
  await prisma.reminderHistory.create({
    data: {
      customerId: customers[1].id,
      salesmanId: amit.id,
      method: 'Email',
      status: 'Sent',
      message: 'Hi Rohan, your 30-day bi-weekly replenishment cycle for Grand Hyatt Regency Hotel is due today. Would you like to re-order Degreaser 20L and Paper Rolls?',
      sentAt: new Date()
    }
  });

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      { userId: users['admin@gangamaxx.com'].id, title: 'Due Order Alert', message: 'Grand Hyatt Regency Hotel reorder is overdue by 2 days.', type: 'urgent' },
      { userId: users['admin@gangamaxx.com'].id, title: 'Upcoming Reorder', message: 'Apex Super Specialty Hospital will be due in 28 hours.', type: 'info' },
      { userId: users['rajesh@gangamaxx.com'].id, title: 'Customer Contact Verified', message: 'Infosys Tower B updated preferred contact person.', type: 'success' }
    ]
  });

  // 10. System Settings
  const settingsData = [
    { key: 'company_name', value: 'Ganga Maxx Marketplace B2B Solutions' },
    { key: 'whatsapp_api_status', value: 'Connected (Twilio Business API)' },
    { key: 'ai_engine_confidence_threshold', value: '88%' },
    { key: 'email_sender', value: 'reorders@gangamaxx.com' },
    { key: 'default_currency', value: 'INR (₹)' },
    { key: 'whatsapp_template', value: 'Dear {{contactPerson}}, this is {{salesmanName}} from Ganga Maxx Marketplace. Based on your usage cycle, your stock of {{suggestedProducts}} for {{institutionName}} may be running low. Reply YES to auto-generate PO.' }
  ];

  for (const s of settingsData) {
    await prisma.setting.create({ data: s });
  }

  console.log('✅ Database successfully seeded with full production mock data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
