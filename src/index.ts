import express, { Application, NextFunction, Request, Response } from "express";
import nodemailer, { Transporter } from "nodemailer";
import puppeteer, { Browser, Page } from "puppeteer";
import { config } from "./config/config";
import Logging from "./library/Logging";

const app: Application = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        async function checkForChanges(): Promise<void> {
            const browser: Browser = await puppeteer.launch({
                headless: false,
            });
            const page: Page = await browser.newPage();
            await page.goto(
                "https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B%5D=2&filters%5Bcompetition%5D%5B%5D=270",
                {
                    waitUntil: "networkidle2",
                }
            );
            await page.setViewport({ width: 1200, height: 1000 });
            await page.screenshot({ path: "image.png" });

            // await browser.close();
        }
        setTimeout(checkForChanges, 6000);
    } catch (error) {
        Logging.error("ERROR");
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

app.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
});
