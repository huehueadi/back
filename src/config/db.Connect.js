import mongoose from "mongoose";

const connectionDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://temploginoffice:vHkZ1dKCANgFFLXe@cluster0.ivmfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
            serverSelectionTimeoutMS: 0, 
            connectTimeoutMS: 0,    
        })
            console.log("Database Connected Successfully")
        
    } catch (error) {
        console.log(error, "Error while connecting the database")
    }
}

export default connectionDB