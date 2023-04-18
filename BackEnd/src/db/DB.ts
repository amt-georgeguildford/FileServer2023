import {Pool} from 'pg'
import config from '../config/config';

const {host,port,database,password,user}= config.db
const pool =new Pool({host,port,database,password,user})

const DB= (text:string, params: any[])=>{
    return pool.query(text,params)
}
export default DB