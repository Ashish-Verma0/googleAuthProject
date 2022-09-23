const express=require("express")
const passport=require("passport")
const { myProfile, logoutUser, allUsersForAdmin, getStatsForAdmin } = require("../controllers/user.controllers")
const { isAuthenticated } = require("../middlewares/auth")

const userRouter=express.Router()

userRouter.get("/googlelogin",passport.authenticate("google",{
    scope:["profile"]
}))

userRouter.get("/login",
passport.authenticate("google"
,{
    scope:["profile"],
    successRedirect:process.env.FRONTEND_URL
}
),
// (req,res,next)=>{
//     res.send("loggedIn user")
// }
)

userRouter.get("/me",isAuthenticated,myProfile)
userRouter.get("/logout",logoutUser)
userRouter.get("/admin/users",allUsersForAdmin)
userRouter.get("/admin/stats",getStatsForAdmin)

module.exports=userRouter