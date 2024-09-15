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

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("server is running on port 8000...");
});

// produvt route
app.use("/product", productRouter);
app.use("/reviews", reviewRouter);
app.use("/user", userRouter);
app.use("/booking",bookingRoute );
