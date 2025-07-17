import {asyncHandler} from "../utis/asyncHandler.js"
import {Apierror} from  "../utis/Apierror.js"
import {User} from  "../Models/user.model.js"
 import{Service} from "../Models/service.model.js"
import { ApiResponse } from "../utis/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import e from "express"


const addservice = asyncHandler(async (req, res) => {
    const { address,category,description} = req.body;
    const{fullname, email , phone , userName }=req.user;

    console.log("Adding service:", { fullname, email , phone, userName, address, category, description });
    if (!fullname || !email  || !phone || !userName || !address  || !description) {
        throw new Apierror(400, "All fields are required");

    }
    if (!category || !['AC', 'TV', 'cleaning', 'plumbing', 'electrician', 'carpentry', 'painting', 'appliance repair'].includes(category)) {
        throw new Apierror(400, "Invalid category");
    }

    const service=await Service.create({
       user: req.user._id,
        address,
        category,
        description
    })
     const createService=await Service.findById(service._id);
    if(!createService){
        throw new Apierror(500,"Something went wrong while adding service")
    }
    return res.status(201).json(
        new ApiResponse(200, createService, "Service added successfully")
    );
})

const getAllservice=asyncHandler(async (req, res) => {
   const services = await Service.find({ user: req.user._id }).populate('user').select('-__v -createdAt -updatedAt -password -refreshToken');

    console.log("Retrieved services:", services);
    if (!services || services.length === 0) {
        throw new Apierror(404, "No services found");
    }
    return res.status(200).json(
        new ApiResponse(200, services, "Services retrieved successfully")
    );
})
export { addservice ,getAllservice};