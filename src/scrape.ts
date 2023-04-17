// import express, { Application, NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { config } from "./config/config";
import Logging from "./library/Logging";

import express, { Request, Response, Application } from "express";
// import fetch, { Response as FetchResponse } from "node-fetch";

import { JSDOM } from "jsdom";
const app: Application = express();
app.use(express.json());

app.get("/", (req, res) => {
    fetch(
        "https://billetterie.psg.fr/fr/calendrier-des-matchs?filters%5Bcompetition%5D%5B0%5D=2&filters%5Bcompetition%5D%5B1%5D=270&filters%5Bshow_away%5D%5B0%5D=0&filters%5Bstate%5D%5B0%5D=opened"
    )
        .then((response) => response.text())
        .then((html) => {
            // Use JSDOM to create a virtual DOM from the HTML string
            const dom = new JSDOM(html);

            // Use DOM manipulation to extract the data you want
            // const data =
            //     dom.window.document.querySelector(".some-class").textContent;

            // Send the data back as a response
            // res.send(data);
            console.log(dom);
            // console.log(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while scraping the site");
        });
});

app.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
});
