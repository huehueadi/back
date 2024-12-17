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

import axios from 'axios';
import IpLocation from '../Models/AnalyticsModel.js';
import Qr from '../Models/QrModel.js'; // Assuming Qr is a model for QR codes
const IPINFO_API_TOKEN = 'eb327d51a73b1b';  // Your IPInfo API token

export const trackScan = async (req, res, next) => {
  try {
    // Step 1: Fetch and validate IP address from the request
    let ip = req.ip || ''; 

    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    // Validate IP (ignore localhost addresses)
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      return next(); // IP is invalid or localhost, skip tracking
    }

    // Step 2: Fetch IP location data from IPInfo API
    const url = `https://ipinfo.io/${ip}/json?token=${IPINFO_API_TOKEN}`;
    const response = await axios.get(url);

    const { ip: ipAddress, hostname, city, region, country, loc, org, postal, timezone } = response.data;

    if (loc) {
      const [latitude, longitude] = loc.split(',');

      // Step 3: Handle the `qrCodeId` parameter in the request
      const { qrCodeId } = req.params; 
      let qrCodeData = null;

      // Check if qrCodeId exists in the request params
      if (qrCodeId) {
        qrCodeData = await Qr.findOne({ qrCodeId });

        if (!qrCodeData) {
          return res.status(404).json({ message: 'QR code not found' });
        }
      }

      // Step 4: Save IP location data into the database
      const newIpLocation = new IpLocation({
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
        qrCodeId: qrCodeData ? qrCodeData._id : null, // Store the qrCodeId if it exists
      });

      await newIpLocation.save();
      console.log('IP location data saved successfully');

      // Step 5: Update unique and total scan counts
      if (qrCodeData) {
        // Fetch the existing IP location document for the QR code
        const existingIpLocation = await IpLocation.findOne({ qrCodeId: qrCodeData._id });

        if (existingIpLocation) {
          // Call the trackScan method to update the total scans and unique scans
          await existingIpLocation.trackScan(ip);
        }
      }

    }

    // Step 6: Pass control to the next middleware or route handler
    next();

  } catch (error) {
    console.error('Error fetching IP location:', error);
    next(error); // Pass error to next error handler
  }
};


export const getAllAnalyticsData = async(req, res)=>{
  try {
    const ipLocations = await IpLocation.find().populate('qrCodeId'); // Optionally populate qrCodeId to get QR code details

    if (!ipLocations || ipLocations.length === 0) {
      return res.status(404).json({ message: 'No IP location data found' });
    }

    // Prepare the response data, including total scans and unique scans for each location
    const responseData = ipLocations.map(location => {
      return {
        _id: location._id,
        ip: location.ip,
        hostname: location.hostname,
        city: location.city,
        region: location.region,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        org: location.org,
        postal: location.postal,
        timezone: location.timezone,
        qrCodeId: location.qrCodeId, // Populated QR code info
        createdAt: location.createdAt,
        totalScans: location.totalScans, // Total scans for the location
        uniqueScans: location.uniqueScans.length, // Count of unique IPs (i.e., number of unique scans)
        uniqueScanIps: location.uniqueScans // List of unique IPs that scanned
      };
    });

    // Return the list of IP locations with total and unique scans
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching IP locations:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


