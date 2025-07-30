import { sql } from "../config/db.js";
import bcrypt from "bcrypt";

export const getShops = async (req, res) => {
    try {
        const shops = await sql`
        SELECT * FROM shops
        ORDER BY created_at DESC
        `;

        console.log("fetched shops", shops);
        res.status(200).json({ success: true, data: shops });
    } catch (error) {
        console.log("Error in getShops function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const createShop = async (req, res) => {
    const { shop_name, email, password, city } = req.body;

    if (!shop_name || !email || !password || !city) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const newShop = await sql`
            INSERT INTO shops (shop_name, email, password_hash, city)
            VALUES (${shop_name}, ${email}, ${password_hash}, ${city})
            RETURNING *
        `;

        console.log("New shop created", newShop);
        res.status(201).json({ success: true, data: newShop[0] });
    } catch (error) {
        console.error("Error creating shop", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Login a shop
export const loginShop = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        // Find shop by email
        const shops = await sql`
            SELECT * FROM shops WHERE email = ${email}
        `;
        if (shops.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const shop = shops[0];

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, shop.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Remove password_hash from response
        const { password_hash, ...shopData } = shop;

        console.log("Shop logged in:", shopData);
        res.status(200).json({ success: true, data: shopData });
    } catch (error) {
        console.error("Error logging in shop:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getShop = async (req, res) => {
    const { id } = req.params;

    try {
        const shop = await sql`
        SELECT * FROM shops WHERE id=${id}
        `;

        res.status(200).json({ success: true, data: shop[0] });
    } catch (error) {
        console.log("Error in getShop function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export const updateShop = async (req, res) => {

    const { id } = req.params;
    const { shop_name, email, password_hash, city } = req.body;

    // Basic validation ko lagi
    if (!shop_name || !email || !password_hash || !city) {
        return res.status(400).json({
        success: false,
        message: "All fields (shop_name, email, password_hash, city) are required.",
        });
    }

    try {
        const updatedShop = await sql`
        UPDATE shops 
        SET shop_name = ${shop_name},
            email = ${email},
            password_hash = ${password_hash},
            city = ${city},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
        `;

        if (updatedShop.length === 0) {
        return res.status(404).json({
            success: false,
            message: `Shop with ID ${id} not found.`,
        });
        }

        return res.status(200).json({
        success: true,
        message: "Shop updated successfully.",
        data: updatedShop[0],
        });
    } catch (error) {
        console.error("Error in updateShop:", error);

        // Handle unique email violation
        if (error.code === '23505') {
        return res.status(409).json({
            success: false,
            message: "Email already exists. Please use a different email.",
        });
        }

        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
};




export const deleteShop = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedShop = await sql`
      DELETE FROM shops WHERE id=${id} RETURNING *
    `;

    if (deletedShop.length === 0) {
        return res.status(404).json({
        success: false,
        message: "Shop not found",
    });
    }
        console.log("Deleted shop", deletedShop);
        res.status(200).json({ success: true, data: deletedShop[0] });
    } catch (error) {
        console.log("Error in deleteShop function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};