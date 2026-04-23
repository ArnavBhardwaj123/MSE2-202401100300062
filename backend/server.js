const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Protected dashboard route
const authMiddleware = require('./middleware/auth');
app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Dashboard access granted', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
