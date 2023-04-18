import { Request, Response } from "express";
import DB from "../db/DB";

const getFile= async (req:Request, res:Response)=>{
    const {file_id}= req.params
    try {
        if(!file_id) return res.status(204).json({status: 'error',message: 'Something went wrong'})
        const file= await DB('SELECT * FROM files WHERE id=$1', [file_id])
        // if(file.rows.length==0) return res.status(204).json({status: 'error',message: 'File does not exist'})
        const row= file.rows[0]
        const codedfilename= row.file.match(/[a-zA-Z0-9]+.[a-zA-Z0-9]+$/g)[0]
        console.log(codedfilename)
        const data= {...row, file: codedfilename}
        res.status(200).json({status: 'ok', data:[data]})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'ok', message: 'Something went wrong'})
    }

}
export default getFile