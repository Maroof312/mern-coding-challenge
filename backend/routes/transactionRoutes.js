const express = require('express');
const { seedData, getTransactions, getStatistics, getBarChart, getPieChart, getCombinedData } = require('../controllers/transactionController');
const router = express.Router();

router.get('/seed', seedData); // Initialize database
router.get('/transactions', getTransactions); // List transactions
router.get('/statistics', getStatistics); // Get statistics
router.get('/barchart', getBarChart); // Get bar chart data
router.get('/piechart', getPieChart); // Get pie chart data
router.get('/combined', getCombinedData); // Get combined data

module.exports = router;
