import { Request,Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import DB from "../db/DB";
import dotenv from 'dotenv'
 dotenv.config

const refreshToken = async (req:Request,res:Response,next:NextFunction)=>{
    console.log('refresh Token');
    
    const {refreshToken} = req.query;
    if(req.payload) return next();

    if(!refreshToken) return res.status(403).json({status:'error', message: 'Unauthorized'})
    try {
        const checkTokenSaved= await DB('SELECT * FROM users WHERE token= $1', [refreshToken])
        if(checkTokenSaved.rows.length==0) return res.status(403).json({status: 'error', message: 'Unauthorized'})
        const verifiedRefreshToken = <jwt.JwtPayload>await jwt.verify(refreshToken as string,process.env.REFRESH_TOKEN_SECRET!)
        const {email,role}= verifiedRefreshToken
        const newAccessToken= await jwt.sign({email,role},process.env.ACCESS_TOKEN_SECRET!, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION!})
        req.payload=verifiedRefreshToken
        req.accessToken= newAccessToken
        next()
    } catch (error) {
        console.log('error')
        res.status(403).json({status: 'error', message: 'Unauthorized'})
    }
}

export default refreshToken