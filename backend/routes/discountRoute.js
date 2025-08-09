import express from "express";
import { addDiscount, deleteDiscount, getDiscounts, getDiscountById, getDiscountsByShopId, updateDiscount  } from "../controllers/discountController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getDiscounts);
router.get("/my", verifyToken, getDiscountsByShopId);
router.post("/add", verifyToken, addDiscount);
router.get("/:id", verifyToken, getDiscountById);
router.put("/:id", verifyToken, updateDiscount);
router.delete("/:id", verifyToken, deleteDiscount);


export default router;
