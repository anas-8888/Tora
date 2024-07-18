const mongoose = require('mongoose');

const storeDataSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      location: {
            type: String,
      },
      products: [{
            barcode: {
                  type: String,
                  required: true
            },
            name: {
                  type: String,
                  required: true
            },
            originalPrice: {
                  type: Number,
                  required: true
            },
            salePrice: {
                  type: Number,
                  required: true
            },
            quantity: {
                  type: Number,
                  required: true
            },
            unit: {
                  type: String,
                  defaulte: 'Piece',
                  enum: ['Piece', 'Box', 'Crate', 'Carton', 'Can', 'Bag', 'Pallet', 'Barrel', 'Tube', 'Jar']
            },
            expireDate: {
                  type: Date,
                  required: true
            },
            details: {
                  type: String,
                  required: false
            }
      }],
      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'managerData',
            required: true
      },
      shopRelation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shopData',
            required: false
      }
});

module.exports = mongoose.model('storeData', storeDataSchema);