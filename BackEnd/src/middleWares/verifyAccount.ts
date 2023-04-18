import { Request,Response,NextFunction } from "express";
import DB from "../db/DB";

const verifyAccount=async (req:Request,res:Response,next:NextFunction)=>{
    console.log('verifyAccount');
    
    const {id}= req.params
    const {email,role}= req.payload;
    if(!id)return res.status(403).json({status: 'error', message: 'Unauthorized'})
    if(role!= process.env.ADMIN_ID && role!=process.env.USER_ID) return res.status(403).json({status: 'error', message: 'Unauthorized'})
    try {
        const foundAdmin= await DB('SELECT * FROM users WHERE id= $1 AND email= $2 AND role= $3',[id,email,role])
        if(foundAdmin.rowCount==0) return res.status(403).json({status: 'error', message: 'Unauthorized'})
        const user= foundAdmin.rows[0]
        req.userInfo={
            id,
            email,
            role:role==process.env.ADMIN_ID? 'admin': role==process.env.USER_ID? 'user': '',
            firstname: user.firstname,
            lastname: user.lastname
        }
        next()
    } catch (error) {
        res.status(403).json({status: 'error', message: 'Unauthorized'})
    }
}
export default verifyAccount