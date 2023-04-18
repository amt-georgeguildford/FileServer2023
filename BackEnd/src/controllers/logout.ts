import { Request,Response } from "express";
import DB from "../db/DB";

const logout= async (req:Request, res:Response)=>{
    const {id} = req.params;
    if(!id) return res.status(400).json({status: 'error', message: ''})
    try {
        console.log(id)
        const user = await DB('UPDATE users SET token= NULL WHERE id= $1 AND token IS NOT NULL', [id])
        console.log(user)
        if(user.rowCount==0) return res.status(403).json({status: 'error', message: 'Unauthorized'})
        res.status(201).json({status: 'ok', message: 'Sign Out'})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Something went while trying to sign out'})
    }
}

export default logout