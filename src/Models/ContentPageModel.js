import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    type:{
        type:String,
        enum: ['text', 'image', 'link'],
        required:true
    },

    textContent: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Text' 
    },

  imageContent: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Image' 
},

  linkContent: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Link'
 }
}, 
{ timestamps: true });

const Contentt = mongoose.model("Contentt", contentSchema)

export default Contentt