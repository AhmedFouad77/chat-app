const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    firstName :{
        type: String,
        required:true,
        min : 3 ,
        max :255
    },

    lastName :{
    type: String,
    required:true,
    min : 3 ,
    max :255 
    },
    email:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        min : 6,
        max:10000
    },
    date:{
        type:Date,
        default:Date.now()
    },
    TokenResetPassword:{type:String}
    },{timestamps:true });
    
module.exports = mongoose.model('user',user);