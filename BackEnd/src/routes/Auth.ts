import express from 'express'
import authCheckAccount from '../controllers/authCheckAccount'
import Login from '../controllers/login'
import logout from '../controllers/logout'
import Register from '../controllers/register'
import reset_password from '../controllers/reset_password'
import reset_request from '../controllers/reset_request'
import reset_success from '../controllers/reset_sucess'
import verify_resetter from '../controllers/verify_resetter'
import refreshToken from '../middleWares/RefreshToken'
import verifyToken from '../middleWares/VerifyToken'

const Auth = express.Router()

Auth.post('/login', Login)
Auth.post('/register', Register)
Auth.get('/logout/:id', logout)
Auth.post('/reset_request', reset_request)
Auth.post('/reset_password/:token', reset_password)
Auth.get('/reset_password/:token',verify_resetter)
Auth.get('/reset_success/:id', reset_success)

Auth.get('/verify_account_redirect', verifyToken,refreshToken,authCheckAccount)

export default Auth