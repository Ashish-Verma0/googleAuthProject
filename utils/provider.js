const {Strategy}=require("passport-google-oauth20")
const userDatabase=require("../models/user.model")
const passport=require("passport")
const dotenv=require("dotenv")

dotenv.config({
    path:"./config/config.env"
})
const connectPassport=()=>{
    passport.use(new Strategy({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:process.env.CALLBACK_URL
    }, async function(accessToken,refreshToken,profile,done){
   const user=await userDatabase.findOne({
    googleId:profile.id,
   })

   if(!user){
  const newUser=await userDatabase.create({
    googleId:profile.id,
    name:profile.displayName,
    photo:profile.photos[0].value,
  })

  return done(null,newUser)
   }else{
    return done(null,user)
   }
    }))

    passport.serializeUser((user,done)=>{
    done(null,user.id)
    })

    passport.deserializeUser(async (id,done)=>{
      const user=await userDatabase.findById(id)
     done(null,user)
    })
}

module.exports=connectPassport