const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    system: 'Ganga Maxx Repeat Order Reminder System API',
    status: 'Operational 🟢',
    version: '1.0.0',
    documentation: 'B2B Automated Consumption & Predictive Reminder Engine'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ganga Maxx Server running on http://localhost:${PORT}`);
});
