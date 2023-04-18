import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const GenerateToken=async (payload:{email:string, role:string})=>{
    const accessToken= await jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION!})
    const refreshToken= await jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION!})

    return {accessToken,refreshToken}
}

export default GenerateToken