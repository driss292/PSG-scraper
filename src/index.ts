import express, { Application, NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { config } from "./config/config";
import Logging from "./library/Logging";

const app: Application = express();
app.use(express.json());

// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//     try {
//         async function checkForChanges(): Promise<void> {
//             const browser: Browser = await puppeteer.launch({
//                 headless: false,
//             });
//             const page: Page = await browser.newPage();
//             await page.goto(
//                 "https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B%5D=2&filters%5Bcompetition%5D%5B%5D=270",
//                 {
//                     waitUntil: "networkidle2",
//                 }
//             );
//             await page.setViewport({ width: 1200, height: 1000 });
//             await page.screenshot({ path: "image.png" });

//             // await browser.close();
//         }
//         setTimeout(checkForChanges, 6000);
//         res.json("OK");
//     } catch (error) {
//         Logging.error("ERROR");
//     }
// });
// setInterval(

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: "2captcha",
            token: config.captcha.api_key,
        },
    })
);
// (async () => {
async function checkForChanges(): Promise<void> {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(
        "https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B0%5D=2&filters%5Bcompetition%5D%5B1%5D=270&filters%5Bshow_away%5D%5B0%5D=0&filters%5Bstate%5D%5B0%5D=opened",
        {
            waitUntil: "networkidle2",
        }
    );
    let data;

    await page.waitForTimeout(2000);
    await page.solveRecaptchas();

    await Promise.all([
        await page.waitForNavigation(),
        (data = await page.evaluate(() => {
            if (document.querySelector(".psgContLytMainInner > p") !== null) {
                return document
                    .querySelector<HTMLElement>(".psgContLytMainInner > p")
                    ?.innerText.trim();
            }
        })),
        console.log(data),
    ]);
    if (data) {
        // Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "drisskaci@gmail.com",
                pass: config.mail.mdp,
            },
        });

        const mailOptions = {
            // from: process.env.address_from,
            from: "drisskaci@gmail.com",
            // to: process.env.address_to,
            to: "drisskaci@gmail.com",
            subject: "test",
            text: "test server Scrape PSG",
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("ERROR", error);
            } else {
                console.log("SUCCESS", info.response);
            }
        });
    }

    await browser.close();
}

setInterval(checkForChanges, 45000);

app.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
});
