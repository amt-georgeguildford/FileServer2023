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
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, file_id } = req.params;
    const { email } = req.query;
    if (!id || !file_id)
        res.status(400).json({ status: 'error', message: 'Unauthorize' });
    if (!email)
        res.status(400).json({ status: 'error', message: 'Unauthorize' });
    try {
        const str = `SELECT files.file AS link, files.filename FROM email_sent
        JOIN files 
        ON email_sent.file_id=id
        WHERE  email_sent.user_id=$1 AND email_sent.file_id= $2 
        LIMIT 1;`;
        console.log('here');
        const auth = yield (0, DB_1.default)(str, [id, file_id]);
        if (auth.rows.length == 0)
            return res.status(400).json({ status: 'error', message: 'Unauthorize' });
        res.download(auth.rows[0].link, auth.rows[0].filename);
        const saveDownload = yield (0, DB_1.default)('INSERT INTO downloads(file_id,user_id,email,ts) VALUES($1,$2,$3, NOW())', [file_id, id, email]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});
exports.default = downloadFile;
