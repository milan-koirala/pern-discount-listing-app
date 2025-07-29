import express from 'express';
import { createShop, deleteShop, getShop, getShops, updateShop } from '../controllers/shopController.js';

const router = express.Router();

router.get("/", getShops);
router.get("/:id", getShop);
router.post("/", createShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;
