const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"],
    },
    avatar:{
        public_id:String,
        url:String,
    },
    email:{
        type:String,
        required:[true,"Please add an email"],
        unique:[true,"Email already exists"],
    },
    password:{
        type:String,
        required:[true,"Please add a password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post',
        },
    ],
    follwers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ],
})
let User= mongoose.model('User',userSchema);
module.exports = User;