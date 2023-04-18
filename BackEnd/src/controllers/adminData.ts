import { Request, Response } from "express";
import DB from "../db/DB";
import dotenv from 'dotenv'
dotenv.config()

const adminData= async (req:Request, res:Response)=>{
    console.log('AdminData');
    try {
        const strquer=`
        WITH download_num AS(
            SELECT file_id, COUNT(file_id) AS downloads FROM downloads GROUP BY file_id
        ),
        email_sent_num AS(
            SELECT file_id, COUNT(file_id) AS email_sent FROM email_sent GROUP BY file_id
        )
        SELECT files.id, 
            files.title, 
            files.description, 
            files.filename, 
            files.file,
            COALESCE(download_num.downloads,0) AS downloads,
            COALESCE(email_sent_num.email_sent,0) AS email_sent
        FROM files 
        LEFT JOIN download_num 
        ON download_num.file_id=files.id
        LEFT JOIN email_sent_num
        ON email_sent_num.file_id=files.id;
        `; 
        const dat= await DB(strquer, [])
        const token= {
            accessToken:req.accessToken,
            refreshToken:req.query.refreshToken
        }
        res.status(200).json({status: 'ok',userInfo: req.userInfo,security: token, data: dat.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Something went wrong...'})
    }
}
export default adminData