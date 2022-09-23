const mongoose=require("mongoose")


mongoose.connection.once("open",()=>{
    console.log("database connected")
})

mongoose.connection.on("end",()=>{
    console.log("database not connected")
})

const databseConnection=()=>{
    mongoose.connect(process.env.ONLINE_DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports=databseConnection