const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  dateOfSale: { type: Date, required: true },
  sold: { type: Boolean, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
