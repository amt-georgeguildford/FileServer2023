import React, { useState, createContext } from 'react'
type ContextType={
    acct: accountType;
    setAcct: React.Dispatch<React.SetStateAction<accountType>>;
    verified: boolean;
    setVerified: React.Dispatch<React.SetStateAction<boolean>>;
    verifiedUser: string;
    setVerifiedUser: React.Dispatch<React.SetStateAction<string>>;
}

export type accountType={
    id: string;
    role: string
}
export const context= createContext({} as ContextType)
const ContextProvider = ({children}: {children:React.ReactNode}) => {
    const [acct, setAcct]= useState({} as accountType)
    const [verified, setVerified] = useState(false)
    const [verifiedUser, setVerifiedUser] = useState('')
  return (
    <context.Provider value={{acct, setAcct, verified,setVerified, verifiedUser, setVerifiedUser}}>
        {children}
    </context.Provider>
  )
}

export default ContextProvider