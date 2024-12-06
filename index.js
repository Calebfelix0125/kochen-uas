require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectToDB } = require("./src/config/db.js");
const userRoutes = require("./src/routes/userRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const articleRoutes = require("./src/routes/ArticleRoutes.js");
const path = require("path");

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Koneksi MongoDB
connectToDB();

// Middleware untuk menyajikan file statis
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/articles", articleRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
