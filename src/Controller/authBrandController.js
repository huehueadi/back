import Brand from "../Models/BrandModel.js"
export const createBrand = async(req, res)=>{
    try {
        const {brand_name, description} = req.body

        const isExisting = await Brand.findOne({brand_name})
        if(isExisting){
            res.status(400).json({
                message:"Brand Already resgsitered",
                success:false
            })
        } 

        const newBrand = new Brand({
            brand_name,
            description
        })

        await newBrand.save()

        res.status(201).json({
            message:"Brand regsitered Sucessfully",
            success:true
        })

    } catch (error) {
        res.status(501).json({
            message:"Internal Server error",
            success:false
        })
    }
}

export const getBrand = async(req, res)=>{
    try {
        const getall = await Brand.find()

        res.status(200).json({
            message:"All fetch successfully",
            success:true
        })
    } catch (error) {
        res.status(501).json({
            message:"Internal Server error",
            success:false
        })
    }
}

export const updateBrand = async(req, res)=>{

    try {
        const {brand_id} = req.paprams
        const isExisting = await Brand.findOne(brand_id)
        if(!isExisting){
            res.status(400).json({
                message:"Brand is not found",
                success:false
            })
        }
        const updatedBrand = await Brand.findByIdAndUpdate(brand_id)
        res.status(201).json({
            message:"Brand updated successfully Updated",
            success:false,
            updatedBrand
        })

    } catch (error) {
        res.status(502).json({
            message:"Internal Server error",
            success:false
        })
    }
}

export const getallBrands = async(req, res)=>{
    try {
        const getall = await Brand.find()

        res.status(200).json({
            message:"Brands Fetched",
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