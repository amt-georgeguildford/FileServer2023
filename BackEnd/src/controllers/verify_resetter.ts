import { Request,Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import DB from "../db/DB";
dotenv.config()
const verify_resetter= async (req:Request, res:Response)=>{
    const {token} = req.params;
    if(!token) return res.status(400).json({status: 'error', verify: false,message: 'Unauthorized'})
    try {
        const checkToken= await DB('SELECT * FROM resets WHERE token= $1', [token])
        if(checkToken.rows.length==0) 
        return res.status(409).json({status: 'error', verify: false, message: 'Unauthorized'})
        const payload= <jwt.JwtPayload>await jwt.verify(token, process.env.RESET_TOKEN_SECRET!)
        const userInfo={
            email: payload.email,
            role: payload.role
        }
        res.status(200).json({status: 'ok', verify: true, message: 'verified', userInfo})
    } catch (error) {
        console.log(error)
        res.status(403).json({status: 'error', verify: false, message: 'Session Timeout'})
    }
}

export default verify_resetter