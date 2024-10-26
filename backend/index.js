const express = require("express");
//body-parser
const mongoose = require("mongoose");
const cors = require("cors");

const productRouter = require("./routes/productApi");
const reviewRouter = require("./routes/reviewsApi");
const userRouter = require("./routes/userApi");
const bookingRoute = require("./routes/bookingApi")

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT  || 8000;

mongoose.connect("mongodb+srv://rajsingh123:ILktg7fLTQLsamDg@cluster0.yrn2k.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error Connecting to MongoDB:", error.message));


app.listen(port, () => {
  console.log("server is running on port 8000...");
});

// produvt route
app.use("/product", productRouter);
app.use("/reviews", reviewRouter);
app.use("/user", userRouter);
app.use("/booking",bookingRoute );
