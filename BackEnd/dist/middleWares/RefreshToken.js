"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DB_1 = __importDefault(require("../db/DB"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('refresh Token');
    const { refreshToken } = req.query;
    if (req.payload)
        return next();
    if (!refreshToken)
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    try {
        const checkTokenSaved = yield (0, DB_1.default)('SELECT * FROM users WHERE token= $1', [refreshToken]);
        if (checkTokenSaved.rows.length == 0)
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        const verifiedRefreshToken = yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { email, role } = verifiedRefreshToken;
        const newAccessToken = yield jsonwebtoken_1.default.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        req.payload = verifiedRefreshToken;
        req.accessToken = newAccessToken;
        next();
    }
    catch (error) {
        console.log('error');
        res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
});
exports.default = refreshToken;
