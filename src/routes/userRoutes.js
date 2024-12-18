const express = require("express");
const { register, login, changepw } = require("../controllers/userController");
const path = require("path");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/changepw", changepw);

module.exports = router;
