// routes/discountRoute.js
import express from 'express';
import {
    addDiscount,
    getDiscounts
} from '../controllers/discountController.js';

const router = express.Router();

// Create a new discount
router.post('/', addDiscount);

// Get all discounts with filters
router.get('/', getDiscounts);

export default router;
