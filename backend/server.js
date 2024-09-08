const express = require('express');
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorHandle");
const connectDB = require("./config/dbConnect");
const cors = require('cors');

connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`the server running in port ${port}`);
});