import express from 'express'
import { getAllAnalytics } from '../Controller/authAnalyticsController.js'
import { createBrand, getBrand, getallBrands, updateBrand } from '../Controller/authBrandController.js'
import { getdefaultTemplate } from '../Controller/authGetdefaultPageController.js'
import { createPage, getPage } from '../Controller/authPageController.js'
import { generateQrCode, getallQr, redirectQrCode, updateQrCodeUrl } from '../Controller/authQrController.js'
import { createSlot, getAllSlots, updateSlot } from '../Controller/authSlotController.js'
import { getAlluploaded, screenshotUpload, upload } from '../Controller/authUploadScreenShotController.js'
import { login, regsiterOrg } from '../Controller/authUserController.js'
import { createPage1, getAllPage, getapge1 } from '../Controller/authpage1.js'
import authentication from '../Middleware/authUserMiddleware.js'

const router = express.Router()

router.post('/register',regsiterOrg)
router.post('/login', login)

router.post('/add-brand',createBrand)
router.get('/get_brand', getBrand)
router.post('/update_brand',updateBrand)
router.get('/get-all-brand',authentication, getallBrands)

router.post('/generate', generateQrCode);
router.put('/update/:qrCodeId',updateQrCodeUrl);
router.get('/redirect/:qrCodeId',redirectQrCode);
router.get('/get-all-qr', getallQr)

router.post('/create-slot',createSlot);
router.post('upadte_slot', updateSlot)
router.get('/get-all-slots', getAllSlots)

router.post('/create', createPage)
// router.get('/get-all', getAllPages)
router.get('/redirect/get/:slug',getPage)

router.get('/default/:name', getdefaultTemplate)

router.post('/upload', upload.single('file'), screenshotUpload )
router.get('/getall', getAlluploaded)

// router.post('/create-cont', createContent)

// router.post('/createp/:templateId',createPagee)
// router.get('/getslug',getPageBySlug)

router.post('/page1/:templateId', createPage1)
router.get('/redirect/getpage1/:slug', getapge1)
router.get('/getapge1-all', getAllPage)



router.get('/get-analytics', getAllAnalytics)
router.get('/',(req, res)=>{
    res.json({
        message:"hello"
    })
})



export default router