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
    const percentage = parseFloat(discount_percentage);
    const shopIdInt = parseInt(shop_id);

    if (isNaN(shopIdInt)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop_id: must be a number'
      });
    }

    // Optional: validate date format with regex or Date.parse
    if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for start_date or end_date'
      });
    }

    const result = await sql`
      INSERT INTO discounts (
        shop_id,
        title,
        discount_percentage,
        category,
        start_date,
        end_date
      ) VALUES (
        ${shopIdInt},
        ${title},
        ${percentage},
        ${category},
        ${start_date},
        ${end_date}
      )
      RETURNING *
    `;

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    // console.error('->> Error adding discount:', error);

    if (error.code === '23503') {
      // Foreign key violation, invalid shop_id
      return res.status(400).json({
        success: false,
        message: `Invalid shop_id: ${shop_id} does not exist in shops table`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
      code: error.code
    });
  }
};


export const getDiscounts = async (req, res) => {
  const search = req.query.search || "";

  try {
    let discounts;

    if (search) {
      const searchTerm = `%${search.toLowerCase()}%`;
      discounts = await sql`
        SELECT 
          discounts.*, 
          shops.shop_name, 
          shops.city
        FROM discounts
        JOIN shops ON discounts.shop_id = shops.id
        WHERE LOWER(discounts.title) LIKE ${searchTerm}
        OR LOWER(shops.shop_name) LIKE ${searchTerm}
        ORDER BY discounts.start_date ASC
      `;
    } else {
      discounts = await sql`
        SELECT 
          discounts.*, 
          shops.shop_name, 
          shops.city
        FROM discounts
        JOIN shops ON discounts.shop_id = shops.id
        ORDER BY discounts.start_date ASC
      `;
    }

    res.status(200).json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getDiscountsByShopId = async (req, res) => {
  const shopId = req.shop?.id;
  const search = req.query.search || "";

  if (!shopId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No shop ID found in token",
    });
  }

  try {
    let results;

    if (search) {
      const searchTerm = `%${search.toLowerCase()}%`;
      results = await sql`
        SELECT 
          discounts.*, 
          shops.shop_name, 
          shops.city
        FROM discounts
        JOIN shops ON discounts.shop_id = shops.id
        WHERE discounts.shop_id = ${shopId}
          AND (LOWER(discounts.title) LIKE ${searchTerm} OR LOWER(shops.shop_name) LIKE ${searchTerm})
        ORDER BY discounts.created_at DESC
      `;
    } else {
      results = await sql`
        SELECT 
          discounts.*, 
          shops.shop_name, 
          shops.city
        FROM discounts
        JOIN shops ON discounts.shop_id = shops.id
        WHERE discounts.shop_id = ${shopId}
        ORDER BY discounts.created_at DESC
      `;
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    // console.error("->> Error fetching discounts by shop:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Get a discount by ID
export const getDiscountById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      SELECT 
        discounts.*, 
        shops.shop_name, 
        shops.city
      FROM discounts
      JOIN shops ON discounts.shop_id = shops.id
      WHERE discounts.id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Discount not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
