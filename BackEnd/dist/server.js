"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const Auth_1 = __importDefault(require("./routes/Auth"));
const downloadFile_1 = __importDefault(require("./controllers/downloadFile"));
const api_1 = __importDefault(require("./routes/api/api"));
const PORT = config_1.default.app.port;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send('Welcome to my backend');
});
app.use('/auth', Auth_1.default);
app.use('/api/v1', api_1.default);
app.get('/download/:id/:file_id/', downloadFile_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}...`);
});
