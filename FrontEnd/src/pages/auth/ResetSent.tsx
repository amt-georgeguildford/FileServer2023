import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsCheck} from 'react-icons/bs'
import { FaUserAlt} from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorPage from '../../components/errorPage/ErrorPage'
import config from '../../config/config'
const ResetSent = () => {
    const {token} = useParams()
    const navigate= useNavigate()
    const [loading,setLoading]= useState(false)
    const [serverStatus, setServerStatus]= useState(0)
    const [user, setUser] = useState('')
    const [showPassword, setShowPassword]= useState(false)
    const [confirmPassword,setConfirmPasssword]= useState("")
    const [password,setPassword]= useState("")
    const [verifyToken, setVerifyToken]= useState(false)
    const [errorMessage, setErrorMessage]= useState('')
    const [sessionError, setSessionError]= useState('')

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      setLoading(true)
      const resetPasswordFunc= async ()=>{
        console.log({password, confirmPassword})
            const resetPassword= await fetch(`${config.verifyResetToken}/${token}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newPassword: password, confirmPassword: confirmPassword})
            })
            const status= resetPassword.status;
            const response= await resetPassword.json()
            console.log(response)
            if(status==201){
                const {id}= response
                setLoading(false)
                navigate(`/auth/reset/confirm/${id}`)
            }
            else if(status==403 || status==500 || status== 409){
                setVerifyToken(false)
                setSessionError(response.message)
                setServerStatus(status)
                setLoading(false)
                setErrorMessage('')
            }
            else{
                setLoading(false)
                setErrorMessage(response.message)
            }
      }
      resetPasswordFunc()
  }
  useEffect(()=>{
    const verifyTokenFunc = async ()=>{
        const verifyTokenData= await fetch(`${config.verifyResetToken}/${token}`)
        const status= verifyTokenData.status;
        const response= await verifyTokenData.json()
        if(status==200){
            console.log(response)
            setUser(response.userInfo.email)
            setVerifyToken(true)
        }
        else{
           setSessionError(response.message)
            setServerStatus(status)
        }

    }
    verifyTokenFunc()
  },[])
return (
    <>
        {
            verifyToken &&
                (
                    <>
                        <section className="auth login">
                            <div className="container">
                                <div className="top-content">
                                    <div className="brand-logo">
                                        <img src="/Assets/Brand_logo.png" alt="" />
                                    </div>
                                    <div className="confirmed-account">
                                        <div>
                                            <span className="icon user-icon"><FaUserAlt /> </span>
                                            <span className="confirmed-account-email">{user}</span>
                                            </div>
                                            <span className="icon check"><BsCheck /> </span>
                                        </div>
                                    <p className='auth-desc'>Enter new password and confirm below</p>
                                </div>
                                
                                <div className={errorMessage? "error-message show-error" : "error-message"}>
                                    <p>{errorMessage && errorMessage}</p>
                                </div>
                                <form action="" onSubmit={handleSubmit}>
                                    <div className="input-wrapper">
                                        <input type={showPassword? "text":"password"} name="email" value={password} onChange={({target})=>setPassword(target.value)} placeholder='Password'/>
                                    </div>
                                    <div className="input-wrapper input-flex">
                                        <input type={showPassword? "text":"password"} name="confirm_password" value={confirmPassword} onChange={({target})=>setConfirmPasssword(target.value)} placeholder='Confirm Password'/>
                                    </div>
                                    <button type="submit" className="btn green-btn submit-btn" disabled={loading}>{loading?<CircularProgress color='inherit' size= '20px'/>:'Reset Password'}</button>
                                </form>
                                <div className="auth-footer">
                                    <div className="remember-flex">
                                        <div className='remember-me'>
                                            
                                            <label htmlFor="remember-me">
                                                    Show Password
                                                    <input type="checkbox" name="" id="remember-me" checked={showPassword} onChange ={()=>setShowPassword(!showPassword)}/>
                                                    <span className="checkbox-background"></span>        
                                            </label>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </section>
                    </>
                )
        }
        {
            (!verifyToken && (serverStatus== 403 || serverStatus== 409)) &&
                (
                    <ErrorPage serverError={sessionError}>
                            <div className="auth-footer">
                            <div className='reverse-page-link'>
                                <Link to='/auth/reset'>Try again</Link>
                            </div>
                            </div>
                    </ErrorPage>
                )    
        }
        {
            (!verifyToken && (serverStatus== 500)) && <ErrorPage serverError={sessionError}/>    
        }
    </>   
    
)
}

export default ResetSent