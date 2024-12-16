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
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  location: {
    country: String,
    city: String,
    region: String,
    latitude: String,
    longitude: String,
    timezone: String,
  },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
