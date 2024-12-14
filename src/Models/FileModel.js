import mongoose from 'mongoose'

const fileschema = new mongoose.Schema({
    file:{
        type:String,
        required:true
    }
})

const File = mongoose.model("File", fileschema)

export default File