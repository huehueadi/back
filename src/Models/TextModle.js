import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
    heading:{
        type:String,
    },
    description:{
        type:String
    }
    
})

const Text = mongoose.model("Text", textSchema)

export default Text