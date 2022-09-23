const errMiddlewares=(err,req,res,next)=>{
err.message= err.message || "internal server error"
err.statusCode=err.statusCode ||500;

res.status(err.statusCode).json({
    success:false,
    message:err.message
})
}

const catchAsyncError=(passedFunction)=>(req,res,next)=>{
 Promise.resolve(passedFunction(req,res,next)).catch(next)
}

module.exports={
    errMiddlewares,
    catchAsyncError
}