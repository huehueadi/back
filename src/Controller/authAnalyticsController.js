import axios from 'axios'; // Make sure you have axios imported for HTTP requests
import Analytics from '../Models/AnalyticsModel.js';
// Replace with your actual IPinfo API token
const IPINFO_API_TOKEN = 'eb327d51a73b1b';  // e.g., 'eb327d51a73b1b'

export const trackScan = async (req, res) => {
  try {
    // First, try to use browser geolocation (navigator.geolocation)
    const getBrowserLocation = async () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            error => {
              reject('Geolocation not available or denied');
            }
          );
        } else {
          reject('Geolocation is not supported by this browser');
        }
      });
    };

    let locationData = null;

    try {
      // Try to fetch location using the browser's geolocation
      locationData = await getBrowserLocation();
      console.log('Browser Geolocation:', locationData);  // Log the location

      // If geolocation is available, use this data for the response and DB storage
      const { latitude, longitude } = locationData;

      // Save location in the database
      const newAnalytics = new Analytics({
        qrCodeId: req.params.qrCodeId, // assuming qrCodeId comes from the URL params
        scan_time: new Date(),
        device_type: req.get('User-Agent').includes('Mobile') ? 'Mobile' : 'Desktop',
        ip_address: req.ip,
        location: {
          latitude,
          longitude,
          country: 'Unknown', // Since it's from browser, we don't have country data in browser geolocation
          city: 'Unknown',    // Same as above
          region: 'Unknown',  // Same as above
          timezone: 'Unknown' // Same as above
        },
      });

      await newAnalytics.save();

      return res.json({
        latitude,
        longitude,
        message: 'Location fetched using browser geolocation and saved in the database.',
      });
    } catch (error) {
      console.log('Browser Geolocation failed or not available:', error);
    }

    // If browser geolocation fails, use IP-based geolocation (fallback)
    let ip = req.ip || '';  // Default to req.ip if no header is provided

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
    const { ip: ipAddress, hostname, city, region, country, loc, timezone } = response.data;

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
      console.log('Timezone:', timezone);

      // Save location in the database
      const newAnalytics = new Analytics({
        qrCodeId: req.params.qrCodeId, // assuming qrCodeId comes from the URL params
        scan_time: new Date(),
        device_type: req.get('User-Agent').includes('Mobile') ? 'Mobile' : 'Desktop',
        ip_address: ip,
        location: {
          country,
          city,
          region,
          latitude,
          longitude,
          timezone,
        },
      });

      await newAnalytics.save();

      // Send a response to the client with the location data
      return res.json({
        ip: ipAddress,
        hostname,
        city,
        region,
        country,
        latitude,
        longitude,
        timezone,
        message: 'Location fetched using IP-based geolocation and saved in the database.',
      });
    } else {
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