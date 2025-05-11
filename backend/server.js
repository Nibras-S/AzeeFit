const express = require('express');
const dotenv = require("dotenv").config();
const cors = require('cors'); // Import CORS
const errorHandler = require("./middleware/errorHandle");
const connectDB = require("./config/dbConnect");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Define allowed origins for CORS (both local and production)
const allowedOrigins = [
  'http://localhost:3000',            // Local development
  'https://azee-fit.vercel.app'      // Your deployed frontend on Vercel
];

// Enable CORS with specific origins
app.use(cors({
  origin: allowedOrigins,
  credentials: true // Allow cookies or authentication headers
}));

// Middleware to parse JSON body
app.use(express.json());

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// API Routes
app.use("/api/contacts", require("./routes/contactRoutes"));

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
