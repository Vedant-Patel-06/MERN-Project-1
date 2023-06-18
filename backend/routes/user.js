const {Router} = require('express');
const { register, login, followUser, logOut, updatePassword, updateProfile, deleteMyProfile, myProfile, getUserProfile, getAllUsers } = require('../controllers/user');
const isAuthenticated = require('../Middlewares/isAuth');
const u_router = Router();

u_router.post('/register',register);
u_router.post('/login',login );
u_router.get('/logout',logOut);
u_router.get('/follow/:id',isAuthenticated,followUser);
u_router.put('/update/password',isAuthenticated,updatePassword);
u_router.put('/update/profile',isAuthenticated,updateProfile);
u_router.delete('/delete/me',isAuthenticated,deleteMyProfile);
u_router.get('/me',isAuthenticated,myProfile);
u_router.get('/user/:id',isAuthenticated,getUserProfile);
u_router.get('/users',isAuthenticated,getAllUsers);

module.exports = u_router;