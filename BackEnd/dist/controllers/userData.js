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
const userData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const data = yield (0, DB_1.default)('SELECT * FROM files WHERE user_id=$1', [id]);
        const token = {
            accessToken: req.accessToken,
            refreshToken: req.query.refreshToken
        };
        res.status(200).json({ status: 'ok', userInfo: req.userInfo, security: token, data: data.rows });
    }
    catch (error) {
        res.status(500).json({ error: 'error', message: 'Internal Server Error' });
    }
});
exports.default = userData;
