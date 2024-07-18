const mongoose = require('mongoose');

const managerDataSchema = new mongoose.Schema({
      fullName: {
            type: String,
            required: true,
            trim: true,
            validate: {
              validator: function(v) {
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
              validator: function(v) {
                return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
              },
              message: () => 'Password must be stronger!'
            }
      },
      companyName: {
            type: String,
            required: true
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
});

module.exports = mongoose.model('managerData', managerDataSchema);