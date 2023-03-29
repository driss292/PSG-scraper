import dotenv from "dotenv";

dotenv.config();

// Server
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;

const GMAIL_MDP = process.env.GMAIL_MDP;

export const config = {
    server: {
        port: SERVER_PORT,
    },
    mail: {
        mdp: GMAIL_MDP,
    },
};
