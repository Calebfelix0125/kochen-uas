const express = require("express");
const articleController = require("../controllers/articleController");
const upload = require("../middleware/upload.js");
const router = express.Router();

// Rute untuk membuat artikel dengan unggahan gambar
router.post("/", upload.single("image"), articleController.createArticle);

// Rute lain tetap sama
router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.put("/:id", upload.single("image"), articleController.updateArticle);
router.delete("/:id", articleController.deleteArticle);

module.exports = router;
