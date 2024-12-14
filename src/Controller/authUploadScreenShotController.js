import { S3Client } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import multer from 'multer';
import multerS3 from 'multer-s3';
import Screenshot from '../Models/DefaultPageModel.js';

const s3 = new S3Client({
    region: process.env.AWS_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const storage = multerS3({
    s3:s3,
    bucket:"screenshotsofpages",
    contentType: (req, file, cb) => {
        const mimeType = mime.lookup(file.originalname);  
        cb(null, mimeType); 
    },
  })
 
export const upload = multer({storage:storage})

export const screenshotUpload = async(req, res)=>{
    try {
        const {name} = req.body

        const fileExists = await Screenshot.findOne({name})

        if(fileExists){
            res.status(404).json({
                message:"File already exist",
                success:false
            })
        }
        if(!req.file){
            res.status(404).json({
                message:"No file found",
                sucess:false 
            })
        }

        const fileUrl = req.file.location

        const screenshotSaved = new Screenshot({
            name,
            screenshot:fileUrl
        })

        await screenshotSaved.save()
        res.status(201).json({
            message:"file uplaoded successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const getAlluploaded = async(req, res)=>{
    try {
        const allFilesUrl = await Screenshot.find()

        res.status(200).json({
            message:"All files",
            sucess:true,
            allFilesUrl
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}