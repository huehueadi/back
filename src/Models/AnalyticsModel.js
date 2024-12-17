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
  uniqueScansCount: { type: Number, default: 0 } // Field to store the count of unique scans
});

// Adding a method to increment total scans and track unique scan count
ipLocationSchema.methods.trackScan = async function (ip) {
  // Increment total scans count
  this.totalScans += 1;

  // Increment unique scans count if the scan is from a new IP
  if (this.uniqueScansCount === 0 || !this.uniqueScans.includes(ip)) {
    this.uniqueScansCount += 1;
  }

  // Save the updated scan data
  await this.save();
};

const IpLocation = mongoose.model('IpLocation', ipLocationSchema);

export default IpLocation;


