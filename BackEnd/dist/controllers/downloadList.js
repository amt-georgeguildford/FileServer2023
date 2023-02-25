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
const downloadList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file_id } = req.params;
    if (!file_id)
        return res.status(204).json({ status: 'error', message: 'File does not exist' });
    try {
        const strQuery = `SELECT users.firstname,users.lastname, downloads.email,downloads.ts AS time FROM downloads
        JOIN users ON users.id=downloads.user_id
        WHERE downloads.file_id=$1`;
        const file = yield (0, DB_1.default)('SELECT title, description FROM files WHERE id=$1', [file_id]);
        const fileDownload = yield (0, DB_1.default)(strQuery, [file_id]);
        if (fileDownload.rowCount == 0)
            return res.status(204).json({ status: 'error', message: 'File does not exist' });
        res.status(200).json({ status: 'ok', file: file.rows[0], data: fileDownload.rows });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});
exports.default = downloadList;
