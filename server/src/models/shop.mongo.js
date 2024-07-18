const mongoose = require('mongoose');

const shopDataSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      location: {
            type: String
      },
      box: {
            type: Number,
            required: false,
            default: 0
      },
      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'managerData',
            required: true
      },
      
});

module.exports = mongoose.model('shopData', shopDataSchema);