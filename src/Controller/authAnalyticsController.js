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



// import axios from 'axios'; // Import Axios for making HTTP requests
// import Analytics from "../Models/AnalyticsModel.js"; // Import Analytics model
// import Qr from "../Models/QrModel.js"; // Import QR code model

// const IPINFO_API_TOKEN = 'eb327d51a73b1b';  // Replace with your IPinfo API token
// const IPINFO_URL = 'https://ipinfo.io/';  // IPinfo API URL

// // Function to check if the IP is a local network IP
// function isLocalIP(ip) {
//   return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31);
// }

// // Function to fetch latitude and longitude from IP using IPinfo API
// const getLatLonFromIp = async (ip) => {
//   try {
//     // If the IP is a local IP, return null for lat and lon
//     if (isLocalIP(ip)) {
//       return { latitude: null, longitude: null };
//     }

//     // Make the request to the IPinfo API
//     const response = await axios.get(`${IPINFO_URL}${ip}/json?token=${IPINFO_API_TOKEN}`);
    
//     // Extract the loc field from the response, which contains lat,long
//     const { loc = '0,0' } = response.data;

//     // Split the loc field into latitude and longitude
//     const [latitude, longitude] = loc.split(',');

//     // Return latitude and longitude as floating-point numbers
//     return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
//   } catch (err) {
//     console.error('Error fetching latitude and longitude from IPinfo:', err.message);
//     return { latitude: null, longitude: null };  // Return null if there was an error
//   }
// };

// // Main function to track QR scan and save analytics
// export const trackScan = async (req, res, next) => {
//   const { qrCodeId } = req.params;
//   const userAgent = req.get('User-Agent');
//   let ip = req.ip;

//   try {
//     // If behind a reverse proxy, get the real IP from X-Forwarded-For
//     if (req.headers['x-forwarded-for']) {
//       ip = req.headers['x-forwarded-for'].split(',')[0].trim();
//     }

//     ip = ip.replace(/^::ffff:/, ''); // Handle IPv6 mapped IPv4 addresses

//     console.log('Received QR Code ID:', qrCodeId);
//     console.log('User-Agent:', userAgent);
//     console.log('User IP:', ip);

//     // Check if the QR code exists in the database
//     const qrCodeData = await Qr.findOne({ qrCodeId });
//     if (!qrCodeData) {
//       return res.status(404).json({ message: 'QR code not found' });
//     }

//     // Check if this scan has already been recorded for the same IP
//     const existingScan = await Analytics.findOne({
//       qrCodeId: qrCodeData.qrCodeId,
//       ip_address: ip,
//     });
//     if (existingScan) {
//       console.log('Existing scan detected, skipping...');
//       return next();  // Skip if the scan has already been recorded
//     }

//     // Fetch latitude and longitude using IPinfo API
//     const { latitude, longitude } = await getLatLonFromIp(ip);

//     // Log the latitude and longitude to the console
//     console.log('Latitude:', latitude);
//     console.log('Longitude:', longitude);

//     // Save analytics data including location
//     const analyticsData = new Analytics({
//       qrCodeId: qrCodeData.qrCodeId,
//       scan_time: new Date(),
//       device_type: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
//       ip_address: ip,
//       location: {
//         latitude,
//         longitude,
//       },
//     });

//     await analyticsData.save();

//     console.log('Analytics saved:', analyticsData);
//     next();  // Proceed to the next middleware
//   } catch (err) {
//     console.error('Error tracking scan:', err);
//     res.status(500).json({ message: 'Error tracking scan' });
//   }
// };

import axios from 'axios'; // Make sure you have axios imported for HTTP requests

// Replace with your actual IPinfo API token
const IPINFO_API_TOKEN = 'eb327d51a73b1b';  // e.g., 'eb327d51a73b1b'

export const trackScan = async (req, res) => {
  try {
    // Get the real IP address, considering the possible reverse proxy headers
    let ip = req.ip || ''; // Default to req.ip if no header is provided

    // If behind a reverse proxy (e.g., Nginx, cloud hosting), use X-Forwarded-For header
    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    // If the IP address is not valid, respond with an error
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      return res.status(400).json({ message: 'Invalid IP address' });
    }

    // IPinfo API URL with your token
    const url = `https://ipinfo.io/${ip}/json?token=${IPINFO_API_TOKEN}`;

    // Call the IPinfo API to get geolocation data
    const response = await axios.get(url);

    // Destructure the relevant information from the response
    const { ip: ipAddress, hostname, city, region, country, loc, org, postal, timezone } = response.data;

    // If location (latitude, longitude) is available
    if (loc) {
      const [latitude, longitude] = loc.split(',');

      // Log the results to the console
      console.log('IP Address:', ipAddress);
      console.log('Hostname:', hostname);
      console.log('City:', city);
      console.log('Region:', region);
      console.log('Country:', country);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Organization:', org);
      console.log('Postal Code:', postal);
      console.log('Timezone:', timezone);

      // Send a response to the client with the location data
      return res.json({
        ip: ipAddress,
        hostname,
        city,
        region,
        country,
        latitude,
        longitude,
        org,
        postal,
        timezone,
        message: 'Location and detailed IP information fetched successfully.',
      });
    } else {
      // Handle case when location is not found
      return res.status(404).json({ message: 'Location not found for the IP address.' });
    }
  } catch (error) {
    console.error('Error fetching IP location:', error);

    // Handle different types of errors (e.g., API errors, request issues)
    if (error.response) {
      // API responded with an error
      return res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      // No response was received
      return res.status(500).json({ message: 'No response received from IPinfo API.' });
    } else {
      // General error
      return res.status(500).json({ message: 'Error fetching IP location' });
    }
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