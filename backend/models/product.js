const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    Image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    productType: {
      type: String,
      required: true,
    },
  
  },
  { timestamps: true }
);

const product = mongoose.model("Product", productSchema);

module.exports = product;
