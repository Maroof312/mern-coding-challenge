const axios = require('axios');
const Transaction = require('../models/Transaction');

// Fetch and seed data into the database
exports.seedData = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(201).json({ message: 'Data seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions with search and pagination
exports.getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const regex = new RegExp(search, 'i'); // Case-insensitive search

  let query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' } };

  try {
    const transactions = await Transaction.find({
      $or: [
        { title: regex },
        { description: regex },
        { price: { $regex: regex } },
      ],
      ...query,
    })
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get statistics (sold, unsold, total sales)
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' } };

  try {
    const totalSales = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const soldItems = await Transaction.countDocuments({ ...query, sold: true });
    const unsoldItems = await Transaction.countDocuments({ ...query, sold: false });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bar chart for price ranges
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' } };

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    // Add other ranges here
  ];

  try {
    const data = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({ ...query, price: { $gte: min, $lte: max } });
        return { range, count };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie chart for categories
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' } };

  try {
    const data = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Combined API
exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  
  try {
    const statistics = await exports.getStatistics(req, res);
    const barChart = await exports.getBarChart(req, res);
    const pieChart = await exports.getPieChart(req, res);

    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
