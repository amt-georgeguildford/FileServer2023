import React, { useEffect, useContext } from 'react';
import { Routes,Route, useLocation, useNavigate } from 'react-router-dom'
import DownlistsList from './components/downloadsList/DownlistsList';
import EmailsSent from './components/emailsSent/EmailsSent';
import SendMail from './components/sendMail/SendMail';
import config from './config/config';
import { context } from './context/ContextProvider';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Reset from './pages/auth/Reset';
import ResetConfirm from './pages/auth/ResetConfirm';
import ResetRequestSuccess from './pages/auth/ResetRequestSuccess';
import ResetSent from './pages/auth/ResetSent';
import Records from './pages/dashboard/admin/Records';
import Upload from './pages/dashboard/admin/Upload';
import User from './pages/dashboard/User';
import accessSavedToken from './utlis/accessSavedToken';
import saveToken from './utlis/saveToken';

function App() {
  const {pathname} = useLocation()
  const navigate= useNavigate()
  const {setVerified} = useContext(context)
  useEffect(()=>{
    const token = accessSavedToken()
    
    const verifyFunc = async ()=>{
      if(pathname=='/' || pathname=='/auth/login'){
        console.log('here')
        if(token.accessToken!=null && token.refreshToken!=null){

          const verify = await fetch(`${config.authbeforedashboard}?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`)
          const status= verify.status
          const response = await verify.json()
          if(status==200){
            const {userInfo,security}= response
            saveToken(security)
            if(userInfo=='admin'){
              navigate(`/dashboard/admin/${userInfo.id}/records`)
            }
            else {
              navigate(`/dashboard/users/${userInfo.id}`)
            }
          }
          else {
            setVerified(true)
            if(pathname=='/'){
              navigate('/auth/login')
            }
            
          }
        }
        else{
          setVerified(true)
            if(pathname=='/'){
              navigate('/auth/login')
            }
        }

      }
    }
    verifyFunc()
  },[])
  return (
    <div className="App">
      <Routes>
        <Route path='/auth'>
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
            <Route path='reset'>
              <Route path='' element={<Reset/>}/>
              <Route path=':token' element={<ResetSent/>}/>
              <Route path='confirm/:id' element={<ResetConfirm/>}/>
              <Route path='confirmation/:email' element={<ResetRequestSuccess />}/>
            </Route>
        </Route>
        <Route path='/dashboard'>
            <Route path='admin/:id'>
                <Route path='records' element={<Records />}>
                  <Route path='download_List/:file_id' element={<DownlistsList />} />
                  <Route path='email_List/:file_id' element={<EmailsSent />} />
                </Route>
                <Route path='upload' element={<Upload />} />
            </Route>
            <Route path='users/:id' element={<User />}>
              <Route path='mail/:file_id' element={<SendMail />}/>
            </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
