import { CircularProgress } from '@mui/material'
import React, { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import config from '../../config/config'
import accessSavedToken from '../../utlis/accessSavedToken'
import LinkModal from '../modal/LinkModal'
import { HiOutlineDocument } from 'react-icons/hi'
import path from 'path'

const SendMail = () => {
    const [sending, setSending]= useState(false)
    const [message, setMessage] = useState('')
    const [emails, setEmails] = useState('')
    const navigate =useNavigate()
    const {id,file_id}= useParams()
    const [loading, setLoading]= useState(true)
    const [file, setFile]= useState({} as {id:string, file:string, filename: string, fileType: 'image'|'document'})
    const handleSubmit= (e:React.FormEvent<HTMLFormElement>)=>{
        const token = accessSavedToken()
        const sentEmailFunc= async()=>{
            const sentEmail= await fetch(`${config.userDataLink}/${id}/mails/${file_id}?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message,emails: [emails]})
            })
            const status= sentEmail.status
            const response= await sentEmail.json()
            console.log(response)
            if(status== 201){
                navigate(`/dashboard/users/${id}`)
            }
            
        }
        sentEmailFunc()
    }

    useEffect(()=>{
        const fileDataFunc= async ()=>{
            setLoading(true)
            const token = accessSavedToken()
            const fileData= await fetch(`${config.userDataLink}/${id}/files/${file_id}?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`)
            const status= fileData.status;
            const response = await fileData.json()
            console.log(response)
            if(status==200){
                const imageExts= ['.png','.jpeg','.jpg','.webp']
                const documentExts= ['.pdf','.doc','.docx','.ppt','.pptx','.txt','.xls','.xlsx']
                const fileDetail= response.data[0];
                const ext= fileDetail.filename.match(/.[a-zA-Z0-9]+$/g)[0]
                if(documentExts.includes(ext)){
                    const dat= {...fileDetail, fileType:'document'}
                    setFile(dat)
                }
                else if(imageExts.includes(ext)){
                    const dat= {...fileDetail, fileType:'image'}
                    setFile(dat)
                }
                setLoading(false)
            }
           
        }
        fileDataFunc()
    },[])
  return (
    <>
        {
            !loading &&
            (
                <LinkModal backLink={`/dashboard/users/${id}`}>
                    <div className="mail-content">
                    <div>
                        <div className="file-preview">
                            {
                                file.fileType=='document'? 
                                <div>
                                    <span className="icon"><HiOutlineDocument /></span>
                                </div>:
                                file.fileType=='image' &&
                                <img src={`${config.origin}/${file.file}`} alt="" />
                            }
                            
                        </div>
                    </div>
                    <div className="mail-entry">
                        <form action="" onSubmit={handleSubmit}>
                        <label htmlFor="email-collection">To:</label>
                        <div className="textarea">
                            <textarea name="" id="email-collection" cols={30} rows={5} onChange={({target})=>setEmails(target.value)} value={emails}></textarea>
                        </div>
                            <label htmlFor="message">Additional message (optional): </label>
                        <div className="textarea">
                            <textarea name="" id="message" cols={30} rows={5} onChange={({target})=>setMessage(target.value)} value={message}></textarea>
                        </div>

                        <div className="button-group">
                            <span className="btn close-btn" onClick={()=>{setMessage(''); setEmails(''); navigate(`/dashboard/users/${id}`)}}>Close</span>
                            <button className="btn send-mail-btn" disabled={sending}>{ sending? <CircularProgress color='inherit' size='10px'/>:'Send'}</button>
                        </div>
                        </form>
                    </div>
                    </div>
                </LinkModal>
            )
        }
        
    </>
  )
}

export default SendMail