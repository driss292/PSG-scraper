import dotenv from "dotenv";

dotenv.config();

// Server
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;

const GMAIL_MDP = process.env.GMAIL_MDP;

const CAPTCHA_API_KEY = process.env.RECAPTCHA_API_KEY;

export const config = {
    server: {
        port: SERVER_PORT,
    },
    mail: {
        mdp: GMAIL_MDP,
    },
    captcha: {
        api_key: CAPTCHA_API_KEY,
    },
};
