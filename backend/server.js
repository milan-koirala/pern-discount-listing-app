import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import listingRoute from './routes/listingRoute.js';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(morgan('dev'));
app.use('/api/listing',  listingRoute);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS discounts (
                id SERIAL PRIMARY KEY,
                shop_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                city VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
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