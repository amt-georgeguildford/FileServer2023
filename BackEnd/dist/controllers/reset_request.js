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
const mailer_1 = __importDefault(require("../utlis/mailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../config/config"));
const EmailValidation_1 = __importDefault(require("../utlis/EmailValidation"));
dotenv_1.default.config();
const reset_request = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ status: 'error', message: 'Email cannot be empty' });
    if (!(0, EmailValidation_1.default)(email))
        return res.status(400).json({ status: 'error', message: 'Invalid email' });
    try {
        const confirmUser = yield (0, DB_1.default)('SELECT * FROM users WHERE email=$1', [email]);
        if (confirmUser.rows.length == 0)
            return res.status(403).json({ status: 'error', message: `Account doesn't exist` });
        const confirmEmail = confirmUser.rows[0].email;
        const confirmRole = confirmUser.rows[0].role;
        const payload = {
            email: confirmEmail,
            role: confirmRole
        };
        console.log('token creation');
        const token = yield jsonwebtoken_1.default.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '15m' });
        console.log('token created');
        const url = process.env.NODE_ENV == 'prod' ? `https://georgeguildfordlizzyplatform.netlify.app/auth/reset/${token}` :
            `http://${config_1.default.app.host}:3000/auth/reset/${token}`;
        const resetObj = {
            from: 'Lizzy" <lizzycompany07@gmail.com>',
            to: email,
            subject: 'Reset Password',
            text: `Link: ${url}`,
            html: `<h1 style="color: #01d28e">Request to reset password was successful</h1>
                    <a href='${url}'>Click Here</a><span>&nbsp; to reset your password</span>`
        };
        const info = yield mailer_1.default.sendMail(resetObj);
        const savetoken = yield (0, DB_1.default)('INSERT INTO resets(email, token) VALUES($1, $2)', [email, token]);
        console.log('email sent');
        res.status(201).json({ status: 'ok', message: 'Email Sent' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});
exports.default = reset_request;
