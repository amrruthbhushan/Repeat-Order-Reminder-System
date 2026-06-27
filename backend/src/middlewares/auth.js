const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ganga_maxx_secret_jwt_key_2026_secure');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized or token expired.' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Forbidden. Access restricted.' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role.name) && req.user.role.name !== 'Admin') {
      return res.status(403).json({ error: `Forbidden. Role '${req.user.role.name}' does not have permission.` });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
