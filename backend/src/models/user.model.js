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
adress:{
type:mongoose.Schema.Types.String,
ref:"adress"
},
 password:{
    type:String,
 },

role:{
   type:String,
   // enum:['user','admin']
   
 },
 mobile:{
    type:Number,  //10 digits only
    minlength:10,
 },
},{
    timeStamp:true,
    versionKey:false,
}

)
const User=mongoose.model('user',userSchema);
module.exports = User;  