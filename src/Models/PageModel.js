import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      
      slug: {
        type: String,
        required: true,
        unique: true
      },
      template: {
        type: String,
        default: 'basic'
      },
      content: [
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Content'  
        }
      ]
})


const Page = mongoose.model("Page", pageSchema)

export default Page