const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// get all data from backend

router.get("/getAll", async (req, resp) => {
  try {
    const products = await Product.find().populate("reviews");
    // .populate("reviews");
    if (!products) {
      resp
        .status(400)
        .json({ success: false, message: "somthing went wrong!." });
    }
    resp.status(200).json({
      success: true,
      message: "Data is comming Successfully.",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error);

    resp
      .status(500)
      .json({ success: false, message: "Error retrieving products", error });
  }
});

router.get("/:category/:id", async (req, resp) => {
  const { id } = req.params;

  try {
    // const product = await Product.findById(id)
    const product = await Product.findById(id).populate("reviews");

    if (!product) {
      return resp
        .status(400)
        .json({ success: false, message: "ID doesn't match." });
    }

    resp.status(200).json({
      success: true,
      count: product.length,
      message: "Data is coming successfully.",
      data: product,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Error retrieving product", error });
  }
});

module.exports = router;
