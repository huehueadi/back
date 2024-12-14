import jwt from "jsonwebtoken";

const authentication = (req, res, next)=>{
   const authHeader = req.headers['authorization']

   jwt.verify(authHeader, 'key',(error, user)=>{
    if(error){
        res.status(404).json({
            message:"Forbidden",
            success:false

        })
    }
    req.user = user
    next()

   })
}

export default authentication