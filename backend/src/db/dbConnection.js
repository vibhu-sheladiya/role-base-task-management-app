const mongoose= require('mongoose')

const  createDb=async()=>{
    // console.log ("dbdf")
    mongoose.connect('mongodb+srv://vibhasheladiya3936:azHqS6BCvCKsIqMV@cluster0.gxfoxkv.mongodb.net/?retryWrites=true&w=majority').then((data)=>{
        console.log('database is done')
    }).catch((error)=>{
        console.log('fail')
    })
}

module.exports={createDb}