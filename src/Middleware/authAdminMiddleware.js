import moment from 'moment';
import vCardsJs from 'vcards-js';
import Call from '../Models/CallModel.js';
import Slot from "../Models/SlotModel.js";
import Whatsapp from '../Models/SmsModel.js';
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
      whatsapp, 
      call, 
    } = req.body;

    console.log(req.body)

    if (!qrCodeId || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const startTimeUTC = moment.tz(startTime, 'Asia/Kolkata').utc().toISOString(); 
    const endTimeUTC = moment.tz(endTime, 'Asia/Kolkata').utc().toISOString();

    const relatedDocuments = await createRelatedDocuments({ v_card, whatsapp, call, req });

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

const createRelatedDocuments = async ({ v_card, whatsapp, call, req }) => {
  const documents = {};

  if (v_card) {
    // Process vCard related logic
    const { first_name, last_name, email, phone_number, organisation, address, website_url, vCardData, birthday, title, photo_url, note } = req.body;
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

      return newVCard.getFormattedString();
    })();

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
      documents.v_card = savedVCard;
      
    } catch (error) {
      throw new Error("Error while creating vCard: " + error.message);
    }
  } else if (whatsapp) {
    // Process WhatsApp related logic
    const { recipient_number, message } = req.body;
    if (!recipient_number || !message) {
      throw new Error('Recipient number and message are required.');
    }

    const formattedNumber = recipient_number.replace(/\D/g, '');  // Clean the number (remove non-numeric chars)
    const encodedMessage = encodeURIComponent(message);  // Encode message to prevent issues with special characters
    const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;

    const newSms = new Whatsapp({ recipient_number, message, whatsapp_link: whatsappLink });
    const savedSms = await newSms.save();
    documents.whatsapp = savedSms;
  } else if (call) {
    // Process Call related logic
    const { phone_number } = req.body;
    if (!phone_number) {
      throw new Error('Phone number is required for call.');
    }

    const newCall = new Call({ phone_number });
    const savedCall = await newCall.save();
    documents.call = savedCall;
  } else {
    // If none of the conditions are met, you can throw an error or handle it differently
    throw new Error('No valid type found in the request body (v_card, whatsapp, or call).');
  }

  return documents;
};