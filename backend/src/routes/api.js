const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const reminderController = require('../controllers/reminderController');
const reportController = require('../controllers/reportController');
const settingController = require('../controllers/settingController');

const { authenticate, authorize } = require('../middlewares/auth');

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticate, authController.getMe);
router.get('/auth/roles', authController.getRoles);

// Dashboard
router.get('/dashboard', authenticate, dashboardController.getDashboardStats);

// Customers CRUD
router.get('/customers', authenticate, customerController.getCustomers);
router.get('/customers/:id', authenticate, customerController.getCustomerById);
router.post('/customers', authenticate, customerController.createCustomer);
router.put('/customers/:id', authenticate, customerController.updateCustomer);
router.delete('/customers/:id', authenticate, customerController.deleteCustomer);

// Products CRUD
router.get('/products', authenticate, productController.getProducts);
router.post('/products', authenticate, productController.createProduct);
router.put('/products/:id', authenticate, productController.updateProduct);
router.delete('/products/:id', authenticate, productController.deleteProduct);

// Orders CRUD
router.get('/orders', authenticate, orderController.getOrders);
router.post('/orders', authenticate, orderController.createOrder);
router.patch('/orders/:id/status', authenticate, orderController.updateOrderStatus);
router.delete('/orders/:id', authenticate, orderController.deleteOrder);

// Reminder Engine & Due Customers
router.get('/due-customers', authenticate, reminderController.getDueCustomers);
router.post('/reminders/generate', authenticate, reminderController.generateReminderMessage);
router.post('/reminders/send', authenticate, reminderController.sendReminder);

// Reminder Rules CRUD
router.get('/reminder-rules', authenticate, reminderController.getReminderRules);
router.post('/reminder-rules', authenticate, reminderController.createReminderRule);
router.patch('/reminder-rules/:id/toggle', authenticate, reminderController.toggleReminderRule);
router.delete('/reminder-rules/:id', authenticate, reminderController.deleteReminderRule);

// Notifications & Reports & Settings
router.get('/notifications', authenticate, reminderController.getNotifications);
router.get('/reports', authenticate, reportController.getReports);
router.get('/settings', authenticate, settingController.getSettings);
router.post('/settings', authenticate, settingController.updateSetting);

module.exports = router;
