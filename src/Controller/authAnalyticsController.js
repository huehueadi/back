// import geoip from 'geoip-lite'; // Correct import
// import Analytics from "../Models/AnalyticsModel.js";
// import Qr from "../Models/QrModel.js";

// export const trackScan = async (req, res, next) => {
//     const { qrCodeId } = req.params;  // Extract the QR code ID from the URL params
//     const userAgent = req.get('User-Agent');  // Get the user-agent string (to determine mobile or desktop)
//     const ip = req.ip;  // Get the IP address of the user scanning the QR code
  
//     // Use geoip-lite to get location info based on IP
//     const geo = geoip.lookup(ip);
  
//     try {
//       // Find the QR code from the database using the qrCodeId
//       const qrCodeData = await Qr.findOne({ qrCodeId });
  
//       if (!qrCodeData) {
//         return res.status(404).json({ message: 'QR code not found' });
//       }
  
//       // Check if analytics for this scan already exists based on IP (to avoid duplicate scans)
//       const existingScan = await Analytics.findOne({
//         qrCodeId,
//         ip_address: ip,
//       });
  
//       if (!existingScan) {
        
//         const analyticsData = new Analytics({
//           qrCodeId,  
//           scan_time: new Date(),  
//           device_type: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop', 
//           ip_address: ip,  
//           location: geo ? { country: geo.country, city: geo.city } : { country: 'Unknown', city: 'Unknown' },  // Geolocation info
//         });
  
//         // Save the analytics data to the database
//         await analyticsData.save();
  
//         console.log('Analytics saved:', analyticsData);
//       }
  
     
//       next();
  
//     } catch (err) {
//       console.error('Error tracking scan:', err);
//       res.status(500).json({ message: 'Error tracking scan' });
//     }
//   };



import axios from 'axios'; // Import Axios for making HTTP requests
import Analytics from "../Models/AnalyticsModel.js"; // Import Analytics model
import Qr from "../Models/QrModel.js"; // Import QR code model

const IPIFY_API_KEY = 'at_f5JOcsa3VDjduOp2g0nnDHUTszeKp';  // Replace with your actual IPify API key
const IPIFY_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_API_KEY}&ip=`;

function isLocalIP(ip) {
  return ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31);
}

const getGeoInfoFromIp = async (ip) => {
  try {
    if (isLocalIP(ip)) {
      return { country: 'Local', city: 'Local Network' };
    }

    const response = await axios.get(`${IPIFY_URL}${ip}`);
    const { country = 'Unknown', city = 'Unknown' } = response.data.location || {};
    return { country, city };
  } catch (err) {
    console.error('Error fetching geolocation from ipify:', err.message);
    return { country: 'Unknown', city: 'Unknown' };
  }
};

export const trackScan = async (req, res, next) => {
  const { qrCodeId } = req.params;
  const userAgent = req.get('User-Agent');
  let ip = req.ip;

  try {
    // If behind a reverse proxy, use X-Forwarded-For to get the real IP
    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    ip = ip.replace(/^::ffff:/, ''); // Handle IPv6 mapped IPv4 addresses

    console.log('Received QR Code ID:', qrCodeId);
    console.log('User-Agent:', userAgent);
    console.log('User IP:', ip);

    const qrCodeData = await Qr.findOne({ qrCodeId });

    if (!qrCodeData) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    const existingScan = await Analytics.findOne({
      qrCodeId: qrCodeData.qrCodeId,
      ip_address: ip,
    });

    if (existingScan) {
      console.log('Existing scan detected, skipping...');
      return next();
    }

    const location = await getGeoInfoFromIp(ip);

    const analyticsData = new Analytics({
      qrCodeId: qrCodeData.qrCodeId,
      scan_time: new Date(),
      device_type: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      ip_address: ip,
      location,
    });

    await analyticsData.save();

    console.log('Analytics saved:', analyticsData);
    next();
  } catch (err) {
    console.error('Error tracking scan:', err);
    res.status(500).json({ message: 'Error tracking scan' });
  }
};

export const getAllAnalytics = async(req, res)=>{
    try {
        const getAnalytics = await Analytics.find()

        res.status(200).json({
            message:"fetched",
            sucess:true,
            getAnalytics
        })
    } catch (error) {
        res.status(500).json({
            message:"fetched",
            sucess:false,
           
        })
    }
}