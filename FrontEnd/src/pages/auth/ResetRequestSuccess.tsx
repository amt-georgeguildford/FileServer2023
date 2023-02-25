import React from 'react'
import { BsCheck } from 'react-icons/bs'
import { FaUserAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
const ResetRequestSuccess = () => {
    const {email} = useParams()
  return (
    <section className="auth login">
            <div className="container">
            <div className="top-content">
                    <div className="brand-logo">
                        <img src="/Assets/Brand_logo.png" alt="" />
                    </div>
                    <div className="confirmed-account">
                      <div>
                        <span className="icon user-icon"><FaUserAlt /> </span>
                        <span className="confirmed-account-email">{email}</span>
                      </div>
                      <span className="icon check"><BsCheck /> </span>
                    </div>
            </div>
            <p className="confirm-password-reset-messsage">
              <span>Check your email. Use the link to reset your password which is valid for 15min and can be one time</span>
            </p>
            </div>
        </section>
  )
}

export default ResetRequestSuccess