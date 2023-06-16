const {Router} = require('express');
const register = require('../controllers/user');
const u_router = Router();

u_router.post('/register',register);

module.exports = u_router;