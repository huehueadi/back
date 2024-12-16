// import geoip from "geoip-lite";
// import QRCode from "qrcode";
// import Qr from "../models/qrModel.js";
// import Analytics from "../models/scanAnalytics.js";
// // Generate QR Code
// export const generateQrCode = async (req, res) => {
//   const { qrCodeId, url } = req.body;

//   if (!qrCodeId || !url) {
//     return res.status(400).json({ message: 'qrCodeId and url are required' });
//   }
//   try {
//     const existingQrCode = await Qr.findOne({ qrCodeId });
//     if (existingQrCode) {
//       return res.status(400).json({ message: 'QR Code ID already exists' });
//     }

//     // Save new QR Code entry to database
//     const newQrCode = new Qr({ qrCodeId, url });
//     await newQrCode.save();

//     // Generate QR Code image URL pointing to the redirect URL
//     QRCode.toDataURL(`https://qrbackend-aio3.onrender.com/api/redirect/${qrCodeId}`, (err, qrCodeUrl) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error generating QR code' });
//       }

//         res.json({
//         message: 'QR code generated successfully!',
//         qrCodeUrl,
//         qrCodeId
//       });
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error generating QR code' , error: err.message || err,});
//   }
// };

// // Redirect to the stored URL when QR code is scanned
// // export const redirectQrCode = async (req, res) => {
// //   const { qrCodeId } = req.params;

// //   try {
// //     console.log('Received QR Code ID:', qrCodeId); 

// //     // Find the QR code by its ID
// //     const qrCode = await Qr.findOne({ qrCodeId });
// //     console.log('Database Query Result:', qrCode);

// //     if (!qrCode) {
// //       return res.status(404).json({ message: 'QR code not found' });
// //     }

// //     // Redirect to the stored URL
// //     res.redirect(qrCode.url);
// //   } catch (err) {
// //     console.error('Error processing redirection:', err);
// //     res.status(500).json({ message: 'Error processing redirection' });
// //   }
// // };

// export const redirectQrCode = async (req, res) => {
//   const { qrCodeId } = req.params; 
//   const userAgent = req.get('User-Agent');  
//   const ip = req.ip;  
//   const geo = geoip.lookup(ip);  
//   try {
   
//     const qrCodeData = await Qr.findOne({ qrCodeId });

//     if (!qrCodeData) {
//       return res.status(404).json({ message: 'QR code not found' });
//     }

//     const analyticsData = new Analytics({
//       qrCodeId,
//       scan_time: new Date(),  
//       device_type: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',  
//       ip_address: ip,  
//       location: geo ? { country: geo.country, city: geo.city } : { country: 'Unknown', city: 'Unknown' }, 
//       redirection_link: qrCodeData._id,  
//     });

//     await analyticsData.save(); 
//     console.log('Analytics saved:', analyticsData);  
//     // Redirect the user to the URL associated with the QR code
//     res.redirect(qrCodeData.url);

//   } catch (err) {
//     console.error('Error processing redirection:', err);
//     res.status(500).json({ message: 'Error processing redirection', error: err.message });
//   }
// };

// // Update the URL associated with a QR code
// export const updateQrCodeUrl = async (req, res) => {
//   const { qrCodeId } = req.params;
//   const { newUrl } = req.body;

//   if (!newUrl) {
//     return res.status(400).json({ message: 'New URL is required' });
//   }

//   try {
   
//     const qrCode = await Qr.findOne({ qrCodeId });

//     if (!qrCode) {
//       return res.status(404).json({ message: 'QR code not found' });
//     }

//     // Update the URL
//     qrCode.url = newUrl;
//     await qrCode.save();

//     res.json({ message: 'QR code URL updated successfully!' });
//   } catch (err) {
//     console.error('Error updating QR code URL:', err);
//     res.status(500).json({ message: 'Error updating QR code URL' });
//   }
// };

// export const getQr = async (req, res)=>{
//   try {
//      const fetchQr = await Qr.find()
//      res.status(200).json({
//       message:"Qr fetch sucessfully",
//       success:true,
//       fetchQr
//      })
//   } catch (error) {
//     res.status(502).json({
//       message:"Internal server error while fetching Qr codes",
//       success:false
//     })
//   }
// }

// export const deleteQr = async(req, res)=>{
//   try {
    
//   } catch (error) {
    
//   }
// }

// import fetch from 'node-fetch';
// import QRCode from 'qrcode';
// import Qr from '../models/qrModel.js';
// import Analytics from '../models/scanAnalytics.js';
// import Slot from '../models/slotmodel.js';


// export const generateQrCode = async (req, res) => {
//   const { qrCodeId, url } = req.body;

//   if (!qrCodeId || !url) {
//     return res.status(400).json({ message: 'qrCodeId and url are required' });
//   }

//   try {
//     const existingQrCode = await Qr.findOne({ qrCodeId });
//     if (existingQrCode) {
//       return res.status(400).json({ message: 'QR Code ID already exists' });
//     }

//     const newQrCode = new Qr({ qrCodeId, url });
//     await newQrCode.save();

//     QRCode.toDataURL(`https://qrbackend-aio3.onrender.com/api/redirect/${qrCodeId}`, (err, qrCodeUrl) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error generating QR code' });
//       }

//       res.json({
//         message: 'QR code generated successfully!',
//         qrCodeUrl, // URL for the generated QR code image
//         qrCodeId,  // The ID of the generated QR code
//       });
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error generating QR code' });
//   }
// };

// export const redirectQrCode = async (req, res) => {
//   const { qrCodeId } = req.params;
//   const userAgent = req.get("User-Agent");
//   const ip = req.ip;

//   const ipinfoUrl = `http://ipinfo.io/${ip}?token=eb327d51a73b1b`;

//   try {
//     // Fetch geo-location data
//     let location = { country: "Unknown", city: "Unknown" };
//     try {
//       const geoResponse = await fetch(ipinfoUrl);
//       const geo = await geoResponse.json();
//       if (geo && geo.country && geo.city) {
//         location = { country: geo.country, city: geo.city };
//       }
//     } catch (error) {
//       console.error("Geo-location fetch failed:", error);
//     }

//     // Find the QR code document
//     const qrCodeData = await Qr.findOne({ qrCodeId });
//     if (!qrCodeData) {
//       return res.status(404).json({ message: "QR code not found" });
//     }

//     // Find slot data associated with the QR code
//     const slotData = await Slot.findOne({ qrCodeId });

//     if (!slotData) {
//       return res.status(404).json({ message: 'Slot not found' });
//     }

//     // Determine the redirect URL (default or redirection based on time)
//     let redirectUrl = slotData.defaultUrl;  // Default URL for first 2 minutes

//     const currentTime = new Date();
//     const slotCreationTime = new Date(slotData.createdAt);
//     const twoMinutesInMillis = 2 * 60 * 1000; // 2 minutes in milliseconds
//     const timeElapsed = currentTime - slotCreationTime;

//     if (timeElapsed > twoMinutesInMillis) {
//       // After 2 minutes, use the redirection URL
//       redirectUrl = slotData.redirectionUrl;
//     }

//     // Save analytics data (for tracking purpose)
//     const analyticsData = new Analytics({
//       qrCodeId,
//       scan_time: new Date(),
//       device_type: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
//       ip_address: ip,
//       location: location,
//       redirection_link: qrCodeData._id,
//     });

//     await analyticsData.save();

//     // Redirect user
//     res.redirect(redirectUrl);
//   } catch (err) {
//     console.error("Error processing redirection:", err);
//     res.status(500).json({ message: "Error processing redirection" });
//   }
// };
// export const updateQrCodeUrl = async (req, res) => {
//   const { qrCodeId } = req.params;
//   const { newUrl, redirectionUrl, defaultUrl } = req.body;

//   if (!newUrl || !redirectionUrl || !defaultUrl) {
//     return res.status(400).json({ message: 'New URL, Redirection URL, and Default URL are required' });
//   }

//   try {
//     // Find the QR code
//     const qrCode = await Qr.findOne({ qrCodeId });

//     if (!qrCode) {
//       return res.status(404).json({ message: 'QR code not found' });
//     }

//     // Update the QR code URL
//     qrCode.url = newUrl;
//     await qrCode.save();

//     // Find the associated slot
//     const slotData = await Slot.findOne({ qrCodeId });

//     if (slotData) {
//       // Update slot URLs
//       slotData.redirectionUrl = redirectionUrl;
//       slotData.defaultUrl = defaultUrl;
//       await slotData.save();

//       res.json({ message: 'QR code and slot URLs updated successfully!' });
//     } else {
//       res.status(404).json({ message: 'Slot not found for the QR code' });
//     }
//   } catch (err) {
//     console.error('Error updating QR code or slot URLs:', err);
//     res.status(500).json({ message: 'Error updating QR code or slot URLs' });
//   }
// };


import moment from 'moment-timezone';
import QRCode from "qrcode";
import Call from '../Models/CallModel.js';
import File from '../Models/FileModel.js';
import Page1 from '../Models/Page1Model.js';
import Qr from '../Models/QrModel.js';
import Slot from '../Models/SlotModel.js';
import Whatsapp from '../Models/SmsModel.js';
import Vcard from '../Models/V-CardModel.js';

// export const generateQrCode = async (req, res) => {
//   const { qrCodeId, url } = req.body;

//   if (!qrCodeId || !url) {
//     return res.status(400).json({ message: 'QR Code ID and URL are required.' });
//   }

//   try {
//     const existingQrCode = await Qr.findOne({ qrCodeId });
//     if (existingQrCode) {
//       return res.status(400).json({ message: 'QR Code ID already exists.' });
//     }

//     // Save the new QR code with the default URL
//     const newQrCode = new Qr({ qrCodeId, url });
//     await newQrCode.save();

   
//     QRCode.toDataURL(`https://backend-2-6fow.onrender.com/api/redirect/${qrCodeId}`, (err, qrCodeUrl) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error generating QR code.' });
//       }
//       res.json({
//         message: 'QR code generated successfully!',
//         qrCodeUrl,
//         qrCodeId,
//       });
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error generating QR code.' });
//   }
// };

export const generateQrCode = async (req, res) => {
  const { qrCodeId, url } = req.body;

  if (!qrCodeId || !url) {
    return res.status(400).json({ message: 'QR Code ID and URL are required.' });
  }

  try {
    // Check if QR code ID already exists
    const existingQrCode = await Qr.findOne({ qrCodeId });
    if (existingQrCode) {
      return res.status(400).json({ message: 'QR Code ID already exists.' });
    }

    // Generate QR code URL using QRCode.toDataURL()
    const qrCodeUrl = await QRCode.toDataURL(`https://back-cuch.onrender.com/api/redirect/${qrCodeId}`);

   
    const newQrCode = new Qr({
      qrCodeId,
      url,
      qrImage: qrCodeUrl,  
    });

    // Save the new QR code in the database
    await newQrCode.save();

    // Return the success response with the QR code URL and other information
    return res.json({
      message: 'QR code generated and saved successfully!',
      qrCodeUrl,
      qrCodeId,
    });

  } catch (err) {
    console.error('Error generating QR code:', err);
    return res.status(500).json({ message: 'Error generating QR code.' });
  }
};

export const redirectQrCode = async (req, res) => {
  const { qrCodeId } = req.params;
  
  try {
    // Fetch QR Code Data
    const qrCodeData = await Qr.findOne({ qrCodeId });

    if (!qrCodeData) {
      return res.status(404).json({ message: 'QR code not found.' });
    }

    const currentTime = moment.utc();  // Get current UTC time
    console.log("Current Time (UTC):", currentTime.format('YYYY-MM-DD HH:mm:ss'));

    // Convert current time from UTC to IST
    const currentTimeIST = currentTime.clone().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    console.log("Current Time (IST):", currentTimeIST);

    // Fetch Slot Data
    const slotData = await Slot.findOne({ qrCodeId });

    console.log(slotData);
    let redirectUrl = qrCodeData.url;  // Default to QR code URL

    // Check if slot data exists
    if (slotData) {
      const { startTime, endTime, redirectionUrl, landing_page, v_card, call, whatsapp, file_upload } = slotData;

      // Convert Slot Start and End Times from UTC to IST
      const slotStartTime = moment.utc(startTime).tz('Asia/Kolkata');
      const slotEndTime = moment.utc(endTime).tz('Asia/Kolkata');
      console.log("Slot Start Time (IST):", slotStartTime.format('YYYY-MM-DD HH:mm:ss'));
      console.log("Slot End Time (IST):", slotEndTime.format('YYYY-MM-DD HH:mm:ss'));

      if (currentTime.isBetween(slotStartTime, slotEndTime, null, '[]')) {
        // If current time is within the slot time range, handle different scenarios:
        if (landing_page) {
          const landingPage = await Page1.findOne({ slug: landing_page });

          if (landingPage) {
            console.log("Landing Page found:", landingPage);
            return res.redirect(`/getpage1/${landingPage.slug}`);
          } else {
            console.log("Landing page not found.");
            return res.status(404).json({ message: 'Landing page not found.' });
          }
        } else if (redirectionUrl) {
          redirectUrl = redirectionUrl;  // Use the provided redirection URL if available
        }
      // If v_card exists, handle the vCard download
      else if (v_card) {
        const vcardExist = await Vcard.findOne({ _id: v_card });

        if (vcardExist) {
          // Set the headers for the vCard download
          res.setHeader('Content-Type', 'text/vcard');
          res.setHeader('Content-Disposition', 'attachment; filename="contact.vcf"');
          // Send the vCard content as the response
        return  res.send(vcardExist.vCardData);
        } else {
          // If vCard is not found in the database
          console.log("vCard not found.");
          return res.status(400).json({
            message: "vCard not found in the database."
          });
        }
      }
        else if(call) {
        const numberExist = await Call.findById(call);
        if(numberExist){
          const callUrl = `tel:${numberExist.phone_number}`
         
          res.send(callUrl)
        }
        else {
          // If vCard is not found in the database
          console.log("vCard not found.");
          return res.status(400).json({
            message: "vCard not found in the database."
          });
        }
      }
    
    else if(whatsapp){
      const whatsappExist = await Whatsapp.findById(whatsapp)
      if(whatsappExist){
        const whatsappLink = whatsappExist.whatsapp_link

       return res.send(whatsappLink)
      }
      else{
        console.log("link not found")
        return res.status(400).json({
          message: "vCard not found in the database."
        });
      }
    }
    
  else if(file_upload){
    const fileExists = await File.findById(file_upload)
    if(fileExists){
      const fileLink = fileExists.file

      return res.redirect(fileLink)
    }
    else{
      console.log("link not found")
      return res.status(400).json({
        message: "vCard not found in the database."
      });
    }
    
  }
}


       else {
        console.log("Current time is outside the valid slot time window.");
      }
    }

    // If the slot does not exist or no conditions are met, log and return a status
    console.log("Final redirectUrl:", redirectUrl);

    if (!redirectUrl) {
      return res.status(400).json({ message: 'Redirection URL is undefined or invalid.' });
    }

    // Perform the redirection
    res.redirect(redirectUrl);

  } catch (err) {
    console.error('Error during redirection:', err);
    res.status(500).json({ message: 'Error processing redirection.' });
  }
};




export const updateQrCodeUrl = async (req, res) => {
    const { qrCodeId } = req.params;
    const { newUrl, redirectionUrl, defaultUrl } = req.body;
  
    if (!newUrl || !redirectionUrl || !defaultUrl) {
      return res.status(400).json({ message: 'New URL, Redirection URL, and Default URL are required' });
    }
  
    try {
      // Find the QR code
      const qrCode = await Qr.findOne({ qrCodeId });
  
      if (!qrCode) {
        return res.status(404).json({ message: 'QR code not found' });
      }
      
      qrCode.url = newUrl;
      await qrCode.save();
      
      const slotData = await Slot.findOne({ qrCodeId });
  
      if (slotData) {
       
        slotData.redirectionUrl = redirectionUrl;
        slotData.defaultUrl = defaultUrl;
        await slotData.save();
  
        res.json({ message: 'QR code and slot URLs updated successfully!' });
      } else {
        res.status(404).json({ message: 'Slot not found for the QR code' });
      }

    } catch (err) {
      console.error('Error updating QR code or slot URLs:', err);
      res.status(500).json({ message: 'Error updating QR code or slot URLs' });
    }
  };
  
export const getallQr = async (req, res)=>{
    try {
        const getall = await Qr.find().select('qrCodeId qrImage')

        res.status(200).json({
            message:"Fetched",
            success:true,
            getall
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}