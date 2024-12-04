require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectToDB } = require("./src/config/db.js");
const userRoutes = require("./src/routes/userRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi MongoDB
connectToDB();

// Routes
app.use("/api", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
