import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
    phone_number:{
        type:String,
        required:true
    }
})

const Call = mongoose.model("Call", callSchema)

export default Call 