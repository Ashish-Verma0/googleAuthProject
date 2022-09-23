const express=require("express")
const userRouter = require("./routers/user.router")
const connectPassport = require("./utils/provider")
const session=require("express-session")
const cookieParser=require("cookie-parser")
const app=express()
const dotenv=require("dotenv")
const passport = require("passport")
const orderRouter = require("./routers/order.router")
const { urlencoded } = require("express")
const { errMiddlewares, catchAsyncError } = require("./middlewares/errMiddlewares")
const cors=require("cors")

dotenv.config({
    path:"./config/config.env"
})

app.use(express.json())
app.use(urlencoded({
  extended:true
}))

// googleauthentication steps start
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,

  cookie:{
  secure:process.env.NODE_ENV==="development"?false:true,
  httpOnly:process.env.NODE_ENV==="development"?false:true,
  sameSite:process.env.NODE_ENV==="development"?false:"none"
  }
}))

app.use(cookieParser())

app.use(passport.authenticate("session"))
app.use(passport.initialize())
app.use(passport.session())
// heroku deploy step
app.enable("trust proxy")
// heroku deploy step

connectPassport()
// googleauthentication steps end

// Router start
app.use("/api/v1",userRouter)
app.use("/api/v1",orderRouter)
// Router end

app.get("/",(req,res)=>{
  res.send("hello world")
})

app.use(cors({
  credentials:true,
  origin:"http://localhost:3000"
}))


app.use(errMiddlewares)
app.use(catchAsyncError)
module.exports=app