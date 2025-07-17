import {mongoose, Schema} from "mongoose";

const contactSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        
    },
    phone: {
        type: String,
         
    }
})
export const Contact = mongoose.model("Contact", contactSchema);