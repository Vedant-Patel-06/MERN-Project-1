const {Router} = require('express');
const { register, login, followUser } = require('../controllers/user');
const isAuthenticated = require('../Middlewares/isAuth');
const u_router = Router();

u_router.post('/register',register);
u_router.post('/login',login );
u_router.get('/follow/:id',isAuthenticated,followUser);

module.exports = u_router;