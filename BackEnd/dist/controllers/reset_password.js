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
const bcrypt_1 = __importDefault(require("bcrypt"));
const DB_1 = __importDefault(require("../db/DB"));
dotenv_1.default.config();
const reset_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    try {
        const checkToken = yield (0, DB_1.default)('SELECT * FROM resets WHERE token= $1', [token]);
        if (checkToken.rows.length == 0)
            return res.status(409).json({ status: 'error', verify: false, message: 'Session has already been used' });
        const payload = yield jsonwebtoken_1.default.verify(token, process.env.RESET_TOKEN_SECRET);
        const { email, role } = payload;
        if (!newPassword || !confirmPassword) {
            const str = !newPassword && !confirmPassword ? "New Password and Confirm Password" :
                !newPassword ? "New Password" :
                    !confirmPassword ? "Confirm Password" : "";
            return res.status(400).json({ status: 'error', message: `${str} cannot be empty...` });
        }
        if (newPassword != confirmPassword)
            return res.status(400).json({ status: 'error', message: 'New Password and Confirm Password must the match' });
        const hashPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const savePassword = yield (0, DB_1.default)('UPDATE users SET password= $1 WHERE email= $2 AND role= $3 RETURNING id', [hashPassword, email, role]);
        if (savePassword.rowCount == 0)
            return res.status(500).json({ status: 'error', message: 'Something wrong trying to change password' });
        const deleteReset = yield (0, DB_1.default)('DELETE FROM resets WHERE token= $1', [token]);
        res.status(201).json({ status: 'ok', id: savePassword.rows[0].id });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: 'error', message: 'Session Timeout' });
    }
});
exports.default = reset_password;
