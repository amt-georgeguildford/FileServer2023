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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const reset_success = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ status: 'ok', verified: false, message: 'Unauthorized' });
    try {
        const foundUser = yield (0, DB_1.default)('SELECT firstname,lastname,id,role, email FROM users WHERE id= $1', [id]);
        if (foundUser.rows.length == 0)
            return res.status(409).json({ status: 'error', verify: false, message: 'Unauthorized' });
        const userInfo = {
            id: foundUser.rows[0].id,
            firstname: foundUser.rows[0].firstname,
            lastname: foundUser.rows[0].lastname,
            email: foundUser.rows[0].email,
            role: foundUser.rows[0].role == process.env.ADMIN_ID ? 'admin' :
                foundUser.rows[0].role == process.env.USER_ID ? 'user' : ''
        };
        res.status(200).json({ status: 'ok', verify: true, userInfo });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', verify: false, message: 'Internal Server Error' });
    }
});
exports.default = reset_success;
