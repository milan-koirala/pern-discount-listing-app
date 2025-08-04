import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("--> Cookie token:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded); // Debug log
    req.shop = { id: decoded.shop_id, shop_name: decoded.shop_name };
    return next();
  } catch (err) {
    console.error("->> Token error:", err);
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

export const verifyTokenOptional = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("->> Decoded JWT payload (optional):", decoded); // Debug log
      req.shop = { id: decoded.shop_id, shop_name: decoded.shop_name };
    } catch {
      // do nothing
    }
  }
  return next();
};