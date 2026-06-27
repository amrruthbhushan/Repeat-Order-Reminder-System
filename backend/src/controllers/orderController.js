const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
  try {
    const { search, status, customerId } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { institutionName: { contains: search } } }
      ];
    }
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        salesman: true,
        items: { include: { product: true } }
      },
      orderBy: { orderDate: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerId, salesmanId, items, orderDate, deliveryDate } = req.body;
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer ID and at least one item are required.' });
    }

    // Generate unique order number
    const count = await prisma.order.count();
    const orderNumber = `ORD-2026-${(1000 + count + 1).toString()}`;

    let totalAmount = 0;
    const itemsData = items.map(item => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        salesmanId: salesmanId || req.user?.id,
        totalAmount,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(Date.now() + 86400000),
        status: 'Delivered',
        items: {
          create: itemsData
        }
      },
      include: {
        customer: true,
        items: { include: { product: true } }
      }
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order.' });
  }
};

module.exports = { getOrders, createOrder, updateOrderStatus, deleteOrder };
