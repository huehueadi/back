import mongoose from 'mongoose'

const smsSchema = new mongoose.Schema({
    recipient_number: { 
        type: String,
        required:true 
    },
    message: { 
        type: String,
        required:true
    },

})

const Sms = mongoose.model("Sms", smsSchema)

export default Sms