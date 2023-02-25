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
dotenv_1.default.config();
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('admin verified');
    const { id } = req.params;
    const { email, role } = req.payload;
    if (!id)
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    if (role != process.env.ADMIN_ID && role != process.env.USER_ID)
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    try {
        const foundAdmin = yield (0, DB_1.default)('SELECT * FROM users WHERE id= $1 AND email= $2 AND role= $3', [id, email, role]);
        if (foundAdmin.rowCount == 0)
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        next();
    }
    catch (error) {
        res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
});
exports.default = verifyAdmin;
