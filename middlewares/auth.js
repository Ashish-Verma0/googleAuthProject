const ErrorHandler = require("../utils/errorHandler")

const isAuthenticated=(req,res,next)=>{
const token=req.cookies["connect.sid"]
if(!token){
    return next(new ErrorHandler("Not Logged in",401))
}
next()
}
const authorizedAdmin=(req,res,next)=>{
if(req.user.role !== "admin"){
    return next(new ErrorHandler("only admin allowed",401))
}
next()
}

module.exports={
    isAuthenticated,
    authorizedAdmin
}