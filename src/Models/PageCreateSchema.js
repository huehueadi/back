

import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: [
    {
      type: {
        type: String,
        enum: ['text', 'image', 'link'],  // Only allow 'text', 'image', or 'link'
        required: true,
      },
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'content.type',  // Refers to Text, Image, or Link based on 'type'
        required: true,
      },
    },
  ],
  templateId: {
    type: mongoose.Schema.Types.String,
    ref: 'Screenshot',
    required: true
  },
}, { timestamps: true });

const Pagee = mongoose.model('Pagee', pageSchema);

export default Pagee;
