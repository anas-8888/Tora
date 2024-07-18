const mongoose = require('mongoose');

const employeeDataSchema = new mongoose.Schema({
      fullName: {
            type: String,
            required: true,
            trim: true,
            validate: {
                  validator: function (v) {
                        return /^[a-zA-Z\s]+$/.test(v);
                  },
                  message: props => `${props.value} is not a valid full name!`
            }
      },
      email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                  validator: function (v) {
                        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                  },
                  message: props => `${props.value} is not a valid email address!`
            }
      },
      password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                  validator: function (v) {
                        return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
                  },
                  message: () => 'Password must be stronger!'
            }
      },
      typeOfEmployee: {
            type: String,
            required: true,
            enum: ['Accountant', 'Accounting Manager', 'CEO', 'Sales', 'Store Keeper']
      },
      phoneNumber: {
            type: String,
            required: true,
            trim: true
      },
      salary: {
            type: Number,
            required: true
      },
      supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'managerData',
            required: true
      },
      shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shopData',
            required: false
      },
      favorite: [{
            billId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'billData'
            }
      }],
      reminder: [{
            details: {
                  type: String
            },
            date: {
                  type: Date
            }
      }],
      startDate: {
            type: Date,
            required: true,
            default: Date.now()
      }
});

// Connects launchesSchema with the "employees" collection
module.exports = mongoose.model('employeeData', employeeDataSchema);