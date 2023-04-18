import { Request,Response } from "express";
import DB from "../db/DB";
import dotenv from 'dotenv'
dotenv.config()

const getAdminUsers= async (req:Request, res:Response)=>{
    try {
        const userId =process.env.USER_ID
        const users= await DB('SELECT id, firstname, lastname FROM users WHERE role= $1 ORDER BY firstname, lastname, id',[userId])
        const userInfo= req.userInfo;
        const security= {
            accessToken: req.accessToken,
            refreshToken: req.query.refreshToken
        }
        res.status(200).json({status:'ok', userInfo,security, data: users.rows})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message:'Internal Server Error'})
    }
}
export default getAdminUsers