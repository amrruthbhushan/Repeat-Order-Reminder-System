const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCustomers = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { institutionName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } },
        { location: { contains: search } }
      ];
    }
    if (type) where.customerType = type;
    if (status) where.status = status;

    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          orderBy: { orderDate: 'desc' },
          take: 5
        },
        reminders: {
          orderBy: { sentAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { orderDate: 'desc' }
        },
        reminders: {
          include: { salesman: true },
          orderBy: { sentAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer details.' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const {
      institutionName,
      contactPerson,
      phone,
      email,
      location,
      customerType,
      contractStart,
      contractEnd,
      preferredReminderMethod
    } = req.body;

    if (!institutionName || !contactPerson || !phone || !email) {
      return res.status(400).json({ error: 'Institution name, contact person, phone and email are required.' });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        institutionName,
        contactPerson,
        phone,
        email,
        location: location || 'Delhi NCR',
        customerType: customerType || 'Corporate',
        contractStart: contractStart ? new Date(contractStart) : new Date(),
        contractEnd: contractEnd ? new Date(contractEnd) : new Date(Date.now() + 365 * 86400000),
        preferredReminderMethod: preferredReminderMethod || 'WhatsApp'
      }
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer.' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.contractStart) data.contractStart = new Date(data.contractStart);
    if (data.contractEnd) data.contractEnd = new Date(data.contractEnd);

    const updated = await prisma.customer.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer.' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
};

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
