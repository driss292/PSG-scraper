import express, { Application, NextFunction, Request, Response } from "express";
import nodemailer, { Transporter } from "nodemailer";
// import puppeteer, { Browser, Page } from "puppeteer";
// import { PuppeteerExtra } from "puppeteer-extra";
// import { PuppeteerExtraPluginRecaptcha } from "puppeteer-extra-plugin-recaptcha";
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
        visualFeedback: true,
    })
);
(async () => {
    // async function checkForChanges(): Promise<void> {

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
        // "https://psg.fr",
        "https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B%5D=2&filters%5Bcompetition%5D%5B%5D=270&filters%5Bshow_away%5D%5B%5D=0&filters%5Bstate%5D%5B%5D=opened",
        {
            waitUntil: "networkidle2",
        }
    );

    await page.click("#didomi-notice-agree-button");

    const frame = await page.frames().find((f) => f.name().startsWith("a-"));
    if (frame !== undefined) {
        await frame.waitForSelector("div.recaptcha-checkbox-border");
        await frame.click("div.recaptcha-checkbox-border");
        const url = await frame?.url();
        // const { solved, error } = await frame.solveRecaptchas();
        if (url !== undefined) {
            // await frame.goto(url);

            console.log(url);
        }
        // if (solved) {
        //     await Promise.all([page.waitForNavigation(), console.log("OK")]);
        //     console.log("SOLVED");
        // }
    }

    // let captchas = await frame?.findRecaptchas();
    // console.log(captchas);

    // if (frame !== undefined) {
    //     await frame.waitForSelector("div.recaptcha-checkbox-border");
    //     await frame.click("div.recaptcha-checkbox-border");
    //     const { solved, error } = await frame.solveRecaptchas();
    //     if (solved) {
    //         await Promise.all([page.waitForNavigation(), console.log("OK")]);
    //         console.log("SOLVED");
    //     }
    // }
    // await page.waitForSelector("#recaptcha-anchor-label");
    // await page.click("#recaptcha-anchor-label");

    // await page.solveRecaptchas();
    // await Promise.all([
    //     page.waitForNavigation(),
    //     page.click(`rc-anchor-container`),
    // ]);

    // const { solved, error } = await page.solveRecaptchas();

    // if (solved) {
    //     await page.waitForNavigation(), console.log("SOLVED");
    // }

    // let data = await page.evaluate(() => {
    //     if (document.querySelector(".psgContLytMainInner > p") !== null) {
    //         return document
    //             .querySelector<HTMLElement>(".psgContLytMainInner > p")
    //             ?.innerText.trim();
    //     }
    // });
    // console.log(data);

    // await browser.close();
    // }
})();
// , 30000);

app.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
});
