import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brand_name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    created_at:{
        type:Date,
        default:Date.now
    },
    
    updated_at:{
        type:Date,
        default:Date.now
    }
})

const Brand = mongoose.model("Brand", brandSchema)

export default Brand