import { CircularProgress } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorPage from '../../components/errorPage/ErrorPage'
import config from '../../config/config'
import { context } from '../../context/ContextProvider'
import saveToken from '../../utlis/saveToken'

const Register = () => {
    const [loading, setLoading]= useState(false)

    const [showPassword, setShowPassword]= useState(false)
    const [firstname,setFirstname]= useState("")
    const [lastname,setLastname]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [confirmPassword,setConfirmPassword]= useState("")

    const [errorMessage, setErrorMessage]= useState("")
    const [serverError, setServerError]= useState("")
    const navigate= useNavigate()
    const {acct,setAcct} = useContext(context)
    const handleSubmit= (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true)
        const postRegister= async ()=>{
            const registerUser= await fetch(config.register, {
                method: "POST",
                headers:{
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({firstname,lastname,email,password, confirmPassword})
            })
            const status= registerUser.status
            const response=await registerUser.json()
            if(status==201){
                const {account, token}= response.data;
                saveToken(token);
                console.log('token', token)
                setAcct(account)
                setErrorMessage("")
                setServerError('') 
            }
            else if(status==500){
                setErrorMessage("") 
                setServerError(response.message)
            }
            else{
                setServerError('')
                setErrorMessage(response.message)
            }
            setLoading(false)
        }
        postRegister()
    }
    useEffect(()=>{
        if(Object.keys(acct).length!==0){
            const {id, role}= acct
            const link= role=='admin'? `/dashboard/admin/${id}/records` : `/dashboard/users/${id}`
            navigate(link)
        }
    },[acct])
  return (
    <>
        <section className="auth login">
            <div className="container">
                <div className="top-content">
                    <div className="brand-logo">
                        <img src="/Assets/Brand_logo.png" alt="" />
                    </div>
                    <p className='welcome-note'>Welcome</p>
                    <p className='auth-desc'>Sign up by entering the information below</p>
                </div>
                <div className={errorMessage? "error-message show-error" :"error-message"}>
                    <p>{errorMessage && errorMessage}</p>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input type="text" name="email"  value={firstname} onChange={({target})=>setFirstname(target.value)} placeholder='Firstname'/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="email"  value={lastname} onChange={({target})=>setLastname(target.value)} placeholder='lastname'/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="email"  value={email} onChange={({target})=>setEmail(target.value)} placeholder='Email'/>
                    </div>
                    <div className="input-wrapper">
                        <input type={showPassword? "text":"password"} name="email"  value={password} onChange={({target})=>setPassword(target.value)} placeholder='Password'/>
                    </div>
                    <div className="input-wrapper">
                        <input type={showPassword? "text":"password"} name="email"  value={confirmPassword} onChange={({target})=>setConfirmPassword(target.value)} placeholder='Confirm Password'/>
                    </div>
                    <button type="submit" className="btn green-btn submit-btn">{loading? <CircularProgress color='inherit' size= '20px'/>:'Sign Up'}</button>
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
                    <p className='reverse-page-question'>Already have an account</p>
                    <div className='reverse-page-link'>
                        <Link to='/auth/login'>Sign In</Link>
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

export default Register