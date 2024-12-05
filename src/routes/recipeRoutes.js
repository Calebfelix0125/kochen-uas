const express = require("express");
const authMiddleware = require("../middleware/middleware");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const router = express.Router();

// POST: Tambah resep baru
router.post("/add", authMiddleware, createRecipe);

// GET: Ambil semua resep
router.get("/lists", getAllRecipes);

// GET: Ambil resep berdasarkan ID
router.get("/:id", getRecipeById);

// PUT: Update resep berdasarkan ID
router.put("/:id", updateRecipe);

// DELETE: Hapus resep berdasarkan ID
router.delete("/delete/:id", deleteRecipe);

module.exports = router;
