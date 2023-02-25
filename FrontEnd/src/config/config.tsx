import React from 'react'
const env= 'dev'
const originObj={
    dev:'http://localhost:5000',
    prod:'https://lizzybackend-production.up.railway.app'
}
const origin=originObj[env]


const config = {
    origin,
    loginLink: `${origin}/auth/login`,
    register:   `${origin}/auth/register`,
    logout: `${origin}/auth/logout`,

    resetPasswordRequest: `${origin}/auth/reset_request`,
    verifyResetToken: `${origin}/auth/reset_password`,
    verifyConfirmId: `${origin}/auth/reset_success`,
    authbeforedashboard: `${origin}/auth/verify_account_redirect`,
    
    verifyLink:   `${origin}/api/v1/verify`,
    adminDataLink: `${origin}/api/v1/admin`,
    userDataLink: `${origin}/api/v1/users`,
}

export default config