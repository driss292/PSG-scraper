import dotenv from "dotenv";

dotenv.config();

// Server
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;
const ADDRESS_FROM = process.env.GMAIL_ADDRESS;
const ADDRESS_TO = process.env.OUTLOOK_ADDRESS;
const GMAIL_MDP = process.env.GMAIL_MDP;

const CAPTCHA_API_KEY = process.env.RECAPTCHA_API_KEY;

export const config = {
    server: {
        port: SERVER_PORT,
    },
    mail: {
        address_from: ADDRESS_FROM,
        address_to: ADDRESS_TO,
        mdp: GMAIL_MDP,
    },
    captcha: {
        api_key: CAPTCHA_API_KEY,
    },
};
