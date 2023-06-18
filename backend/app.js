const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const p_router = require('./routes/post');
const u_router = require('./routes/user');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:"backend/.env"});
}

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Using Routes
app.use(p_router);
app.use(u_router);

module.exports = app