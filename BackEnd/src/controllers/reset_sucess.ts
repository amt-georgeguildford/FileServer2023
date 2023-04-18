import { Request, Response } from "express";
import DB from "../db/DB";
import dotenv from 'dotenv'
dotenv.config
const reset_success= async(req:Request, res:Response)=>{
    const {id}= req.params
    if(!id) return res.status(400).json({status: 'ok', verified: false, message: 'Unauthorized'})
    try {
        const foundUser= await DB('SELECT firstname,lastname,id,role, email FROM users WHERE id= $1', [id])
        if(foundUser.rows.length==0) 
        return res.status(409).json({status: 'error', verify: false, message: 'Unauthorized'})
        const userInfo={
            id: foundUser.rows[0].id,
            firstname: foundUser.rows[0].firstname,
            lastname: foundUser.rows[0].lastname,
            email: foundUser.rows[0].email,
            role: foundUser.rows[0].role==process.env.ADMIN_ID? 'admin':
            foundUser.rows[0].role==process.env.USER_ID? 'user': ''
        }
        res.status(200).json({status:'ok', verify:true, userInfo})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', verify: false, message: 'Internal Server Error'})
    }
}

export default reset_success