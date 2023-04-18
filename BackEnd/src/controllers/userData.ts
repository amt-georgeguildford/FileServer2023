import { Request, Response } from "express"
import DB from "../db/DB"

const userData = async (req:Request, res:Response)=>{
   const {id}= req.params
   try {
    const data= await DB('SELECT * FROM files WHERE user_id=$1',[id])
      const token= {
         accessToken: req.accessToken,
         refreshToken: req.query.refreshToken
      }
    res.status(200).json({status: 'ok',userInfo: req.userInfo, security: token,data: data.rows})
   } catch (error) {
    res.status(500).json({error: 'error', message: 'Internal Server Error'})
   }

}

export default userData