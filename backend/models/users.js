const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user", // Default role is "user"
      enum: ["user", "admin"], // Allowed roles
    },
    // Reference to Booking model
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking" // Reference to the Booking model
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
