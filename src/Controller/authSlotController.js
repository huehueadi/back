import moment from 'moment';
import vCardsJs from 'vcards-js';
import Call from '../Models/CallModel.js';
import File from '../Models/FileModel.js';
import Slot from "../Models/SlotModel.js";
import Sms from '../Models/SmsModel.js';
import Vcard from '../Models/V-CardModel.js';

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
      sms, 
      call, 
      file_upload 
    } = req.body;

    // Validate required fields
    if (!qrCodeId || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Convert startTime and endTime to UTC
    const startTimeUTC = moment.tz(startTime, 'Asia/Kolkata').utc().toISOString(); 
    const endTimeUTC = moment.tz(endTime, 'Asia/Kolkata').utc().toISOString();

    // Create related documents (v_card, sms, call, file_upload)
    const relatedDocuments = await createRelatedDocuments({ v_card, sms, call, file_upload, req });

    // Create and save the new Slot
    const newSlot = new Slot({
      qrCodeId,
      brand_id,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      redirectionUrl: redirectionUrl || null,
      landing_page: landing_page || null,
      v_card: relatedDocuments.v_card || null,
      sms: relatedDocuments.sms || null,
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

const createRelatedDocuments = async ({ v_card, sms, call, file_upload, req }) => {
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

  if (sms) {
    const { recipient_number, message } = req.body;
    const newSms = new Sms({ recipient_number, message });
    documents.sms = await newSms.save();
  }

  if (call) {
    const { phone_number } = req.body;
    const newCall = new Call({ phone_number });
    documents.call = await newCall.save();
  }

  if (file_upload) {
    const { file } = req.body;
    const newFile = new File({ file });
    documents.file_upload = await newFile.save();
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
  