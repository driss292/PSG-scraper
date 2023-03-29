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
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res, next) => {
    try {
        function checkForChanges() {
            return __awaiter(this, void 0, void 0, function* () {
                const browser = yield puppeteer_1.default.launch({
                    headless: false,
                });
                const page = yield browser.newPage();
                yield page.goto("https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B%5D=2&filters%5Bcompetition%5D%5B%5D=270", {
                    waitUntil: "networkidle2",
                });
                yield page.setViewport({ width: 1200, height: 1000 });
                yield page.screenshot({ path: "image.png" });
                yield browser.close();
            });
        }
        // Check for changes periodically
        setInterval(checkForChanges, 60000);
    }
    catch (error) {
        Logging_1.default.error("ERROR");
    }
});
// app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
//     try {
//         res.status(200).json("pong");
//     } catch (error) {
//         Logging.error("ERROR");
//     }
// });
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//     const error = new Error("Not found");
//     Logging.error(error);
//     res.status(404).json({
//         message: "Page not found",
//     });
// });
app.listen(config_1.config.server.port, () => {
    Logging_1.default.info(`Server is running on port ${config_1.config.server.port}`);
});
//# sourceMappingURL=index.js.map