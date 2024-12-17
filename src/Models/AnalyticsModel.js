import mongoose from 'mongoose';

const ipLocationSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  hostname: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  country: { type: String, required: false },
  latitude: { type: String, required: false },
  longitude: { type: String, required: false },
  org: { type: String, required: false },
  postal: { type: String, required: false },
  timezone: { type: String, required: false },
  qrCodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Qr', required: false }, // ObjectId to reference QR code
  createdAt: { type: Date, default: Date.now },
  totalScans: { type: Number, default: 0 }, // Field to store the total number of scans
  uniqueScans: { type: [String], default: [] } // Array of unique IPs that scanned the QR code
});

// Adding a method to increment total scans and track unique scans by IP
ipLocationSchema.methods.trackScan = async function (ip) {
  // Increment total scans count
  this.totalScans += 1;

  // Ensure the IP is unique (add to the uniqueScans array only if it doesn't exist)
  if (!this.uniqueScans.includes(ip)) {
    this.uniqueScans.push(ip);
  }

  // Save the updated scan data
  await this.save();
};

const IpLocation = mongoose.model('IpLocation', ipLocationSchema);

export default IpLocation;

