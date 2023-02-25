import React, { useEffect, useContext, useState } from 'react'
import Admin from '../Admin'
import { AiOutlineFile } from 'react-icons/ai'
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom'
import { context } from '../../../context/ContextProvider'
import config from '../../../config/config'
import accessSavedToken from '../../../utlis/accessSavedToken'
import saveToken from '../../../utlis/saveToken'
import removeSaveToken from '../../../utlis/removeSaveToken'
import { CircularProgress } from '@mui/material'

type AccountData={
    id: string,
    title: string,
    description: string,
    file: string,
    filename: string,
    downloads: string,
    email_sent: string,
}
const Records = () => {
    const [loading, setLoading]= useState(true)
    const [accountData, setAccount] = useState([] as AccountData[])
    const {setAcct, setVerifiedUser, setVerified}= useContext(context)
    const {id} = useParams();
    const navigate= useNavigate()
    useEffect(()=>{
        const fetchDataFunc= async ()=>{
            setLoading(true)
            const result= accessSavedToken()
            const fetchData= await fetch(`${config.adminDataLink}/${id}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`)
            const status= fetchData.status
            if(status== 200){
                const response= await fetchData.json();
                const {security,data,userInfo}= response
                saveToken(security)
                setVerifiedUser(userInfo.firstname)
                setAccount(data)
                setLoading(false)
                console.log(data)
            }
            else if(status==500){
                console.log('Something went wrong...')
            }
            else{
                removeSaveToken()
                setVerified(true)
                navigate('/auth/login')
            }
            
        }
        fetchDataFunc()

    },[])
  return (
    <>
        
        <Admin>
            <div className="view">
                <span className="page-view">RECORDS</span>
                <span className="active-page">Files</span>
            </div>
            <div className="table">
                {
                    loading?
                    (
                        <div style={{display: 'flex', justifyContent:'space-between',alignItems:'center', color:'#01d28e'}}>
                            <h1 style={{color: 'inherit'}}>Fetch Data...</h1>
                            <CircularProgress color='inherit' size='2rem'/>

                        </div>
                    ):
                    !loading && accountData.length!==0? 
                        (
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Downloads</th>
                                        <th>Emails Sent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        accountData.map((data,index)=>(
                                            <tr key={index}>
                                                <td>
                                                    <span className="icon"><AiOutlineFile /></span>
                                                </td>
                                                <td>{data.title}</td>
                                                <td>{data.description}</td>
                                                <td className='downloads'>{data.downloads=="0"? "0":<Link to={`/dashboard/admin/${id}/records/download_List/${data.id}`}>{data.downloads}</Link>}</td>
                                                <td className='email'>{data.email_sent=="0"?"0":<Link to={`/dashboard/admin/${id}/records/email_List/${data.id}`}>{data.email_sent}</Link>}</td>
                                            </tr>
                                        ))
                                    }
                                    

                            
                                </tbody>
                            </table>
                        ):
                        (
                            <h1>No Data Found....</h1>
                        )
                }
            </div>
        </Admin>
        <Outlet />
    </>
  )
}

export default Records