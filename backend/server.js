const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
connectDB();
app.use(express.json());

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Use transaction routes
app.use('/api', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
