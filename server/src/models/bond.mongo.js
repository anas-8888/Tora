const mongoose = require('mongoose');

const bondDataSchema = new mongoose.Schema({
      type: {
            type: String,
            required: true,
            enum: ['Payment', 'Receipt']
      },
      date: {
            type: Date,
            default: Date.now()
      },
      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managerData",
            required: true,
      },
      writerName: {
            type: String,
            required: true,
      },
      clientName: {
            type: String,
            required: true,
      },
      shopName: {
            type: String,
            required: true,
      },
      price: {
            type: Number,
            required: true
      },
      details: {
            type: String,
            required: false
      }
});

module.exports = mongoose.model('bondData', bondDataSchema);