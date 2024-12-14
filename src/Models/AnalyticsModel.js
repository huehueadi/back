import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  qrCodeId: {
    type: String,
    required: true,
  },
  scan_time: {
    type: Date,
    default: Date.now, 
  },
  device_type: {
    type: String,
    enum: ['Mobile', 'Desktop'],
    required: true,
  },
  ip_address: {
    type: String,
    required: true, 
  },
  location: {
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown', 
    },
  },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
