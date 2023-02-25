import React, { useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { accountType, context } from '../../context/ContextProvider'
import config from '../../config/config'
import { CircularProgress } from '@mui/material'
import removeSaveToken from '../../utlis/removeSaveToken'
const Header = ({children, homeLink, greetNote}:{children: React.ReactNode; homeLink:string; greetNote: string}) => {
    const [showMenu, setShowMenu] = useState(false)
    const {verifiedUser,setAcct,setVerifiedUser,setVerified}= useContext(context)
    const {id}= useParams()
    const [loading, setLoading]= useState(false)
    const navigate= useNavigate();
    const handleLogout = ()=>{
        setLoading(true)
        const logoutFunc= async ()=>{
            const logout= await fetch(`${config.logout}/${id}`) 
            const status= logout.status;
            const response= await logout.json()
            removeSaveToken()
            setAcct({} as accountType)
            setVerifiedUser('')
            setVerified(true)
            navigate('/auth/login') 
        }
        logoutFunc ()
    }
    return (
    <header>
        <div className="container">
            <nav className='nav'>
                <div className="nav-brand">
                    <Link to={homeLink}>
                        <img src="/Assets/Brand_logo.png" alt="" width='40'/>
                    </Link>
                </div>
                {children}
                <div className="identify-account">
                    <div className="avatar">
                        
                    </div>
                    <div className="greet-note">{greetNote},</div>
                    <div className="account">
                        <div onClick={()=> setShowMenu(!showMenu)} style={{cursor:'pointer'}}>
                            <span className="account-name">{verifiedUser && verifiedUser}</span>
                            <span className="icon"><FiChevronDown/></span>
                        </div>
                        {
                            showMenu && 
                            <div className="drop-down-menu" >
                                <div>
                                    <span className='drop-title'>Profile</span>
                                    <span className="icon"><CgProfile /></span>
                                </div>
                                <div onClick={handleLogout}>
                                    <span className='drop-title'>Log Out</span>
                                    <span className='icon'>{loading? <CircularProgress color='inherit' size='12px'/>:<IoLogOutOutline />}</span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Header