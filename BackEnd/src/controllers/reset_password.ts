import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import DB from "../db/DB";
dotenv.config()
const reset_password= async (req:Request, res:Response)=>{
    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;
    
    try {
        const checkToken= await DB('SELECT * FROM resets WHERE token= $1', [token])
        if(checkToken.rows.length==0) 
        return res.status(409).json({status: 'error', verify: false, message: 'Session has already been used'})
        const payload= await jwt.verify(token,process.env.RESET_TOKEN_SECRET!)
        const {email,role} = payload as jwt.JwtPayload
        if(!newPassword || !confirmPassword){
            const str= !newPassword && !confirmPassword? "New Password and Confirm Password":
                        !newPassword? "New Password":
                        !confirmPassword? "Confirm Password":"";
            return res.status(400).json({status: 'error', message: `${str} cannot be empty...`})
        }

        if(newPassword!=confirmPassword)return res.status(400).json({status: 'error', message: 'New Password and Confirm Password must the match'})
        const hashPassword= await bcrypt.hash(newPassword, 10)
        const savePassword= await DB('UPDATE users SET password= $1 WHERE email= $2 AND role= $3 RETURNING id', [hashPassword, email, role])
        if(savePassword.rowCount==0) return res.status(500).json({status: 'error', message: 'Something wrong trying to change password'})
        const deleteReset= await DB('DELETE FROM resets WHERE token= $1',[token])
        res.status(201).json({status: 'ok', id: savePassword.rows[0].id})
    } catch (error) {
        console.log(error)
        res.status(403).json({status:'error', message: 'Session Timeout'})
    }

}
export default reset_password