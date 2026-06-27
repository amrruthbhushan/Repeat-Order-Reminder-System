const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.name },
      process.env.JWT_SECRET || 'ganga_maxx_secret_jwt_key_2026_secure',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const role = await prisma.role.findFirst({
      where: { name: roleName || 'Salesman' }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: role.id
      },
      include: { role: true }
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role.name },
      process.env.JWT_SECRET || 'ganga_maxx_secret_jwt_key_2026_secure',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

const getMe = async (req, res) => {
  try {
    const { password: _, ...userData } = req.user;
    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles.' });
  }
};

module.exports = { login, register, getMe, getRoles };
