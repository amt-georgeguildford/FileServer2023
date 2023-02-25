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
const bcrypt_1 = __importDefault(require("bcrypt"));
const DB_1 = __importDefault(require("../db/DB"));
const EmailValidation_1 = __importDefault(require("../utlis/EmailValidation"));
const GenerateToken_1 = __importDefault(require("../utlis/GenerateToken"));
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        let str = !email && !password ? 'Email and Password' :
            !email ? 'Email' : 'Password';
        return res.status(400).json({ status: 'error', message: str + ' can not be empty' });
    }
    try {
        if (!(0, EmailValidation_1.default)(email))
            return res.status(400).json({ status: 'error', message: 'Invalid email' });
        const foundUser = yield (0, DB_1.default)('SELECT * FROM users WHERE email= $1', [email]);
        if (foundUser.rows.length == 0)
            return res.status(401).json({ status: 'error', message: `Account doesn't exist` });
        const { id, role } = foundUser.rows[0];
        const verifiedPassword = yield bcrypt_1.default.compare(password, foundUser.rows[0].password);
        if (!verifiedPassword)
            return res.status(401).json({ status: 'error', message: `Password doesn't match` });
        const token = yield (0, GenerateToken_1.default)({ email, role });
        const saveToken = yield (0, DB_1.default)('UPDATE users SET token= $1 WHERE id= $2', [token.refreshToken, id]);
        if (saveToken.rowCount == 0)
            return res.status(500).json({ status: 'error', message: 'Something went wrong while trying to login' });
        const roleText = role == process.env.USER_ID ? 'user' :
            role == process.env.ADMIN_ID ? 'admin' : '';
        console.log(roleText);
        res.status(201).json({ status: 'ok', data: { token, account: { id, role: roleText } } });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong while trying to login' });
    }
});
exports.default = Login;
