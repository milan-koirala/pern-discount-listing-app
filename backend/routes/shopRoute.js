import express from 'express';
import { createShop, deleteShop, getShop, getShops, loginShop, updateShop } from '../controllers/shopController.js';

const router = express.Router();

router.get("/", getShops);
router.get("/:id", getShop);
router.post("/register", createShop);
router.post("/login", loginShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;
