import { sql } from '../config/db.js';

export const addDiscount = async (req, res) => {
    const {
        shop_id,
        title,
        discount_percentage,
        category,
        start_date,
        end_date
    } = req.body;

    if (!shop_id || !title || !discount_percentage || !category || !start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required (shop_id, title, discount_percentage, category, start_date, end_date)'
        });
    }

    try {
        const result = await sql`
            INSERT INTO discounts (
                shop_id,
                title,
                discount_percentage,
                category,
                start_date,
                end_date
            ) VALUES (
                ${shop_id},
                ${title},
                ${discount_percentage},
                ${category},
                ${start_date},
                ${end_date}
            )
            RETURNING *
        `;

        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        console.error('Error adding discount:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getDiscounts = async (req, res) => {
    const { date, category, city, search } = req.query;

    let filters = [];

    if (date === 'today') {
        filters.push(`CURRENT_DATE BETWEEN discounts.start_date AND discounts.end_date`);
    } else if (date === 'tomorrow') {
        filters.push(`CURRENT_DATE + INTERVAL '1 day' BETWEEN discounts.start_date AND discounts.end_date`);
    } else if (date === 'week') {
        filters.push(`discounts.start_date <= CURRENT_DATE + INTERVAL '7 days' AND discounts.end_date >= CURRENT_DATE`);
    }

    if (category) {
        filters.push(`discounts.category ILIKE '%${category}%'`);
    }

    if (city) {
        filters.push(`shops.city ILIKE '%${city}%'`);
    }

    if (search) {
        filters.push(`(
            discounts.title ILIKE '%${search}%' OR
            shops.shop_name ILIKE '%${search}%'
        )`);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    try {
        const result = await sql.unsafe(`
            SELECT 
                discounts.*, 
                shops.shop_name, 
                shops.city 
            FROM discounts
            JOIN shops ON discounts.shop_id = shops.id
            ${where}
            ORDER BY discounts.start_date ASC
        `);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
