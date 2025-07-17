
import {mongoose,Schema} from "mongoose";
import{User} from "./user.model.js";
 
import dotenv from "dotenv" 
dotenv.config({
    path: './.env'
})
const serviceSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    address: {
            type: String,
            require: true,
    },
    category:{
         type: String,
    enum: ['AC', 'TV', 'cleaning', 'plumbing', 'electrician', 'carpentry', 'painting', 'appliance repair'],
    },
    description: {
        type: String,
        require: true,
    },
    

},{timestamps:true});



export const Service = mongoose.model("Service", serviceSchema);