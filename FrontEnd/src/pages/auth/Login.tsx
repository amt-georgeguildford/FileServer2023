import React, { useState, useEffect, useContext } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { ImEye, ImEyeBlocked} from 'react-icons/im'
import config from '../../config/config'
import saveToken from '../../utlis/saveToken'
import { context } from '../../context/ContextProvider'
import ProgressButton from '../../components/progressButton/ProgressButton'
import { CircularProgress } from '@mui/material'
import ErrorPage from '../../components/errorPage/ErrorPage'
const Login = () => {
    const [showPassword, setShowPassword]= useState(false)
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [remember, setRemember]= useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const [isLoading, setIsLoading]= useState(false)
    const navigate=useNavigate()
    const [serverError, setServerError]= useState('')
    const {acct,setAcct,verified}= useContext(context)
    
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const loginFunc =async ()=>{
            setIsLoading(true)
            const postLogin= await fetch(config.loginLink, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email,password})
            })

            const status= postLogin.status
            const response=await postLogin.json()
            if(status==201){
                const {account, token}= response.data;
                console.log(response)
                saveToken(token);
                console.log('token', token)
                setAcct(account)
                setErrorMessage("")
                setServerError('')    
            }
            else if(status==500){
                setServerError(response.message)
                setErrorMessage("")
            }
            else {
                setServerError('')
                setErrorMessage(response.message)
            }  
            setIsLoading(false) 
        }
        loginFunc()
    }

    useEffect(()=>{
        if(Object.keys(acct!).length!==0){
            const {id, role}= acct!
            const link= role=='admin'? `/dashboard/admin/${id}/records` : `/dashboard/users/${id}`
            navigate(link)
            
        }
    },[acct])
  return (
    <>
        {
            verified &&
            (
                <>
                    <section className="auth login">
                        <div className="container">
                            <div className="top-content">
                                <div className="brand-logo">
                                    <img src="/Assets/Brand_logo.png" alt="" />
                                </div>
                                <p className='welcome-note'>Welcome</p>
                                <p className='auth-desc'>Sign in by entering the information below</p>
                            </div>
                            <div className={errorMessage? "error-message show-error": "error-message"}>
                                <p>{errorMessage && errorMessage}</p>
                            </div>
                            <form action="" onSubmit={handleSubmit}>
                                <div className="input-wrapper">
                                    <input type="text" name="email" className="email" value={email} onChange={({target})=>setEmail(target.value)} placeholder='Email'/>
                                </div>
                                <div className="input-wrapper input-flex">
                                    <input type={showPassword? "text":"password"} name="password" className="password" value={password} onChange={({target})=>setPassword(target.value)} placeholder='Password'/>
                                    <span className="icon" onClick={(e)=>{e.preventDefault(); setShowPassword(!showPassword)}}>{showPassword? <ImEyeBlocked /> : <ImEye /> }</span>
                                </div>
                                <button type="submit" className="btn green-btn submit-btn" disabled={isLoading}>{isLoading? <CircularProgress size='20px' color= 'inherit'/>:'Sign In'}</button>
                            </form>
                            <div className="auth-footer">
                                <div className="remember-flex">
                                    <div className='remember-me'>
                                        
                                        <label htmlFor="remember-me">
                                                Remember Me
                                                <input type="checkbox" name="" id="remember-me" checked={remember} onChange ={()=>setRemember(!remember)}/>
                                                <span className="checkbox-background"></span>
                                                
                                        </label>
                                    </div>
                                    <Link to='/auth/reset'>Forgot Password</Link>
                                </div>
                                <p className='reverse-page-question'>Don't have an account</p>
                                <div className='reverse-page-link'>
                                    <Link to='/auth/register'>Sign up</Link>
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
    </>
    
  )
}

export default Login