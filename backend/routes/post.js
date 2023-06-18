const {Router} = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOffFollowing } = require('../controllers/post');
const isAuthenticated = require('../Middlewares/isAuth');

const p_router = Router();

p_router.post('/post/upload',isAuthenticated,createPost);
p_router.get('/post/:id',isAuthenticated,likeAndUnlikePost);
p_router.delete('/post/:id',isAuthenticated,deletePost);
p_router.get('/posts/',isAuthenticated,getPostOffFollowing);

module.exports = p_router;
