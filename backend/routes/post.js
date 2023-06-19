const {Router} = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOffFollowing, updateCaption, commentOnPost, deleteComment } = require('../controllers/post');
const isAuthenticated = require('../Middlewares/isAuth');

const p_router = Router();

p_router.post('/post/upload',isAuthenticated,createPost);
p_router.get('/post/:id',isAuthenticated,likeAndUnlikePost);
p_router.put('/post/:id',isAuthenticated,updateCaption);
p_router.delete('/post/:id',isAuthenticated,deletePost);
p_router.get('/posts/',isAuthenticated,getPostOffFollowing);
p_router.put('/post/comment/:id',isAuthenticated,commentOnPost);
p_router.delete('/post/comment/:id',isAuthenticated,deleteComment);

module.exports = p_router;
