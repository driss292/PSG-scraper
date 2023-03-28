import dotenv from "dotenv";

dotenv.config();

// Server
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;

export const config = {
    server: {
        port: SERVER_PORT,
    },
};
