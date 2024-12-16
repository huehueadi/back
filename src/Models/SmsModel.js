import mongoose from 'mongoose'

const whatsappSchema = new mongoose.Schema({
    recipient_number: { 
        type: String,
        required:true 
    },
    message: { 
        type: String,
        required:true
    },
    whatsapp_link:{
        type:String,
        required:true
    }

})

const Whatsapp = mongoose.model("Whatsapp", whatsappSchema)

export default Whatsapp