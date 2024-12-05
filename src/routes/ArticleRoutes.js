const express = require("express");
const articleController = require("../controllers/articleController");
const router = express.Router();

// Rute untuk membuat artikel
router.post("/", articleController.createArticle);

// Rute untuk mengambil semua artikel
router.get("/", articleController.getAllArticles);

// Rute untuk mengambil artikel berdasarkan ID
router.get("/:id", articleController.getArticleById);

// Rute untuk memperbarui artikel berdasarkan ID
router.put("/:id", articleController.updateArticle);

// Rute untuk menghapus artikel berdasarkan ID
router.delete("/:id", articleController.deleteArticle);

module.exports = router;
