import mongoose from "mongoose";


const contentSchema = new mongoose.Schema({
    contentType: {
        type: String,
        enum: ['text', 'link', 'image'], 
        required: true
      },
      contentData: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const Content = mongoose.model("Content", contentSchema)

export default Content