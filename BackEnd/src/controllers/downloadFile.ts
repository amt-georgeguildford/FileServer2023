import { Request,Response } from "express";
import DB from "../db/DB";

const downloadFile= async(req:Request, res:Response)=>{
    const {id, file_id}= req.params;
    const {email}= req.query
    if(!id || !file_id)res.status(400).json({status: 'error', message: 'Unauthorize'})
    if(!email)res.status(400).json({status: 'error', message: 'Unauthorize'})
    try {
        const str= `SELECT files.file AS link, files.filename FROM email_sent
        JOIN files 
        ON email_sent.file_id=id
        WHERE  email_sent.user_id=$1 AND email_sent.file_id= $2 
        LIMIT 1;`
        console.log('here')
        const auth= await DB(str, [id,file_id])
        if(auth.rows.length==0) return res.status(400).json({status: 'error', message: 'Unauthorize'})
        res.download(auth.rows[0].link,auth.rows[0].filename)
        const saveDownload= await DB('INSERT INTO downloads(file_id,user_id,email,ts) VALUES($1,$2,$3, NOW())',[file_id,id,email])
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Something went wrong'})
    }
}
export default downloadFile