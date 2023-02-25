import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LinkModal = ({backLink,children}: {backLink:string, children:React.ReactNode}) => {
    const navigate =useNavigate()
  return (
    <>
        <div className="send-mail">
            {children}
            <div className="overlay" onClick={()=>navigate(backLink)}></div>
        </div>
    </>
  )
}

export default LinkModal