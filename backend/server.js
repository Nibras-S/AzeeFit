const express = require('express');
const dotenv = require("dotenv").config();
const cors = require('cors'); // Moved up for clarity
const errorHandler = require("./middleware/errorHandle");
const connectDB = require("./config/dbConnect");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',            // Local development
  'https://azee-fit.vercel.app'      // Your deployed frontend on Vercel
];

// Enable CORS with origin control
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Enable JSON body parsing
app.use(express.json());

// Routes
app.use("/api/contacts", require("./routes/contactRoutes"));

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
