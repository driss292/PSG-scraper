import express, { NextFunction, Request, Response } from "express";
import { config } from "./config/config";
import Logging from "./library/Logging";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json("PSG Sraper");
    } catch (error) {
        Logging.error("ERROR");
    }
});

app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json("pong");
    } catch (error) {
        Logging.error("ERROR");
    }
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not found");

    Logging.error(error);

    res.status(404).json({
        message: "Page not found",
    });
});

app.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
});
