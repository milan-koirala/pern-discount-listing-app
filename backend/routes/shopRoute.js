import express from 'express';
import {
    createShop,
    deleteShop,
    getShop,
    getShops,
    updateShopInfo,
    updateShopPassword,
} from '../controllers/shopController.js';

const router = express.Router();

router.get("/", getShops);
router.get("/:id", getShop);
router.post("/register", createShop);
router.put("/:id/info", updateShopInfo);
router.put("/:id/password", updateShopPassword);
router.delete("/:id", deleteShop);

export default router;
