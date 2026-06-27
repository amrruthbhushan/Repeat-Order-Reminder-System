const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReports = async (req, res) => {
  try {
    const monthlyOrders = [
      { month: 'Jan 2026', totalOrders: 42, totalAmount: 512000, repeatOrders: 35 },
      { month: 'Feb 2026', totalOrders: 48, totalAmount: 590000, repeatOrders: 40 },
      { month: 'Mar 2026', totalOrders: 56, totalAmount: 680000, repeatOrders: 49 },
      { month: 'Apr 2026', totalOrders: 62, totalAmount: 740000, repeatOrders: 54 },
      { month: 'May 2026', totalOrders: 70, totalAmount: 850000, repeatOrders: 62 },
      { month: 'Jun 2026', totalOrders: 78, totalAmount: 960000, repeatOrders: 71 }
    ];

    const salesmanPerformance = [
      { salesman: 'Rajesh Kumar', completedFollowups: 48, convertedOrders: 42, revenueGenerated: 520000, successRate: '87.5%' },
      { salesman: 'Amit Verma', completedFollowups: 42, convertedOrders: 36, revenueGenerated: 440000, successRate: '85.7%' },
      { salesman: 'Neha Gupta', completedFollowups: 35, convertedOrders: 31, revenueGenerated: 390000, successRate: '88.5%' }
    ];

    const customerGrowth = [
      { type: 'Hospitals', activeCount: 24, growthRate: '+15%' },
      { type: 'Hotels & Hospitality', activeCount: 38, growthRate: '+22%' },
      { type: 'Corporate Facilities', activeCount: 52, growthRate: '+18%' },
      { type: 'Educational Institutions', activeCount: 18, growthRate: '+10%' }
    ];

    res.json({
      monthlyOrders,
      salesmanPerformance,
      customerGrowth,
      summary: {
        totalRepeatRevenue: '₹43,52,000',
        overallSuccessRate: '87.2%',
        activeContractClients: 132
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report metrics.' });
  }
};

module.exports = { getReports };
