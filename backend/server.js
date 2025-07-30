import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import shopRoute from './routes/shopRoute.js';
import discountRoute from './routes/discountRoute.js';

import { sql } from './config/db.js';
import { aj } from "./lib/arcjet.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(morgan('dev'));

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
        requested: 1, // specifies that each request consumes 1 token
        });

        if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            res.status(429).json({ error: "Too Many Requests" });
        } else if (decision.reason.isBot()) {
            res.status(403).json({ error: "Bot access denied" });
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
        return;
        }

        // check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
        res.status(403).json({ error: "Spoofed bot detected" });
        return;
        }

        next();
    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
});


app.use('/api/shops',  shopRoute);
app.use('/api/discounts', discountRoute);


async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS shops (
                id SERIAL PRIMARY KEY,
                shop_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                city VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS discounts (
                id SERIAL PRIMARY KEY,
                shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
                title VARCHAR(100) NOT NULL,
                discount_percentage NUMERIC(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
                category VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

initDB().then(() => {
    console.log('Database initialized successfully');
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
});