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
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ status: 'error', message: '' });
    try {
        console.log(id);
        const user = yield (0, DB_1.default)('UPDATE users SET token= NULL WHERE id= $1 AND token IS NOT NULL', [id]);
        console.log(user);
        if (user.rowCount == 0)
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        res.status(201).json({ status: 'ok', message: 'Sign Out' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Something went while trying to sign out' });
    }
});
exports.default = logout;
