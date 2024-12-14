import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    link:{
        type:String
    },
    link_descrption:{
        type:String
    }

})

const Link = mongoose.model("Link", linkSchema)

export default Link