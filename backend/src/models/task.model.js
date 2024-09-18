const mongoose=require('mongoose')

const taskSchema=new mongoose.Schema({
    description: String,
    task: String,

},{
    timeStamp:true,
    versionKey:false,
}

)
const Task=mongoose.model('task',taskSchema);
module.exports = Task;  