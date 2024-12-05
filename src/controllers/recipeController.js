const Recipe = require('../models/Recipe');
const jwt = require('jsonwebtoken');  // Impor jsonwebtoken

// POST: Tambah resep baru
exports.createRecipe = async (req, res) => {
  try {
    // Assuming the authenticated user's ID is available in req.user (e.g., set by a middleware)
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Extract recipe data from the request body
    const { title, description, ingredients, instructions } = req.body;

    // Create a new recipe
    const recipe = new Recipe({ 
      title, 
      description, 
      ingredients, 
      instructions, 
      author: userId 
    });

    // Save the recipe to the database
    await recipe.save();

    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET: Ambil semua resep
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username');
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Ambil resep berdasarkan ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update resep berdasarkan ID
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE: Hapus resep berdasarkan ID
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
