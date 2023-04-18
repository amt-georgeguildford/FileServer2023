import { Request, Response } from "express";
import config from "../config/config";
import DB from "../db/DB";
import dotenv from 'dotenv'
dotenv.config()


const newFileData= async (req:Request, res:Response)=>{
    const file= req.file
    
    const {email,role}= req.payload!
    const {description,title,targetId}= req.body;

    if(!file) return res.status(400).json({status: 'error', message:'Error: Select a file...'})
    if(!description || !title ||!targetId){
        let str: string[] | undefined=[]
        if(!email) str.push('email')
        if(!description) str.push('description')
        if(!title) str.push('firstname')
        if(!targetId) str.push('lastname')
        let ArrStr= ""
        ArrStr= str.join(", ")
        if(str.length>1){
            ArrStr= ArrStr.replace(/(, )(\w+)$/, " and $2")
        }
        
        return res.status(400).json({status: 'error', message:`${ArrStr} can not be empty`})
    }
    if(role !=process.env.ADMIN_ID) return res.status(403).json({status: 'error', message: 'Unauthorized'})
    const fileURL= file.path
    const filename= title.toLowerCase()+file.originalname.match(/\.([a-zA-Z0-9]+)$/)![0]
    try { 
        const fileEntry= await DB('INSERT INTO files(title,description,filename,file,user_id) VALUES($1,$2,$3,$4,$5)',[title,description,filename,fileURL,targetId]);
        if(fileEntry.rowCount==0) return res.status(400).json({status: 'error', message: 'No content'})
        res.status(201).json({status: 'ok'})

    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Internal Server Error'})
    }
}

export default newFileData