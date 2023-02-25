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
const dotenv_1 = __importDefault(require("dotenv"));
const DB_1 = __importDefault(require("../db/DB"));
dotenv_1.default.config();
const verify_resetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token)
        return res.status(400).json({ status: 'error', verify: false, message: 'Unauthorized' });
    try {
        const checkToken = yield (0, DB_1.default)('SELECT * FROM resets WHERE token= $1', [token]);
        if (checkToken.rows.length == 0)
            return res.status(409).json({ status: 'error', verify: false, message: 'Unauthorized' });
        const payload = yield jsonwebtoken_1.default.verify(token, process.env.RESET_TOKEN_SECRET);
        const userInfo = {
            email: payload.email,
            role: payload.role
        };
        res.status(200).json({ status: 'ok', verify: true, message: 'verified', userInfo });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: 'error', verify: false, message: 'Session Timeout' });
    }
});
exports.default = verify_resetter;
