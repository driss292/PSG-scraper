import http from "http";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { config } from "./config/config";
import nodemailer from "nodemailer";

function startServer() {
    const server = http.createServer((req, res) => {
        res.end("Hello, World");
    });

    puppeteer.use(
        RecaptchaPlugin({
            provider: {
                id: "2captcha",
                token: config.captcha.api_key,
            },
        })
    );
    (async () => {
        const browser = await puppeteer.launch({
            headless: false,
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
                if (
                    document.querySelector(".psgContLytMainInner > p") !== null
                ) {
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
                from: "drisskaci@gmail.com",
                to: "drisskaci@outlook.fr",
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
    })();

    server.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
    server.close();
}

setInterval(() => {
    console.log("Restarting server ...");
    startServer();
}, 25000);
