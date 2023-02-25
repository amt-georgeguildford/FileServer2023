import React from 'react'

const removeSaveToken = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}

export default removeSaveToken