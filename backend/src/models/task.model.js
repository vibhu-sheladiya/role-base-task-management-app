const mongoose=require('mongoose')

const taskSchema=new mongoose.Schema({
    desc: String,
    category: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user',  // Assuming you have a User model
       },
       completed:{
        type:Boolean,
        default:false,
       }

},{
    timeStamp:true,
    versionKey:false,
}

)
const Task=mongoose.model('task',taskSchema);
module.exports = Task;  