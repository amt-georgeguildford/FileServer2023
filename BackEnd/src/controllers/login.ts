import { Request, Response } from "express"
import bcrypt from "bcrypt"
import DB from "../db/DB";
import EmailValidation from "../utlis/EmailValidation";
import GenerateToken from "../utlis/GenerateToken";
const Login= async (req:Request, res:Response)=>{
    const {email, password} = req.body

    if(!email || !password){
        let str= !email && !password? 'Email and Password':
                 !email? 'Email':'Password';
        return res.status(400).json({status: 'error', message:str +' can not be empty'})
    }

    try {
        if(!EmailValidation(email)) return res.status(400).json({status: 'error', message: 'Invalid email'})

        const foundUser =await DB('SELECT * FROM users WHERE email= $1',[email])
        if(foundUser.rows.length==0) return res.status(401).json({status:'error', message: `Account doesn't exist`})
        const {id,role}= foundUser.rows[0]

        const verifiedPassword= await bcrypt.compare(password,foundUser.rows[0].password)
        if(!verifiedPassword) return res.status(401).json({status:'error', message: `Password doesn't match`})
        const token= await GenerateToken({email,role});
        const saveToken= await DB('UPDATE users SET token= $1 WHERE id= $2', [token.refreshToken, id])

        if(saveToken.rowCount==0) return res.status(500).json({status:'error',message:'Something went wrong while trying to login'})
        const roleText= role==process.env.USER_ID!? 'user': 
                        role==process.env.ADMIN_ID!? 'admin': '';
        console.log(roleText)
        res.status(201).json({status: 'ok', data:{ token, account:{id, role: roleText}}}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', message:'Something went wrong while trying to login'})
    }
}

export default Login