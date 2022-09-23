const { catchAsyncError } = require("../middlewares/errMiddlewares");
const orderDatabase = require("../models/order.model");
const paymentDatabase = require("../models/payment");
const ErrorHandler = require("../utils/errorHandler");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    PaymentMethod,
    itemsPrice,
    shippingCharges,
    taxPrice,
    totalAmount,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    PaymentMethod,
    itemsPrice,
    shippingCharges,
    taxPrice,
    totalAmount,
    user,
  };

  await orderDatabase.create(orderOptions);

  res.status(201).json({
    success: true,
    message: "order placed successfully via cash on delivery",
  });
});

const createOrderOnline = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    PaymentMethod,
    itemsPrice,
    shippingCharges,
    taxPrice,
    totalAmount,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    PaymentMethod,
    itemsPrice,
    shippingCharges,
    taxPrice,
    totalAmount,
    user,
  };

  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  const Instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const order = await Instance.orders.create(options);
  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});

const paymentVerification = catchAsyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthenticate=expectedSignature===razorpay_signature

  if (isAuthenticate) {
    const payment = await paymentDatabase.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    await orderDatabase.create({
      ...orderOptions,
      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `order placed successfully,Payment ID:${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("payment failed", 400));
  }
});

const getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderDatabase.find({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getOrderDetails = catchAsyncError(async (req, res, next) => {
  const orderDetails = await orderDatabase.findById(req.params.id);

  if (!orderDetails) {
    return next(new ErrorHandler("Invalid Order Id", 404));
  }

  res.status(200).json({
    success: true,
    orderDetails,
  });
});

const getAdminOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderDatabase.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

const processOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderDatabase.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }

  if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("product already delivered", 400));

  await order.save();
  res.status(200).json({
    success: true,
    message: "Status updated successfully",
  });
});
module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAdminOrders,
  processOrder,
  createOrderOnline,
  paymentVerification,
};
