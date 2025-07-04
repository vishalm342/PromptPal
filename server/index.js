const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const promptRoutes = require('./routes/promptRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prompts', promptRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'PromptPal API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
