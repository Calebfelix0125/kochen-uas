const Recipe = require("../models/Recipe");
const jwt = require("jsonwebtoken"); // Impor jsonwebtoken
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder tempat menyimpan gambar
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed!"),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

// POST: Tambah resep baru
exports.createRecipe = [
  upload.single("photo"), // Middleware untuk upload single file
  async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { title, description, ingredients, instructions } = req.body;
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const recipe = new Recipe({
        title,
        description,
        ingredients,
        instructions,
        author: userId,
        photoUrl, // Tambahkan path foto ke database
      });

      await recipe.save();

      res.status(201).json(recipe);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// GET: Ambil semua resep
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author", "username");
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Ambil resep berdasarkan ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update resep berdasarkan ID
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
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
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
