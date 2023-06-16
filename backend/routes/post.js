const {Router} = require('express');
const { createPost } = require('../controllers/post');

const p_router = Router();

p_router.post('/createPost',createPost);

module.exports = p_router;
