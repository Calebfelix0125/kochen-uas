const Article = require("../models/ArticleModel.js");

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : ""; // Path gambar

    const newArticle = new Article({
      title,
      content,
      author,
      image: imagePath, // Simpan path gambar
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.json(article);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, author, image } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, author, image },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).send("Article not found");
    }

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).send("Article not found");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
