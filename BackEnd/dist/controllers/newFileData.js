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
const newFileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { email, role } = req.payload;
    const { description, title, targetId } = req.body;
    if (!file)
        return res.status(400).json({ status: 'error', message: 'Error: Select a file...' });
    if (!description || !title || !targetId) {
        let str = [];
        if (!email)
            str.push('email');
        if (!description)
            str.push('description');
        if (!title)
            str.push('firstname');
        if (!targetId)
            str.push('lastname');
        let ArrStr = "";
        ArrStr = str.join(", ");
        if (str.length > 1) {
            ArrStr = ArrStr.replace(/(, )(\w+)$/, " and $2");
        }
        return res.status(400).json({ status: 'error', message: `${ArrStr} can not be empty` });
    }
    if (role != process.env.ADMIN_ID)
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    const fileURL = file.path;
    const filename = title.toLowerCase() + file.originalname.match(/\.([a-zA-Z0-9]+)$/)[0];
    try {
        const fileEntry = yield (0, DB_1.default)('INSERT INTO files(title,description,filename,file,user_id) VALUES($1,$2,$3,$4,$5)', [title, description, filename, fileURL, targetId]);
        if (fileEntry.rowCount == 0)
            return res.status(400).json({ status: 'error', message: 'No content' });
        res.status(201).json({ status: 'ok' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});
exports.default = newFileData;
