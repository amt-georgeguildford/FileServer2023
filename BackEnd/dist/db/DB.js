"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config/config"));
const { host, port, database, password, user } = config_1.default.db;
const pool = new pg_1.Pool({ host, port, database, password, user });
const DB = (text, params) => {
    return pool.query(text, params);
};
exports.default = DB;
