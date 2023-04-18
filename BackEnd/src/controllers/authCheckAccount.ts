import { Request,Response } from "express";
import dotenv from'dotenv'
import DB from "../db/DB";
dotenv.config()
const authCheckAccount = async (req:Request,res:Response)=>{
    const payload= req.payload
    const {email,role}= payload
    if(role!= process.env.ADMIN_ID && role!=process.env.USER_ID) return res.status(403).json({status: 'error', message: 'Unauthorized'})
    try {
        const user= await DB('SELECT id,token FROM users WHERE email=$1 AND role=$2', [email,role])
        if(user.rows.length==0) return res.status(403).json({status: 'error', message: 'Unauthorized'})
        const token= {
            accessToken: req.accessToken,
            refreshToken: user.rows[0].token
        }

        const userInfo= {
            id:user.rows[0].id,
            email,
            role: role==process.env.ADMIN_ID? 'admin':
                role==process.env.USER_ID && 'user',
        }
        res.status(200).json({status: 'ok', userInfo, security: token})
    } catch (error) {
        console.log(error)
        res.status(403).json({status: 'error', message: 'Unauthorized'})
    }
}
export default authCheckAccount