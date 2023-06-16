const mongoose = require('mongoose');

require('dotenv').config();

const MongoDB = ()=>{
    mongoose.connect(process.env.db);
    console.log('Connected to MongoDB');
}

module.exports = MongoDB;