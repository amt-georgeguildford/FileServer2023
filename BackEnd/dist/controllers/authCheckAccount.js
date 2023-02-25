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
const dotenv_1 = __importDefault(require("dotenv"));
const DB_1 = __importDefault(require("../db/DB"));
dotenv_1.default.config();
const authCheckAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    const { email, role } = payload;
    if (role != process.env.ADMIN_ID && role != process.env.USER_ID)
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    try {
        const user = yield (0, DB_1.default)('SELECT id,token FROM users WHERE email=$1 AND role=$2', [email, role]);
        if (user.rows.length == 0)
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        const token = {
            accessToken: req.accessToken,
            refreshToken: user.rows[0].token
        };
        const userInfo = {
            id: user.rows[0].id,
            email,
            role: role == process.env.ADMIN_ID ? 'admin' :
                role == process.env.USER_ID && 'user',
        };
        res.status(200).json({ status: 'ok', userInfo, security: token });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
});
exports.default = authCheckAccount;
