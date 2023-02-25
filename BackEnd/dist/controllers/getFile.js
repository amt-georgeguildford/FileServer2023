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
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file_id } = req.params;
    try {
        if (!file_id)
            return res.status(204).json({ status: 'error', message: 'Something went wrong' });
        const file = yield (0, DB_1.default)('SELECT * FROM files WHERE id=$1', [file_id]);
        // if(file.rows.length==0) return res.status(204).json({status: 'error',message: 'File does not exist'})
        const row = file.rows[0];
        const codedfilename = row.file.match(/[a-zA-Z0-9]+.[a-zA-Z0-9]+$/g)[0];
        console.log(codedfilename);
        const data = Object.assign(Object.assign({}, row), { file: codedfilename });
        res.status(200).json({ status: 'ok', data: [data] });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'ok', message: 'Something went wrong' });
    }
});
exports.default = getFile;
