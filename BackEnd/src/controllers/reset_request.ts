import { Request,Response } from "express";
import jwt from 'jsonwebtoken'
import DB from "../db/DB";
import transporter from "../utlis/mailer";
import dotenv from 'dotenv'
import config from "../config/config";
import EmailValidation from "../utlis/EmailValidation";
dotenv.config()
const reset_request= async (req:Request,res:Response)=>{
    const {email} = req.body;
    if(!email) return res.status(400).json({status: 'error', message: 'Email cannot be empty'})
    if(!EmailValidation(email)) return res.status(400).json({status: 'error', message: 'Invalid email'})
    try {
        const confirmUser = await DB('SELECT * FROM users WHERE email=$1', [email])
        if(confirmUser.rows.length==0) return res.status(403).json({status: 'error', message: `Account doesn't exist`});
        const confirmEmail= confirmUser.rows[0].email;
        const confirmRole= confirmUser.rows[0].role;
        const payload= {
            email: confirmEmail,
            role: confirmRole
        }
        console.log('token creation')
        const token = await jwt.sign(payload, process.env.RESET_TOKEN_SECRET!,{expiresIn: '15m'})
        console.log('token created')
        const url=  process.env.NODE_ENV=='prod'? `https://georgeguildfordlizzyplatform.netlify.app/auth/reset/${token}`:
                    `http://${config.app.host}:3000/auth/reset/${token}`
        const resetObj= {
            from: 'Lizzy" <lizzycompany07@gmail.com>',
            to: email,
            subject: 'Reset Password',
            text: `Link: ${url}`,
            html: `<h1 style="color: #01d28e">Request to reset password was successful</h1>
                    <a href='${url}'>Click Here</a><span>&nbsp; to reset your password</span>` 
        }
        const info = await transporter.sendMail(resetObj)
        const savetoken = await DB('INSERT INTO resets(email, token) VALUES($1, $2)', [email, token])
        console.log('email sent')
        res.status(201).json({status: 'ok', message: 'Email Sent'})
       
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', message: 'Server Error'})
    }
}

export default reset_request