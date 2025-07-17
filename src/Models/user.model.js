import e from "express";
import {mongoose, Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv" 
dotenv.config({
    path: './.env'
})
 
const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
         
    },
    phone:{
        type:String,
        required:true,
        unique:true

    },
     refreshtoken:{
            type:String
    }

},{timestamps:true});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}
//token and generation
userSchema.methods.generateAccessToken=function () {
     return  jwt.sign( 
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// token and jwt
userSchema.methods.generateRefreshToken=function () {
     return  jwt.sign( 
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}

export const User = mongoose.model("User", userSchema);