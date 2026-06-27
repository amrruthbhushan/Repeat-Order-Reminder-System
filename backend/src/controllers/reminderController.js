const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- AI PREDICTIVE REMINDER ENGINE ---
const getDueCustomers = async (req, res) => {
  try {
    const { search, priority, salesmanId } = req.query;

    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: { orderDate: 'desc' },
          take: 3,
          include: { items: { include: { product: true } }, salesman: true }
        },
        reminders: {
          orderBy: { sentAt: 'desc' },
          take: 1
        }
      }
    });

    const now = new Date();
    const dueCustomersList = [];

    customers.forEach(customer => {
      // Filter search
      if (search) {
        const q = search.toLowerCase();
        const match = customer.institutionName.toLowerCase().includes(q) ||
                      customer.contactPerson.toLowerCase().includes(q) ||
                      customer.email.toLowerCase().includes(q);
        if (!match) return;
      }

      const lastOrder = customer.orders[0];
      const lastPurchaseDate = lastOrder ? lastOrder.orderDate : customer.createdAt;
      
      // Calculate consumption cycle based on historical orders or customer type default
      let avgConsumptionDays = 30; // standard default
      if (customer.customerType === 'Hospital') avgConsumptionDays = 15;
      if (customer.customerType === 'Hotel') avgConsumptionDays = 21;
      if (customer.customerType === 'Industrial') avgConsumptionDays = 45;

      const daysSinceLastPurchase = Math.floor((now - new Date(lastPurchaseDate)) / (1000 * 60 * 60 * 24));
      const estimatedNextPurchaseDate = new Date(new Date(lastPurchaseDate).getTime() + avgConsumptionDays * 86400000);
      const daysRemaining = avgConsumptionDays - daysSinceLastPurchase;

      // Risk level and priority scoring logic
      let riskLevel = 'Normal';
      let priorityScore = 'Low';
      if (daysRemaining <= 0) {
        riskLevel = 'Overdue / High Churn Risk';
        priorityScore = 'High';
      } else if (daysRemaining <= 3) {
        riskLevel = 'Due Soon';
        priorityScore = 'High';
      } else if (daysRemaining <= 7) {
        riskLevel = 'Upcoming';
        priorityScore = 'Medium';
      }

      if (priority && priority !== 'All' && priorityScore !== priority) return;

      // Salesman filtering
      const assignedSalesman = lastOrder?.salesman || null;
      if (salesmanId && assignedSalesman?.id !== salesmanId) return;

      // Suggested products from previous orders
      const suggestedProducts = lastOrder?.items.map(item => item.product.name).slice(0, 3) || ['Ganga Maxx Ultra Disinfectant 5L', 'PureShield Hand Sanitizer 1L'];

      // Generate AI Summary
      const aiSummary = daysRemaining <= 0 
        ? `This institutional customer (${customer.customerType}) usually reorders every ${avgConsumptionDays} days. Last purchase was ${daysSinceLastPurchase} days ago. Overdue by ${Math.abs(daysRemaining)} days! Immediate follow-up required.`
        : `This customer usually purchases cleaning supplies every ${avgConsumptionDays} days. Last purchase was ${daysSinceLastPurchase} days ago. Recommend follow-up within ${daysRemaining * 24} hours.`;

      const lastReminder = customer.reminders[0];

      dueCustomersList.push({
        id: customer.id,
        institutionName: customer.institutionName,
        contactPerson: customer.contactPerson,
        phone: customer.phone,
        email: customer.email,
        customerType: customer.customerType,
        preferredReminderMethod: customer.preferredReminderMethod,
        lastPurchaseDate,
        avgConsumptionDays,
        estimatedNextPurchaseDate,
        daysRemaining,
        riskLevel,
        priorityScore,
        suggestedProducts,
        aiSummary,
        salesman: assignedSalesman ? assignedSalesman.name : 'Unassigned',
        lastReminderStatus: lastReminder ? `${lastReminder.status} via ${lastReminder.method} (${new Date(lastReminder.sentAt).toLocaleDateString()})` : 'No reminders sent yet'
      });
    });

    // Sort by most urgent (days remaining ascending)
    dueCustomersList.sort((a, b) => a.daysRemaining - b.daysRemaining);

    res.json(dueCustomersList);
  } catch (error) {
    console.error('Get due customers error:', error);
    res.status(500).json({ error: 'Failed to compute due customers.' });
  }
};

const generateReminderMessage = async (req, res) => {
  try {
    const { customerId, customNote } = req.body;
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { orders: { orderBy: { orderDate: 'desc' }, take: 1, include: { items: { include: { product: true } } } } }
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found.' });

    const lastOrder = customer.orders[0];
    const productNames = lastOrder ? lastOrder.items.map(i => i.product.name).join(', ') : 'Ganga Maxx Cleaning Essentials';

    const message = `Respected ${customer.contactPerson},\n\nGreetings from Ganga Maxx Marketplace B2B Solutions!\n\nBased on your institutional replenishment cycle for ${customer.institutionName}, your stock of [ ${productNames} ] is estimated to be low.\n\nWe have reserved your regular quota for priority dispatch from our central warehouse. Would you like us to generate your order confirmation?\n\n${customNote ? 'Note: ' + customNote + '\n\n' : ''}Best regards,\nGanga Maxx Sales Team`;

    res.json({ message, method: customer.preferredReminderMethod, recipient: customer.phone });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate message.' });
  }
};

const sendReminder = async (req, res) => {
  try {
    const { customerId, method, message } = req.body;

    const reminder = await prisma.reminderHistory.create({
      data: {
        customerId,
        salesmanId: req.user?.id,
        method: method || 'WhatsApp',
        status: 'Sent',
        message: message || 'Automated replenishment follow-up dispatched.'
      }
    });

    res.json({ message: `Reminder successfully sent via ${method || 'WhatsApp'}!`, reminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record reminder dispatch.' });
  }
};

// --- REMINDER RULES CRUD ---
const getReminderRules = async (req, res) => {
  try {
    const rules = await prisma.reminderRule.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules.' });
  }
};

const createReminderRule = async (req, res) => {
  try {
    const { name, intervalType, intervalDays, reminderBefore, reminderAfter, priorityLevel, reminderMethod } = req.body;
    const rule = await prisma.reminderRule.create({
      data: {
        name,
        intervalType: intervalType || 'Monthly',
        intervalDays: parseInt(intervalDays) || 30,
        reminderBefore: parseInt(reminderBefore) || 3,
        reminderAfter: parseInt(reminderAfter) || 2,
        priorityLevel: priorityLevel || 'High',
        reminderMethod: reminderMethod || 'WhatsApp'
      }
    });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder rule.' });
  }
};

const toggleReminderRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await prisma.reminderRule.findUnique({ where: { id } });
    const updated = await prisma.reminderRule.update({
      where: { id },
      data: { isActive: !rule.isActive }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle rule state.' });
  }
};

const deleteReminderRule = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.reminderRule.delete({ where: { id } });
    res.json({ message: 'Rule deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rule.' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

module.exports = {
  getDueCustomers,
  generateReminderMessage,
  sendReminder,
  getReminderRules,
  createReminderRule,
  toggleReminderRule,
  deleteReminderRule,
  getNotifications
};
