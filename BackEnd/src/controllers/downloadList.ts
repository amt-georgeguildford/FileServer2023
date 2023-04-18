import { Request,Response } from "express";
import DB from "../db/DB";

const downloadList =async (req:Request, res:Response)=>{
    const {file_id}= req.params;
    if(!file_id)return res.status(204).json({status: 'error', message: 'File does not exist'});
    try {
        const strQuery= `SELECT users.firstname,users.lastname, downloads.email,downloads.ts AS time FROM downloads
        JOIN users ON users.id=downloads.user_id
        WHERE downloads.file_id=$1`;
        const file=  await DB('SELECT title, description FROM files WHERE id=$1',[file_id])
        const fileDownload= await DB(strQuery,[file_id])
        if(fileDownload.rowCount==0)return res.status(204).json({status: 'error', message: 'File does not exist'})
        res.status(200).json({status:'ok', file: file.rows[0],data: fileDownload.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Something went wrong'})
    }
}
export default downloadList