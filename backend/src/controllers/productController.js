const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } }
      ];
    }
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category, price, warehouse, stock, minStock, safetyInfo } = req.body;
    if (!name || !sku || !price) {
      return res.status(400).json({ error: 'Name, SKU, and Price are required.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category: category || 'Disinfectants',
        price: parseFloat(price),
        warehouse: warehouse || 'Central Hub',
        stock: parseInt(stock) || 100,
        minStock: parseInt(minStock) || 20,
        safetyInfo
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product. Check if SKU is unique.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);
    if (data.minStock) data.minStock = parseInt(data.minStock);

    const updated = await prisma.product.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
