const User = require("../models/users");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, resp) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return resp.status(400).json({
          success: false,
          message: "Username already exists!",
        });
      }
      if (existingUser.email === email) {
        return resp.status(400).json({
          success: false,
          message: "Email already exists!",
        });
      }
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the user doesn't exist, proceed to create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
      role,
    });

    const saveUser = await user.save();

    if (!saveUser) {
      return resp.status(404).json({
        success: false,
        message: "Something went wrong!",
      });
    }

    resp.status(200).json({
      success: true,
      message: "User Registered Successfully.",
      data: saveUser,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "User failed to Register.",
      error: error.message,
    });
  }
});
router.post("/login", async (req, resp) => {
  const { emailOrUsername, password, rememberMe } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // If no user is found, return an error
    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "Invalid email/username!",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return resp.status(400).json({
        success: false,
        message: "Invalid password!",
      });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      "secret",
      { expiresIn: rememberMe ? "1d" : "1h" } // Token lasts longer if "rememberMe" is true
    );

    resp.status(200).json({
      success: true,
      message: "Login successful!",
      token, // Send the token to the client
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        activeUser: rememberMe,
      },
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
});


router.get("/:userId", async (req, resp) => {
  // const loginUserId = req.params.userId;

  try {
    // const user = await User.findById(loginUserId).populate("bookings")
    const loginUserId = req.params.userId;

    // Find the user by ID and populate the 'bookings' array
    const user = await User.findById(loginUserId)
      .populate({
        path: 'bookings',
        populate: {
          path: 'products.productId', // Populate productId inside the products array
          model: 'Product' // Ensure it uses the Product model
        }
      });

    if (!user) {
      return resp.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    resp.status(200).json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    resp.status(500).json({ message: "Error retrieving user" });
  }
});




router.get("/getAll", async (req, resp) => {
  try {
    const user = await User.find();

    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    }

    resp.status(200).json({
      success: true,
      count: user.length,
      message: "Data is coming Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
});






// API to check if the email exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered.", status: false });
    }
    res.status(200).json({ message: "User found.", status: true });
  } catch (error) {
    res.status(500).json({ message: "Error checking email.", error: error.message });
  }
});

// API to update the password
router.put("/update-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.", status: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully.", status: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating password.", error: error.message });
  }
});

module.exports = router;





