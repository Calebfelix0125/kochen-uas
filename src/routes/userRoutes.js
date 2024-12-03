const express = require('express');
const { register, login, changepw } = require('../controllers/userController');
const router = express.Router();

router.post('/users/register', register);
router.post('/users/login', login);
router.post('/users/changepw', changepw);


module.exports = router;
