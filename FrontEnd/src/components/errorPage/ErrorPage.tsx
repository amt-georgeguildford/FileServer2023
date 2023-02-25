import React from 'react'

const ErrorPage = ({serverError,children}:{serverError: string,children?: React.ReactNode}) => {
  return (
    <section className="auth login">
        <div className="container">
        <div className="top-content">
            <div className="brand-logo">
                <img src="/Assets/Brand_logo.png" alt="" />
            </div>
        </div>
        <h3 className="confirm-password-reset-messsage">{serverError}</h3>
        {children}
        </div>
    </section>
  )
}

export default ErrorPage