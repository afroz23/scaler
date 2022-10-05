const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/Users");
const interviewRoutes = require("./routes/Interview");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>App working...</h1>");
});

app.use("/api", userRoutes);
app.use("/api", interviewRoutes);

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("DB connected");
});

app.listen(8000, () => {
  console.log("server is running...");
});
