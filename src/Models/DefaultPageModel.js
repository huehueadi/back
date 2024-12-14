import mongoose from "mongoose";

const uploadScreensshotSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    screenshot:{
        type:String,
        required:true
    }
})

const Screenshot = mongoose.model("Screenshot", uploadScreensshotSchema)

export default Screenshot