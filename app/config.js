import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ silent: true });

const config = {
    rootPath: path.resolve(__dirname, '..'),
    imageDir: 'public/static',
    jwtSecret: process.env.JWT_SECRET || 's0m3th1ngs3cr3t',
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME
}

export default config;

