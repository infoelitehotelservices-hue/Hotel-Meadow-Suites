import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username : {type : String , required: true},
    email : {type : String , required: true , unique : true},
    otp : {type : String , required: false , default : "none"},
    password : {type : String , required: true},
    verification : {type : Boolean , default: false},
    userType : {type : String , required : true , default : "Client" , enum : ['Client', 'Admin']},
    profile : {type : String , default : 'https://i.pinimg.com/236x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg'}
}, {timestamps : true}); 

export default mongoose.model('User' , UserSchema);