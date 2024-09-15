const express = require("express");
const Booking = require("../models/booking");
const User = require("../models/users");

const router = express.Router();

// POST: Create a new booking
router.post("/api/create", async (req, res) => {
  try {
    const {
      products,
      userId,
      username,
      fullName,
      phone,
      email,
      address,
      city,
      zip,
      countryState,
      selectedPaymentMethod,

    } = req.body;

    const newBooking = new Booking({
      products, // Array of { productId, quantity }
      userId,
      username,
      fullName,
      phone,
      email,
      address,
      city,
      zip,
      countryState,
      selectedPaymentMethod,

    });

    const savedBooking = await newBooking.save();


    // const user = await User.findByIdAndUpdate(userId, {$push: {bookings:savedBooking._id}})
    const user = await User.findById(userId);
    if (user) {
      user.bookings.push(savedBooking._id); // Push the booking ID into the user's bookings array
      await user.save(); // Save the updated user document
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





router.delete("/api/delete/:bookingId/product/:productId", async (req, res) => {
  try {
    const { bookingId, productId } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the product exists in the booking's products array
    const productIndex = booking.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in booking" });
    }

    // Remove the specific product from the booking
    booking.products.splice(productIndex, 1);

    // If the booking has no more products, delete the entire booking
    if (booking.products.length === 0) {
      await Booking.findByIdAndDelete(bookingId);

      // Also remove the booking reference from the user's bookings array
      await User.findByIdAndUpdate(booking.userId, {
        $pull: { bookings: bookingId },
      });

      return res.status(200).json({ message: "Order canceled successfully!" });
    } else {
      // Save the updated booking if products still remain
      await booking.save();
      return res.status(200).json({ message: "Order canceled successfully!" });

    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



// GET: Retrieve all bookings
router.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("products.productId").populate("userId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = router;
