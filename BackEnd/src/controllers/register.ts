import { Request, Response } from "express"
import DB from "../db/DB";
import EmailValidation from "../utlis/EmailValidation";
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import GenerateToken from "../utlis/GenerateToken";

const Register= async (req:Request,res:Response)=>{
    const {firstname, lastname,email, password,confirmPassword} = req.body

    if(!email || !password || !firstname || !lastname){
        let str: string[] | undefined=[]
        if(!email) str.push('email')
        if(!password) str.push('password')
        if(!firstname) str.push('firstname')
        if(!lastname) str.push('lastname')
        let ArrStr= ""
        ArrStr= str.join(", ")
        if(str.length>1){
            ArrStr= ArrStr.replace(/(, )(\w+)$/, " and $2")
        }
        
        return res.status(400).json({status: 'error', message:`${ArrStr} can not be empty`})
    }
    if(password!=confirmPassword) return res.status(400).json({status: 'error', message:`Password and Confirmed Password must match`})
    try {
        const role= process.env.USER_ID!;
        if(!EmailValidation(email)) return res.status(400).json({status: 'error', message: 'Invalid email'})
        console.log('Email verified')
        // All input verified
        const foundUser= await DB('SELECT * FROM users WHERE email= $1', [email])
        if(foundUser.rows.length!=0)return res.status(403).json({status: 'error', message: 'Account already exist...'})
        
        const hashPassword= await bcrypt.hash(password,10)
        const token = await GenerateToken({email,role})
        
        const register= await DB('INSERT INTO users(firstname,lastname,email,password,role,token) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, role',[firstname,lastname,email,hashPassword,role,token.refreshToken])
        console.log('Account Created')
        if(register.rows.length==0) return res.status(500).json({status:'error', message:'Something went wrong while trying to create your account'})
        const account= {
            id:register.rows[0].id,
            role: register.rows[0].role==process.env.USER_ID? 'user': ''
        }
        res.status(201).json({status: 'ok',data: {token,account}})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Something went wrong while trying to create your account'})
    }


}

export default Register