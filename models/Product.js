const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: {
    type: Number,
    required: true,
    unique: false
  },
  pname: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);