// models/Page.js
import mongoose from "mongoose";
const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'link', 'video', 'contactForm'],  // New content types
    required: true
  },
  data: {
  
    heading: { type: String },
    description: { type: String },

    imageUrl: { type: String },
    imageDescription: { type: String },

    linkUrl: { type: String },
    linkDescription: { type: String },

    videoUrl: { type: String },
    videoDescription: { type: String },

    formFields: [
      {
        fieldType: { type: String, enum: ['text', 'email', 'textarea'], required: true },
        label: { type: String, required: true },
        name: { type: String, required: true },
        placeholder: { type: String },
        required: { type: Boolean, default: true }
      }
    ]
  }
});


const pageSchema = new mongoose.Schema({
  pageTitle: { type: String, required: true },
  slug: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.String, required: true },
  content: [contentSchema]
});

const Page1 = mongoose.model("Page1", pageSchema)


export default Page1

// models/Page1.js
// import mongoose from 'mongoose';

// const sectionSchema = new mongoose.Schema({
//   sectionType: { 
//     type: String, 
//     enum: ['header', 'body', 'footer', 'custom'], 
//     required: true 
//   },
//   content: [{
//     type: {
//       type: String,
//       enum: ['text', 'image', 'link'],
//       required: true
//     },
//     data: {
//       heading: { type: String },
//       description: { type: String },
//       imageUrl: { type: String },
//       imageDescription: { type: String },
//       linkUrl: { type: String },
//       linkDescription: { type: String }
//     }
//   }],
//   widgets: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Widget'
//   }],
//   order: { type: Number, required: true }
// });

// const pageSchema = new mongoose.Schema({
//   pageTitle: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   templateId: { type: String, required: true },
//   sections: [sectionSchema]
// });

// const Page1 = mongoose.model('Page1', pageSchema);

// export default Page1;

