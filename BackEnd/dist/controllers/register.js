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
const DB_1 = __importDefault(require("../db/DB"));
const EmailValidation_1 = __importDefault(require("../utlis/EmailValidation"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const GenerateToken_1 = __importDefault(require("../utlis/GenerateToken"));
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    if (!email || !password || !firstname || !lastname) {
        let str = [];
        if (!email)
            str.push('email');
        if (!password)
            str.push('password');
        if (!firstname)
            str.push('firstname');
        if (!lastname)
            str.push('lastname');
        let ArrStr = "";
        ArrStr = str.join(", ");
        if (str.length > 1) {
            ArrStr = ArrStr.replace(/(, )(\w+)$/, " and $2");
        }
        return res.status(400).json({ status: 'error', message: `${ArrStr} can not be empty` });
    }
    if (password != confirmPassword)
        return res.status(400).json({ status: 'error', message: `Password and Confirmed Password must match` });
    try {
        const role = process.env.USER_ID;
        if (!(0, EmailValidation_1.default)(email))
            return res.status(400).json({ status: 'error', message: 'Invalid email' });
        console.log('Email verified');
        const foundUser = yield (0, DB_1.default)('SELECT * FROM users WHERE email= $1', [email]);
        if (foundUser.rows.length != 0)
            return res.status(403).json({ status: 'error', message: 'Account already exist...' });
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const token = yield (0, GenerateToken_1.default)({ email, role });
        const register = yield (0, DB_1.default)('INSERT INTO users(firstname,lastname,email,password,role,token) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, role', [firstname, lastname, email, hashPassword, role, token.refreshToken]);
        console.log('Account Created');
        if (register.rows.length == 0)
            return res.status(500).json({ status: 'error', message: 'Something went wrong while trying to create your account' });
        const account = {
            id: register.rows[0].id,
            role: register.rows[0].role == process.env.USER_ID ? 'user' : ''
        };
        res.status(201).json({ status: 'ok', data: { token, account } });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong while trying to create your account' });
    }
});
exports.default = Register;
