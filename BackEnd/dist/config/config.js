"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env.NODE_ENV;
const dev = {
    app: {
        host: process.env.HOST,
        port: Number(process.env.PORT),
        file_endpoint: process.env.DEV_FILE_ENDPOINT,
    },
    db: {
        host: process.env.DB_DEV_HOST,
        user: process.env.DB_DEV_USER,
        database: process.env.DB_DEV_DATABASE,
        password: process.env.DB_DEV_PASSWORD,
        port: Number(process.env.DB_DEV_PORT),
    }
};
const prod = {
    app: {
        host: process.env.HOST,
        port: Number(process.env.PORT),
        file_endpoint: process.env.PROD_FILE_ENDPOINT,
    },
    db: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT),
    }
};
const config = {
    dev, prod
};
exports.default = config[env];
