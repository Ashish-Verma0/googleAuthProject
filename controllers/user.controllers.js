const userDatabase=require("../models/user.model")
const orderDatabase=require("../models/order.model")
const { catchAsyncError } = require("../middlewares/errMiddlewares");

const myProfile=async(req,res,next)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
}

const logoutUser=(req,res,next)=>{
    req.session.destroy((err)=>{
  if(err) return next(err);

  res.clearCookie("connect.sid",{
    secure:process.env.NODE_ENV==="development"?false:true,
  httpOnly:process.env.NODE_ENV==="development"?false:true,
  sameSite:process.env.NODE_ENV==="development"?false:"none"
  })
  res.status(200).json({
    message:"loggedout User"
  })
    })
}

const allUsersForAdmin=catchAsyncError(async(req,res,next)=>{
  const users=await userDatabase.find({})

  res.status(200).json({
    success:true,
    users
  })
})
const getStatsForAdmin=catchAsyncError(async(req,res,next)=>{
  const usersCount=await userDatabase.countDocuments()

  const ordersCount=await orderDatabase.find({})

  const preparingOrders=ordersCount.filter(i=>i.orderStatus==="Preparing")
  const shippedOrders=ordersCount.filter(i=>i.orderStatus==="Shipped")
  const deliveredOrders=ordersCount.filter(i=>i.orderStatus==="Delivered")

  let totalIncome=0

  orderDatabase.forEach(i => { 
    totalIncome+=i.totalAmount
  });
  
  res.status(200).json({
    success:true,
    usersCount,
    ordersCount:{
      total:orderDatabase.length,
      preparing:preparingOrders.length,
      shipped:shippedOrders.length,
      delivered:deliveredOrders.length
    },
    totalIncome
  })
})

module.exports={myProfile,logoutUser,allUsersForAdmin,getStatsForAdmin}