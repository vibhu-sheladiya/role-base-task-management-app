const mongoose= require('mongoose')

const  createDb=async()=>{
    // console.log ("dbdf")
    mongoose.connect('mongodb://localhost:27017').then((data)=>{
        console.log('database is done')
    }).catch((error)=>{
        console.log('fail')
    })
}

module.exports={createDb}