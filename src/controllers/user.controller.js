import {asyncHandler} from "../utis/asyncHandler.js"
import {Apierror} from  "../utis/Apierror.js"
import {User} from  "../Models/user.model.js"
import {Contact} from "../Models/contact.model.js"
 
import { ApiResponse } from "../utis/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken =user.generateAccessToken();
        const refreshToken = user.generateRefreshToken() ;
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new Apierror('400',"Something went wrong while generating token");
    }
} 
const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullname, email, password, phone } = req.body;
    console.log("Registering user:", { userName, fullname, email, password, phone });

    if (!userName || !fullname || !email || !password || !phone) {
        throw new Apierror(400,"All fields are required");
    }
    const existingUser = await User.findOne({ 
        $or: [{email},{userName}]
     });
    if (existingUser) {
        throw new Apierror( 400,"User already exists");
    }

    const user = await User.create({
        userName,
        fullname,
        email,
        password,
        phone
    })
    const contact = await Contact.create({
        fullname,
        email,
        phone
    });
    if (!user || !contact) {
        throw new Apierror(500,"Something went wrong while registering user");
    }
     const createUser=await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if(!createUser){
        throw new Apierror(500,"Something went wrong while registering ")
    }
    return res.status (201).json(
        new ApiResponse(200,createUser,"Created suceess")
    )
})
const loginUser= asyncHandler(async (req, res)=>{
     
    //req boy -> data

    // username or email
    // find 
    //password check 
    //access and generate refresh token 
    // send secure cookies 
   
    const {email,userName,password} =req.body;
       console.log("Logging in user:", { email, userName, password });
    if(!(email || userName)){
        throw new Apierror('400' , "UserName or email is required")
    }
    const user = await User.findOne({
        $or :[{userName,email}]
    })
    if (!user) {
        throw new Apierror('404',"User does not exist");
    }
   const isPasswordvalid= await user.isPasswordCorrect(password)
   if(!isPasswordvalid){
    throw new Apierror('401', "Invalid user credentail")

   }
   const {accessToken ,refreshToken}=await generateAccessAndRefreshToken(user._id)

  const loginuser= await User.findById(user._id).select("-password -refreshtoken");
  const options={
    httpOnly:true,
    secure:true
  }
    console.log(accessToken);
    console.log(refreshToken);
    return  res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{
        user:loginuser,
        accessToken,
        refreshToken
        },
        "User Logined successfully"
    )
  )


})

const logoutUser=asyncHandler(async (req,res)=>{
    //
    await User.findByIdAndUpdate(req.user._id,{
       $unset:{
        refreshToken:1
       }
    },
    {new:true})
    const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User logged out successfully")
  )
})
const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incommingRefreshToken=  req.cookies.refreshToken || req.body.refreshToken
    if(!incommingRefreshToken){
        throw new Apierror(400,"Unauthorized request")
    }
   try {
     const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user=await User.findById(decodedToken._id)
     if(!user){
         throw new Apierror(404,"User does not exist")
     }
     if(user?.refreshToken !== incommingRefreshToken){
         throw new Apierror(401,"Refresh token is exprired ")
     }
     const options={
         httpOnly:true,
         secure:true
       }
     const {accessToken , newrefreshToken}=  await generateAccessAndRefreshToken(user._id)
       return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(  
         new ApiResponse(200,{
             accessToken,
             newrefreshToken
         },"Access token refreshed successfully")
     )
    } catch (error) {
       throw new Apierror(400,error?.message||"Invalid refresh token");
    
   }
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const{oldPassword , newPassword}=req.body;
    

    const user=await User.findById(req.user?._id);
    const  verifyPassword=await user.isPasswordCorrect(oldPassword);

    if (!verifyPassword) {  
        throw new Apierror(401,"Old password is incorrect");
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    //get user from db
    //remove password and refresh token from response
    //return res
    const user=await User.findById(req.user._id).select("-password -refershtoken");
   return res.status(200).json(
    new ApiResponse(200,user,"Current user fetched successfully")
   )
})
const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname , email}=req.body;
    if(!fullname || !email){
        throw new Apierror(400,"Fullname and email are required")
    }   
    
    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullname,
            email:email
        }

},{new :true}).select("-password ");

return res.status(200).json(
    new ApiResponse(200,user,"User details updated successfully")
)
})



export {registerUser,loginUser,logoutUser,refreshAccessToken,
    changeCurrentPassword,getCurrentUser,updateAccountDetails}