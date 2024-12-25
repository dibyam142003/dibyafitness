const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Create mongoose database connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fitnesstracker";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => {
  console.log("MongoDB connected successfully.");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use(require("./routes/api-routes.js"));
app.use(require("./routes/html-routes.js"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});