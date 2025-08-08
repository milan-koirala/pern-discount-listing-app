import express from "express";
import { addDiscount, getDiscounts, getDiscountById, getDiscountsByShopId  } from "../controllers/discountController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getDiscounts);
router.get("/my", verifyToken, getDiscountsByShopId);
router.post("/add", verifyToken, addDiscount);
router.get("/:id", verifyToken, getDiscountById);


export default router;
