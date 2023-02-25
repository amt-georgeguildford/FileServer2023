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
const searchFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search = req.query.search;
    search = search.trim();
    try {
        const searchPattern = `%${search}%`;
        const searcCommand = `WITH download_num AS(
            SELECT file_id, COUNT(file_id) AS downloads FROM downloads GROUP BY file_id
        ),
        email_sent_num AS(
            SELECT file_id, COUNT(file_id) AS email_sent FROM email_sent GROUP BY file_id
        )
        SELECT files.id, 
            files.title, 
            files.description, 
            files.filename, 
            files.file,
            COALESCE(download_num.downloads,0) AS downloads,
            COALESCE(email_sent_num.email_sent,0) AS email_sent
        FROM files 
        LEFT JOIN download_num 
        ON download_num.file_id=files.id
        LEFT JOIN email_sent_num
        ON email_sent_num.file_id=files.id
        WHERE title ILIKE $1;`;
        const searchResult = yield (0, DB_1.default)(searcCommand, [searchPattern]);
        const token = {
            accessToken: req.accessToken,
            refreshToken: req.query.refreshToken
        };
        res.status(200).json({ status: 'ok', security: token, data: searchResult.rows });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong with the search' });
    }
});
exports.default = searchFile;
