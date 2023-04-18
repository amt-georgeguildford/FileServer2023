import { Request,Response } from "express";
import DB from "../db/DB";

const emailList =async (req:Request, res:Response)=>{
    const {file_id}= req.params;
    if(!file_id)return res.status(204).json({status: 'error', message: 'File does not exist'});
    try {
        console.log('file id',file_id)
        const strQuery= `SELECT users.firstname,users.lastname, email_sent.email,email_sent.ts AS time FROM email_sent
        JOIN users ON users.id=email_sent.user_id
        WHERE email_sent.file_id=$1`;
        const file= await DB('SELECT title, description FROM files WHERE id=$1',[file_id])
        const fileDownload= await DB(strQuery,[file_id])
        res.status(200).json({status:'ok',file:file.rows[0], data: fileDownload.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', message:'Something went wrong'})
    }
}
export default emailList