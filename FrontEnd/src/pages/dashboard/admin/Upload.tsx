import { CircularProgress } from '@mui/material'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import config from '../../../config/config'
import { accountType, context } from '../../../context/ContextProvider'
import accessSavedToken from '../../../utlis/accessSavedToken'
import removeSaveToken from '../../../utlis/removeSaveToken'
import saveToken from '../../../utlis/saveToken'
import Admin from '../Admin'

const Upload = () => {
    const [file, setFile] = useState <File | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading]= useState(true)
    const [user, setUser]= useState('')
    const [usersData,setUsersData]= useState<{id:string,firstname:string,lastname:string}[]>([])
    const [uploading, setUploading]= useState(false)
    
    const emptyFile= useRef<HTMLInputElement>(null)

    const {setVerified,setVerifiedUser,setAcct}= useContext(context)
    
    const {id}= useParams()
    const navigate= useNavigate()
    const handleSubmit= (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setUploading(true)
        if(user.length==0){
            setUploading(false)
            alert('Select a user before uploading file')
        }
        else{
            let formData= new FormData()
            console.log(description)
            formData.append('title',title);
            formData.append('description',description)
            formData.append('file', file!)
            formData.append('targetId', user)
            const uploadFileFunc= async ()=>{
                const token= accessSavedToken()
                const uploadFile= await fetch(`${config.adminDataLink}/${id}/dataEntry?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`,{
                    method: 'POST',
                    body: formData
                })
                const response = await uploadFile.json()
                const status= uploadFile.status
                setUploading(false)
                if(status==201){
                    alert('Upload Successful')
                    setTitle('')
                    setDescription('')
                    setFile(null)
                    setUser('')
                    if(emptyFile.current != null){
                        emptyFile.current.value= ''
                    }
                }
                else{
                    alert(response.message)
                }
                
                
            }
            uploadFileFunc()
            
        }
    }

    useEffect(()=>{
        const getUser= async ()=>{
            setLoading(true)
            const token= accessSavedToken()
            const userData= await fetch(`${config.adminDataLink}/${id}/users?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`)
            const status= userData.status;
            const response = await userData.json()
            console.log(response)
            if(status==200){
                const {userInfo,security,data}= response
                setVerifiedUser(userInfo.firstname)
                saveToken(security)
                setUsersData(data)
                setLoading(false)
            }
            else if(status== 500){

            }
            else{
                removeSaveToken()
                setVerified(true)
                setAcct({} as accountType)
                navigate('/auth/login')
            }
        }
        getUser()
    },[])
  return (
    <Admin>
        <div className="view">
            <span className="page-view">UPLOAD</span>
            <span className="active-page">Files</span>
        </div>
        {
            loading?
            (
                <div style={{display: 'flex', justifyContent:'space-between',alignItems:'center', color:'#01d28e'}}>
                    <h1 style={{color: 'inherit'}}>Fetch Data...</h1>
                    <CircularProgress color='inherit' size='2rem'/>
                </div>
            ):
            !loading && usersData.length>0?
            (
                <>
                    <div className="upload-content">
                        <form action="" encType="multipart/form" onSubmit={handleSubmit}>
                            <div className="file-select">
                                <input type="file" name="file" id="file" ref={emptyFile} onChange={({target})=>setFile(target.files![0])} accept='.svg, .png, .jpeg, .jpg, .webp, .pdf, .doc, .docx, .ppt, .pptx, .txt, .xls, .xlsx'/>
                                <div className="file-upload-info">
                                    <span className='icon'><FaCloudUploadAlt /></span>
                                    <p>Select a file to upload</p>
                                    <small>or drag and drop it here</small>
                                </div>
                            </div>
                            <div className="file-upload-content">
                                <div className="input-wrapper">
                                    <label htmlFor="title">Title</label><br />
                                    <input type="text" id= 'title' value={title} onChange={({target})=>setTitle(target.value)}/>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="description">Description</label>
                                    <div className="textarea">
                                        <textarea name="" id="description" cols={30} rows={5} placeholder= 'Describe the file' onChange={({target})=>setDescription(target.value)} value={description}></textarea>
                                    </div>
                                </div>
                                <div className="file-flex">
                                    <div>
                                        <button className="btn green-btn submit-btn">{uploading?<CircularProgress size='14px' color= 'inherit'/>:'Submit'}</button>
                                    </div>
                                    <div>
                                        <select name="" id="" onChange={({target})=>setUser(target.value)} value={user}>
                                            <option value="">Users</option>
                                            {
                                                usersData.map((data,index)=>(
                                                    <option value={data.id} key={index}>{data.firstname} {data.lastname}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            ):
            (
                <h1>No user available...</h1>
            )
        }
        
    </Admin>
  )
}

export default Upload