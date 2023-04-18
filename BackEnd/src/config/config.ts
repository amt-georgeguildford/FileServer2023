import dotenv from 'dotenv'
dotenv.config()

const env= process.env.NODE_ENV! as 'prod' | 'dev';

const dev={
    app:{
        host: process.env.HOST!,
        port: Number(process.env.PORT!),
        file_endpoint: process.env.DEV_FILE_ENDPOINT!,
    },
    db:{
        host:process.env.DB_DEV_HOST!,
        user:process.env.DB_DEV_USER!,
        database:process.env.DB_DEV_DATABASE!,
        password:process.env.DB_DEV_PASSWORD!,
        port:Number(process.env.DB_DEV_PORT!),
    }

}

const prod={
    app:{
        host: process.env.HOST!,
        port: Number(process.env.PORT!),
        file_endpoint: process.env.PROD_FILE_ENDPOINT!,
    },
    db:{
        host:process.env.PGHOST!,
        user:process.env.PGUSER!,
        database:process.env.PGDATABASE!,
        password:process.env.PGPASSWORD!,
        port:Number(process.env.PGPORT!),
    }
}

const config ={
    dev,prod
}

export default config[env]

