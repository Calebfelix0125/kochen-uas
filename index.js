require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDB } = require("./src/config/db.js");

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi MongoDB
connectToDB();

// Routes
const userRoutes = require('./src/routes/userRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');
app.use('/api', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
