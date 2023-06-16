const express = require('express');
const p_router = require('./routes/post');
const u_router = require('./routes/user');
const app = express();


// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using Routes
app.use(p_router);
app.use(u_router);

module.exports = app