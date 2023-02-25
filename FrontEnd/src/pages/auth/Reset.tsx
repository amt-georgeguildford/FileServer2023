import { CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorPage from '../../components/errorPage/ErrorPage'
import config from '../../config/config'

const Reset = () => {
  const [email,setEmail]= useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [serverError, setServerError]=useState('')
  const navigate= useNavigate()
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      setLoading(true)
      const resetPasswordRequestFunc= async ()=>{
        const requestReset= await fetch(config.resetPasswordRequest,{
            method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({email})
        })
        const status= requestReset.status
        const response= await requestReset.json()
        setLoading(false)
        if(status==201){
            navigate(`./confirmation/${email}`)
        }
        else if(status==500){
            // work on it 
            setErrorMessage('')
            setServerError(response.message)
        }
        else {
            setServerError('')
            setErrorMessage(response.message)
        }
        
       
      }
      resetPasswordRequestFunc()
  }
return (
    <>
    <section className="auth login">
        <div className="container">
            <div className="top-content">
                <div className="brand-logo">
                    <img src="/Assets/Brand_logo.png" alt="" />
                </div>
                <p className='auth-desc'>Enter your email to reset password</p>
            </div>
            <div className={errorMessage? "error-message show-error" : "error-message"}>
                <p>{errorMessage}</p>
            </div>
            <form action="" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" name="email" value={email} onChange={({target})=>setEmail(target.value)} placeholder='Email'/>
                </div>
                <button type="submit" className="btn green-btn submit-btn" disabled={loading}>{loading?<CircularProgress color='inherit' size='20px'/>:'Submit'}</button>
            </form>
            <div className="auth-footer">
                <p className='reverse-page-question'>Don't have an account</p>
                <div className='reverse-page-link'>
                    <Link to='/auth/register'>Sign Up</Link>
                </div>
            </div>
        </div>
    </section>
    {
        serverError && <ErrorPage serverError={serverError}/>
    }
    </>
)
}

export default Reset