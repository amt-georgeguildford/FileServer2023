import { Request,Response } from "express";
import fs from 'fs/promises'
import Mail from "nodemailer/lib/mailer";
import DB from "../db/DB";
import EmailValidation from "../utlis/EmailValidation";
import transporter from "../utlis/mailer";
const sendEmailFile = async (req:Request, res:Response)=>{
    const {file_id,id} = req.params
    const {emails,message}= req.body;
    if(emails.length==0) return res.status(400).json({status: 'error', message: 'Enter email(s)'})
    if(!file_id) return res.status(403).json({status: 'error', message: 'Unauthorized'})
    try {
      console.log(file_id)
      const email=emails[0]
      if(!EmailValidation(email)) return res.status(400).json({status: 'error', message:'Invalid Email'})
      const searchFile= await DB('SELECT * FROM files WHERE id=$1',[file_id])
      if(searchFile.rows.length==0) return res.status(404).json({status:'error', message: 'File not found'}) 
      console.log('Found file')
      const {title,description,filename,file}= searchFile.rows[0];
      const userInfo= req.userInfo
      const downloadURL= process.env.NODE_ENV=='dev'?`http://localhost:5000/download/${id}/${file_id}?email=${email}`:
                        process.env.NODE_ENV== 'prod' && `https://lizzybackend-production.up.railway.app/download/${id}/${file_id}?email=${email}`
      const messageObj:Mail.Options={
        from: 'Lizzy" <lizzycompany07@gmail.com>',
        to: email,
        subject: title,
        html: `<p><strong style="color: #01d28e">Hi,</strong>&nbsp; you are receiving a message from Lizzy on behalf <strong>${userInfo.lastname} ${userInfo.firstname}</strong></p>
              <div>
                <strong>Description:</strong>
                <p>${description}</p>
                ${
                  message && `<strong>Please Note</strong>
                              <p>${message}</p>`

                }
                
                <a 
                href=${downloadURL} 
                style='padding: 20px; color: white; background-color: #01d28e; text-docoration: none; font-size: 16px'>Download File</a>
              </div>
              <p>Find attached, a file for your consideration</p>
        `,
        attachments:[
          {
            filename,
            path:file
          }
        ]

    }
      const send = await transporter.sendMail(messageObj)
      const {rejected}= send
      console.log(rejected)
      if(rejected.length!=0) return res.status(500).json({status:'error', message: 'Something while trying to send email'})
      const saveEmailSent= await DB('INSERT INTO email_sent(file_id,user_id,email,ts)  VALUES($1,$2,$3, NOW())',[file_id,id,email])
      
      res.status(201).json({status:'ok', messsage: 'Email sent'})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', message: 'Something while trying to send email'})
    }
}
export default sendEmailFile