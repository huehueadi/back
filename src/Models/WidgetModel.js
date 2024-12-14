import mongoose from 'mongoose';

const imageWidgetSchema = new mongoose.Schema({
  type: { type: String, enum: ['image'], required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageDescription: { type: String }
});

const formWidgetSchema = new mongoose.Schema({
  type: { type: String, enum: ['form'], required: true },
  title: { type: String, required: true },
  formFields: [{
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'textarea'], required: true },
    required: { type: Boolean, default: false }
  }]
});

const videoWidgetSchema = new mongoose.Schema({
  type: { type: String, enum: ['video'], required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  description: { type: String }
});

const Widget = mongoose.model('Widget', new mongoose.Schema({}));
Widget.discriminator('image', imageWidgetSchema);
Widget.discriminator('form', formWidgetSchema);
Widget.discriminator('video', videoWidgetSchema);

export default Widget;
