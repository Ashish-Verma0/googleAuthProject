const express=require("express")
const { createOrder, getMyOrders, getOrderDetails, getAdminOrders, processOrder, createOrderOnline, paymentVerification } = require("../controllers/order.controllers")

const orderRouter=express.Router()

orderRouter.post("/createOrder",createOrder)
orderRouter.post("/createOrderOnline",createOrderOnline)
orderRouter.post("/paymentVerification",paymentVerification)
orderRouter.get("/getMyOrders",getMyOrders)
orderRouter.get("/order/:id",getOrderDetails)
orderRouter.get("/admin/orders",getAdminOrders)
orderRouter.get("/admin/order/:id",processOrder)

module.exports=orderRouter