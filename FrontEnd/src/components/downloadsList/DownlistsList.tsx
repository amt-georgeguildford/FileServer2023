import React, { useState,useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import LinkModal from '../modal/LinkModal'
import config from '../../config/config'
import accessSavedToken from '../../utlis/accessSavedToken'
type DownloadList={
    firstname:string,
    lastname:string,
    time:string,
    email:string,

}
const DownlistsList = () => {
    const {id,file_id}= useParams()
    const [loading, setLoading]= useState(true)
    const [file,setFile]= useState({} as {title:string,description:string})
    const [downloadList, setDownloadList]= useState<DownloadList[]>([])

    useEffect(()=>{
        const downloadListFunc= async ()=>{
            setLoading(true)
            const token = accessSavedToken()
            const downloadData= await fetch(`${config.adminDataLink}/${id}/downloads/${file_id}?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`)
            const status=downloadData.status;
            const response = await downloadData.json()
            console.log(response)
            if(status===200){
                const {file,data}= response
                setFile(file)
                setDownloadList(data)
            }
            setLoading(false)
        }
        downloadListFunc()
    },[])
  return (
    <LinkModal backLink={`/dashboard/admin/${id}/records`}>
                <div className="list">
                    <h2>Download List</h2>
                    {
                        loading?
                        (
                            <div style={{display: 'flex', justifyContent:'space-between',alignItems:'center', color:'#01d28e'}}>
                                    <h1 style={{color: 'inherit'}}>Fetch Data...</h1>
                                    <CircularProgress color='inherit' size='2rem'/>
                            </div>
                        ):
                        (
                            <div>
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
                                    downloadList.length>0?
                                    (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sent By</th>
                                                    <th>Downloaded By</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    downloadList.map((data,index)=>
                                                        <tr key={index}>
                                                            <td>{data.firstname} {data.lastname}</td>
                                                            <td>{data.email}</td>
                                                            <td>{data.time}</td>
                                                        </tr>
                                                    )
                                                }
                                                
                                            </tbody>
                                        </table>
                                    ):
                                    (
                                        <h1>No download yet </h1>
                                    )
                                }
                            </div>
                        )
                    }
                    
                </div>
            </LinkModal>
  )
}

export default DownlistsList