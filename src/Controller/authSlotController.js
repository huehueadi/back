import { S3Client } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import moment from 'moment';
import multer from 'multer';
import multerS3 from 'multer-s3';
import vCardsJs from 'vcards-js';
import Call from '../Models/CallModel.js';
import File from '../Models/FileModel.js';
import Slot from "../Models/SlotModel.js";
import Whatsapp from '../Models/SmsModel.js';
import Vcard from '../Models/V-CardModel.js';

const s3 = new S3Client({
  region: process.env.AWS_REGION, // AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up Multer with multer-s3 for file upload to S3
const storage = multerS3({
  s3: s3,
  bucket: 'screenshotsofpages', // Replace with your bucket name
  contentType: (req, file, cb) => {
    const mimeType = mime.lookup(file.originalname); // Get mime type of file
    cb(null, mimeType);
  },
  acl: 'public-read', // Make the file publicly accessible
  key: (req, file, cb) => {
    // Generate a unique file name using the original name and timestamp
    cb(null, `uploads/${Date.now()}-${file.originalname}`);
  },
});

// Set up Multer to use the S3 storage
const upload = multer({ storage: storage }).single('file');




export const createSlot = async (req, res) => {
  try {
    const { 
      qrCodeId, 
      brand_id, 
      startTime, 
      endTime, 
      redirectionUrl, 
      landing_page, 
      v_card, 
      whatsapp, 
      call, 
      file_upload 
    } = req.body;

    console.log(req.body)

    if (!qrCodeId || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const startTimeUTC = moment.tz(startTime, 'Asia/Kolkata').utc().toISOString(); 
    const endTimeUTC = moment.tz(endTime, 'Asia/Kolkata').utc().toISOString();

    const relatedDocuments = await createRelatedDocuments({ v_card, whatsapp, call, file_upload, req });

    const newSlot = new Slot({
      qrCodeId,
      brand_id,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      redirectionUrl: redirectionUrl || null,
      landing_page: landing_page || null,
      v_card: relatedDocuments.v_card || null,
      whatsapp: relatedDocuments.whatsapp || null,
      call: relatedDocuments.call || null,
      file_upload: relatedDocuments.file_upload || null
    });

    await newSlot.save();

    return res.json({
      success: true,
      message: 'Slot created successfully',
      data: newSlot
    });
  } catch (error) {
    console.error('Error creating slot:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createRelatedDocuments = async ({ v_card, whatsapp, call, file_upload, req }) => {
  const documents = {};

  if (v_card) {
    const { 
      first_name, 
      last_name, 
      email, 
      phone_number, 
      organisation, 
      address, 
      website_url, 
      vCardData, 
      birthday, 
      title, 
      photo_url, 
      note 
    } = req.body;
  
    if (!first_name || !last_name || !email) {
      throw new Error("First name, last name, and email are required.");
    }
  
    const generatedVCardData = vCardData || (() => {
      let newVCard = new vCardsJs();
      newVCard.firstName = first_name;
      newVCard.lastName = last_name;
      newVCard.email = email;
      newVCard.workPhone = phone_number;
      newVCard.organization = organisation;
      newVCard.address = address;
  
      if (photo_url) {
        newVCard.photo.attachFromUrl(photo_url, 'JPEG');
      }
  
      newVCard.birthday = birthday ? new Date(birthday) : new Date(1985, 0, 1);
      newVCard.title = title || 'Software Developer';
      newVCard.url = website_url;
      newVCard.note = note || 'Notes on this person';
  
      const vCardString = newVCard.getFormattedString();
      console.log(vCardString)
      if (!vCardString) {
        console.error("Generated vCard data is empty or invalid.");
      }
      return vCardString;
     
    })();
  
    // Check if vCard data is valid
    if (!generatedVCardData) {
      throw new Error("vCard data is invalid or empty.");
    }
  
    const newVcard = new Vcard({
      first_name,
      last_name,
      email,
      phone_number,
      organisation,
      address,
      website_url,
      vCardData: generatedVCardData,
      birthday,
      title,
      photo_url,
      note
    });
  
    try {
      const savedVCard = await newVcard.save();
      if (!savedVCard) {
        throw new Error("Failed to save vCard.");
      }
      documents.v_card = savedVCard;
      console.log("vCard saved successfully:", documents.v_card);
    } catch (error) {
      console.error("Error saving vCard:", error);
    }
  }

  if (whatsapp) {
    const { recipient_number, message } = req.body;
  
    // Validate input fields
    if (!recipient_number || !message) {
      return res.status(400).json({ error: 'Recipient number and message are required.' });
    }
  
    
    const formattedNumber = recipient_number.replace(/\D/g, ''); // Remove non-numeric characters
    
    const encodedMessage = encodeURIComponent(message);
  
    const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
  
    console.log('WhatsApp Link:', whatsappLink);
  
     try {
      const newSms = new Whatsapp({ recipient_number, message, whatsapp_link: whatsappLink });
      const savedSms = await newSms.save();
      documents.whatsapp = savedSms;
  
      // Respond with the WhatsApp link
      // return res.status(200).json({ success: true, message: 'Message saved successfully.', whatsappLink });
    } catch (error) {
      console.error('Error saving SMS:', error);
      // return res.status(500).json({ error: 'Failed to save SMS to the database' });
    }
  }
  

  if (call) {
    const { phone_number } = req.body;
    const newCall = new Call({ phone_number });
    documents.call = await newCall.save();
  }

  if (file_upload) {
    return new Promise((resolve, reject) => {
      upload(req, res, async (err) => {
        if (err) {
          return reject(err);
        }

        const fileUrl = req.file ? req.file.location : null; // S3 file URL
        if (fileUrl) {
          const newFile = new File({ file: fileUrl });
          const savedFile = await newFile.save();
          documents.file_upload = savedFile;
          resolve(documents);
        } else {
          reject(new Error('File upload failed.'));
        }
      });
    });
  }


  return documents;
};
  export const updateSlot = async(req, res)=>{
      try {
          const {slotId} = req.params
  
          const existSlot = await Slot.findById(slotId)
          if(!existSlot){
              res.status(400).json({
                  message:"Slot is not existed",
                  sucess:true
              })
          }
          const slotUpdate = await Slot.findByIdAndUpdate(slotId)
  
          res.status(202).json({
              message:"Slot updated Successfully",
              success:true,
              slotUpdate
          })

      } catch (error) {
          return res.status(501).json({
              message:"Internal Server error",
              success:false
          })
      }
  } 
  export const getAllSlots = async(req, res)=>{
      try {
        const getall = await Slot.find().populate('landing_page', 'pageTitle').populate('brand_id', 'brand_name').exec();
        
        res.status(200).json({
            message:"Fetched slot",
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
  