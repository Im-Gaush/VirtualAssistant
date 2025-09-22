
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import genToken from "../config/token.js"

export const singUp =async(req,res)=>{
   try {
    const {name,email,password}=req.body
    const userExist = await User.findOne({email})
    if(userExist){
        return res.status(400).json({message:"Email already exists"})
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be atleast 6 character!"})
    }
    
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })
    const token =await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge: 1000*60*60*24*7,
        sameSite: "None",
         secure: true
    })
    res.status(201).json({message:"User created successfully",user})
   } catch (error) {
    res.status(500).json({message:`Sing Up Error ${error}`})
   }
}

export const logIn =async(req,res)=>{
    try {
     const {email,password}=req.body
     const user = await User.findOne({email})
     if(!user){
         return res.status(400).json({message:"Email not exists"})
     }
     const isMatch =await bcrypt.compare(password,user.password)
     if(!isMatch){
        return res.status(400).json({message:"Invalid password"})
    }
     
    const token =await genToken(user._id)
 
     res.cookie("token",token,{
         httpOnly:true,
         maxAge: 1000*60*60*24*7,
         sameSite: "None",
         secure: true
     })
     res.status(200).json({message:"User Login successfully",user})
    } catch (error) {
     res.status(500).json({message:`Login Error ${error}`})
    }
 }

export const logOut =async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({message:"User Logout successfully",})
    } catch (error) {
        res.status(500).json({message:`Logout Error ${error}`})
    }
}
