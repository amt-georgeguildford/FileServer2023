import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken= async (req:Request,res:Response, next:NextFunction)=>{
    console.log('verifyToken');
    req.payload= undefined
    const {accessToken}= req.query;
    if(!accessToken)return res.status(403).json({status: 'error', messsage: 'Unauthorize first'})
    try {
        const verifiedAccessToken= await jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET!)
        req.payload= verifiedAccessToken as jwt.JwtPayload
        req.accessToken= accessToken as string
        next()
    } catch (error) {
        console.log(error)
        req.payload=undefined
        next()
    }
}

export default verifyToken