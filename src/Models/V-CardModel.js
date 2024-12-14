import mongoose from 'mongoose'

const vcardSchema = new mongoose.Schema({
    first_name: { type: String, required: true  },
    last_name: { type: String, required: true  },
    email: { type: String, required: true  },
    phone_number: { type: String, required: true  },
    organisation: { type: String, required: true  },
    address: { type: String, required: true  },
    website_url: { type: String, required: true  },
    vCardData: { type: String, required:true  }
})

const Vcard = mongoose.model('Vcard', vcardSchema)

export default Vcard