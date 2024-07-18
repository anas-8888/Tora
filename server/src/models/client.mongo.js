const mongoose = require('mongoose');

const clientDataSchema = new mongoose.Schema({
      type: {
            type: String,
            required: true,
            enum: ['Supplier', 'Client']
      },
      name: {
            type: String,
            required: true,
      },
      phone: {
            type: String,
            required: true,
            trim: true,
      },
      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shopData',
            required: true
      },
      DebtPrice: {
            type: Number,
            required: false
      }
});

module.exports = mongoose.model('clientData', clientDataSchema);