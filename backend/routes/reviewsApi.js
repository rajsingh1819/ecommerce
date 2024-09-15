const Reviews = require("../models/reviews");
const Product = require("../models/product");

const express = require("express");
const router = express.Router();

router.post("/post/:id", async (req, resp) => {
  const { id } = req.params;
  const { username, reviewText, userId, rating } = req.body;

  try {
    const review = new Reviews({ username, reviewText, userId, rating , productId: id });
    const saveReview = await review.save();
    if (!review) {
      return resp
        .status(400)
        .json({ success: false, message: "somthing went wrong!." });
    }

    // find and update inside the product schema
    await Product.findByIdAndUpdate(id, { $push: { reviews: saveReview._id } });

    resp.status(200).json({
      success: true,
      message: "Review Submitted",
      data: saveReview,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "failed to Submitted" });
  }
});

router.get("/getAll", async (req, resp) => {
  const review = await Reviews.find();
  try {
    if (!review) {
      return resp
        .status(400)
        .json({ success: false, message: "somthing wrong!." });
    }
    resp.status(200).json({
      status: true,
      count: review.length,
      message: "Data is comming Successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      success: false,
      message: "Error retrieving product",
      error: error,
    });
  }
});





// DELETE review endpoint
router.delete("/delete/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = req.body; // User ID is passed in the body

  try {
    // Find the review by ID
    const review = await Reviews.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is authorized to delete the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }

    // Remove the review from the product's reviews array
    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id }
    });

    // Delete the review
    await Reviews.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "An error occurred while deleting the review" });
  }
});

module.exports = router;