import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
export const regsiterOrg = async(req, res)=>{
    const {userId, password,  organisation_name,  organisation_mail, role} = req.body
    try {
        const isExisting = await User.findOne({userId})
        if(isExisting){
            return res.status(409).json({
                message:"Orgainstaion Already registered",
                success:false
            })
        }

        const newRegister = new User({
            userId,
            password,
            organisation_mail,
            organisation_name,
            role

        })
        await newRegister.save()

        res.status(200).json({
            message:"Created",
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const login = async (req, res) => {
    try {
      const { userId, password } = req.body;
  
      const existsUserId = await User.findOne({ userId });
  
      if (!existsUserId) {
        return res.status(404).json({
          message: "Invalid User ID",
          success: false,
        });
      }
  
      // Correct the typo in the password check
      const correctPassword = password === existsUserId.password;  // Password comparison should use '==='
  
      if (!correctPassword) {
        return res.status(400).json({
          message: "Invalid Password",
          success: false,
        });
      }
  
      const payload = {
        id: existsUserId.id,
        userId: existsUserId.userId,
        organisation_mail: existsUserId.orgainsation_mail,
        organisation_name: existsUserId.organisation_name,
        role: existsUserId.role,
      };
  
      const token = jwt.sign(payload, "key");
  
      res.cookie("token", token, {
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });
  
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        payload,
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  };
  