import express from 'express'
import cors from 'cors'
import config from './config/config'
import Auth from './routes/Auth'
import downloadFile from './controllers/downloadFile'
import api from './routes/api/api'


const PORT = config.app.port
const app= express()

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('uploads'))
app.get('/',(req,res)=>{
    res.send('Welcome to my backend')
})
app.use('/auth',Auth)

app.use('/api/v1', api)
app.get('/download/:id/:file_id/',downloadFile)
app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}...`)
})
