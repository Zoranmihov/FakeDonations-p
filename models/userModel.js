const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  donationAmount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  subscribedDate: {
    type: Date,
  },
  subscribedEndDate: {
    type: Date,
  },
  isActiveSubscriber: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("users", userSchema);
module.exports = User;
