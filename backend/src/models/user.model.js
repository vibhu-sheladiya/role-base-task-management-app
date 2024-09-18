const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
 name:{
    type:String,
    trim:true,
 },
 token:{
    type:String,
 },
 email:{
    type:String,
 },

 password:{
    type:String,
 },
// 1 user 2 admin
role:{
   type:String,
   default:"1",
   // enum:['user','admin']
   
 },

},{
    timeStamp:true,
    versionKey:false,
}

)
const User=mongoose.model('user',userSchema);
module.exports = User;  