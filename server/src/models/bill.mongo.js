const mongoose = require("mongoose");

const billDataSchema = new mongoose.Schema({
      type: {
            type: String,
            required: true,
            enum: ["Sales", "Sales return", "Purchases", "Purchases return"],
      },
      paymentType: {
            type: String,
            required: true,
            enum: ["Cash", "Debt"],
      },
      date: {
            type: Date,
            default: Date.now,
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
            required: false,
      },
      clientPhone: {
            type: String,
            required: false,
            trim: true,
      },
      shopName: {
            type: String,
            required: true,
      },
      products: [
            {
                  barcode: {
                        type: String,
                        required: true,
                  },
                  name: {
                        type: String,
                        required: true,
                  },
                  originalPrice: {
                        type: Number,
                        required: false,
                  },
                  salePrice: {
                        type: Number,
                        required: false,
                  },
                  quantity: {
                        type: Number,
                        required: true,
                  },
            },
      ],
      total: {
            type: Number,
            required: true,
      },
});

module.exports = mongoose.model("billData", billDataSchema);
