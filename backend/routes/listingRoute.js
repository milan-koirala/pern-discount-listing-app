import express from 'express';
import { createListing, getAllListings } from '../controllers/listingController.js';

const router = express.Router();

router.get("/", getAllListings);
router.post("/", createListing);

export default router;
