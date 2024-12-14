import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url:{
        type:String
    },
    image_description:{
        type:String
    }
})

const Image = mongoose.model("Image", imageSchema)

export default Image