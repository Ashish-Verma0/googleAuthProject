const app = require("./app")
const databseConnection = require("./config/database")
const dotenv=require("dotenv")

dotenv.config({
    path:"./config/config.env"
})

const PORT=process.env.PORT || 8080


const serverStart=()=>{
    databseConnection()
    app.listen(PORT,()=>{
        console.log(`server is runnong on port no. ${PORT}, in ${process.env.NODE_ENV} mode`)
    })

}

serverStart()
