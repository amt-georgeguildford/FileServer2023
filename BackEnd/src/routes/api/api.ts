import express,{ Request, Response } from "express";
import newFileData from "../../controllers/newFileData";
import refreshToken from "../../middleWares/RefreshToken";
import verifyToken from "../../middleWares/VerifyToken";
import multer from "multer";
import adminData from "../../controllers/adminData";
import downloadList from "../../controllers/downloadList";
import emailList from "../../controllers/emailList";
import verifyAccount from "../../middleWares/verifyAccount";
import userData from "../../controllers/userData";
import sendEmailFile from "../../controllers/sendEmailFile";
import searchFile from "../../controllers/searchFile";
import getAdminUsers from "../../controllers/getAdminUsers";

import path from 'path'
import crypto from 'crypto'
import getFile from "../../controllers/getFile";

const storage= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/')
    },
    filename: (req,file,cb)=>{
        cb(null,crypto.pseudoRandomBytes(16).toString('hex')+path.extname(file.originalname))
    }
})
const upload= multer({
    storage,
    limits: {
        fileSize: 5 * 1024 *1024
    },
    fileFilter: (req,file,cd)=>{
        const ext =/png|jpeg|jpg|webp|pdf|doc|docx|ppt|pptx|txt|xls|xlsx/
        const filename= file.originalname
        if(ext.test(path.extname(filename))) cd(null, true)
        else cd(Error('Invalid File'))
    }
})


const api= express.Router();
// 
api.use(verifyToken,refreshToken)
// api.get('/verify/:id', verifyAccount)
api.use('/admin/:id',verifyAccount)

api.get('/admin/:id', adminData)
api.get('/admin/:id/downloads/:file_id',downloadList)
api.get('/admin/:id/emails/:file_id',emailList)
api.post('/admin/:id/dataEntry', upload.single('file'), newFileData)
api.get('/admin/:id/users', getAdminUsers)
api.get('/admin/:id/files/:file_id', getFile)

api.use('/users/:id',verifyAccount)

api.get('/users/:id', userData)
api.get('/users/:id/search', searchFile)
api.post('/users/:id/mails/:file_id', sendEmailFile)
api.get('/users/:id/files/:file_id', getFile)

export default api