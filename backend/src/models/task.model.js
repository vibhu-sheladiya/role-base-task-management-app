const mongoose=require('mongoose')

const taskSchema=new mongoose.Schema({
    description: String,
    category: String,
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  // Assuming you have a User model
        },
    completed: Boolean

},{
    timeStamp:true,
    versionKey:false,
}

)
const Task=mongoose.model('task',taskSchema);
module.exports = Task;  