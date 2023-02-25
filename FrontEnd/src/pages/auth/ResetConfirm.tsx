import React, { useContext, useEffect, useState} from 'react'
import { BsCheck } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import config from '../../config/config';
import { context } from '../../context/ContextProvider';

const ResetConfirm = () => {
    const {id} = useParams()
    const [accountVerified, setAccounVerified]= useState(false)
    const [userName,setUserName] = useState('')
    const [userEmail,setUserEmail] = useState('')

    const {setVerified}= useContext(context)
    useEffect(()=>{
      const userFunc= async ()=>{
        const user= await fetch(`${config.verifyConfirmId}/${id}`);
        const status= user.status
        const response = await user.json()
        console.log(response)
        setUserName(response.userInfo.firstname)
        setUserEmail(response.userInfo.email)
        setVerified(true)
        setAccounVerified(true)
      }

      userFunc()
    },[])
return (
  <>
    {
      accountVerified &&
      (
        <section className="auth login">
            <div className="container">
            <div className="top-content">
                    <div className="brand-logo">
                        <img src="/Assets/Brand_logo.png" alt="" />
                    </div>
                    <div className="confirmed-account">
                      <div>
                        <span className="icon user-icon"><FaUserAlt /> </span>
                        <span className="confirmed-account-email">{userEmail}</span>
                      </div>
                      <span className="icon check"><BsCheck /> </span>
                    </div>
            </div>
            <p className="confirm-password-reset-messsage">
              Hi <span>{userName}</span>, your password has been reset. Click the link below to sign in with the new password
            </p>
            <div className="auth-footer">
                <div className='reverse-page-link'>
                    <Link to='/auth/login'>Sign In</Link>
                </div>
            </div>
            </div>
        </section>
      )
    }
  </>
)  
}

export default ResetConfirm