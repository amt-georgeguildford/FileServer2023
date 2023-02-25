import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '../../config/config'
import accessSavedToken from '../../utlis/accessSavedToken'
import LinkModal from '../modal/LinkModal'
type EmailsSent={
    firstname: string,
    lastname:string,
    email: string,
    time: string
}
const EmailsSent = () => {
    const {id,file_id}=useParams()
    const [loading,setLoading]= useState(true)
    const [emailSent, setEmailSent]= useState([] as EmailsSent[])
    const [file,setFile]= useState({} as {title:string, description:string})
    useEffect(()=>{
        const fileDataFunc= async()=>{
            const token= accessSavedToken()
            setLoading(true)
            const fileData= await fetch(`${config.adminDataLink}/${id}/emails/${file_id}?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`)
            const status=fileData.status
            const response= await fileData.json()
            console.log(response)
            if(status==200){
                setFile(response.file)
                setEmailSent(response.data)
            }
            setLoading(false)
        }
        fileDataFunc()
    },[])
    return (
        <>
            <LinkModal backLink={`/dashboard/admin/${id}/records`}>
                <div className="list">
                    <h2>Emails Sent</h2>
                    <div>
                        {
                            loading?
                            (
                                <div style={{display: 'flex', justifyContent:'space-between',alignItems:'center', color:'#01d28e'}}>
                                    <h1 style={{color: 'inherit'}}>Fetch Data...</h1>
                                    <CircularProgress color='inherit' size='2rem'/>
                                </div>
                            ):
                             
                                (
                                    <>
                                        <table className='file-detail'>
                                            <tbody>
                                                <tr>
                                                    <th>Title:</th>
                                                    <td>{file.title}</td>
                                                </tr>
                                                <tr>
                                                    <th>Description: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                                    <td>{file.description}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {
                                            emailSent.length>0?
                                            (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Sent By</th>
                                                            <th>To</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            emailSent.map((data,index)=>(
                                                                <tr key={index}>
                                                                    <td>{data.firstname} {data.lastname}</td>
                                                                    <td>{data.email}</td>
                                                                    <td>{data.time}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            ):
                                            (
                                                <h1>File not sent yet </h1>
                                            )
                                        }
                                        
                                    </>
                                )
                                

                        }
                    </div>
                </div>
            </LinkModal>
        </>
      )
}

export default EmailsSent