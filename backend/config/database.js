const mongoose = require('mongoose');

require('dotenv').config();

const MongoDB = ()=>{
    mongoose.connect(process.env.db)
    .then((con)=> console.log(`Database connected:${con.connection.host}`))
    .catch((err)=> console.log(`Error connecting to MongoDB`));
}

module.exports = MongoDB;