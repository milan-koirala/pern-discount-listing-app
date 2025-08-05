import { sql } from "../config/db.js";
import bcrypt from "bcrypt";


export const getShops = async (req, res) => {
    try {
        const shops = await sql`
        SELECT * FROM shops
        ORDER BY created_at DESC
        `;

        // console.log("--> fetched shops", shops);
        res.status(200).json({ success: true, data: shops });
    } catch (error) {
        // console.log("->> Error in getShops function", error);
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

        // console.log("--> New shop created", newShop);
        res.status(201).json({ success: true, data: newShop[0] });
    } catch (error) {
        // console.error("->> Error creating shop", error);
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
        // console.log("->> Error in getShop function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export const updateShopInfo = async (req, res) => {
  const { id } = req.params;
  const { shop_name, email, city } = req.body;

  if (!shop_name || !email || !city) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const result = await sql`
      UPDATE shops
      SET shop_name = ${shop_name},
          email = ${email},
          city = ${city},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    // console.error("->> updateShopInfo error", err);
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updateShopPassword = async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const result = await sql`SELECT password_hash FROM shops WHERE id = ${id}`;
    if (!result.length) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const isMatch = await bcrypt.compare(current_password, result[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await sql`
      UPDATE shops
      SET password_hash = ${newHash},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}`;

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    // console.error("->> updateShopPassword error", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
        // console.log("--> Deleted shop", deletedShop);
        res.status(200).json({ success: true, data: deletedShop[0] });
    } catch (error) {
        // console.log("->> Error in deleteShop function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
