// import mongoose from "mongoose";
// const actionTypes = ['call', 'file_upload', 'vcard', 'sms'];

// const SlotSchema = new mongoose.Schema({
//   qrCodeId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   redirectionUrl: {
//     type: String,
//     required: false,
//   },
//   landing_page:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Page1",
//     required:false
//   },

//   action_type:{
//     type:String,
//     enum:actionTypes,

//   },
//   action_details: {
//     call: {
//       phone_number: { type: String }
//     },
//     file_upload: {
//       file_url: { type: String },
//       file_type: { type: String },
//       file_size: { type: Number }
//     },
//     vcard: {
//       first_name:{type:String},
//       last_name: { type: String },
//       email:{type: String},
//       phone_number:{type:String},
//       organisation:{type:String},
//       address:{type:String},
//       website_url:{type:String}

//     },
//     sms: {
//       recipient_number: { type: String },
//       message: { type: String }
//     }
//   },
//   brand_id:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Brand"
//   },

//   startTime: {
//     type: Date,
//     required: true
//   },

//   endTime: {
//     type: Date,
//     required: true
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Slot = mongoose.model('Slot', SlotSchema);
// export default Slot;


import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  qrCodeId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectionUrl: {
    type: mongoose.Schema.Types.String,
    ref:"Redirect",
    required: false,
  },
  landing_page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page1",
    required: false,
  },
  v_card: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vcard",
    required:false
   
  },
  whatsapp: {
   type:mongoose.Schema.Types.ObjectId,
   ref:"Whatsapp",
   required:false
  },
  call: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Call",
    required:false 
  },
  file_upload: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"File",
    required:false 
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;

