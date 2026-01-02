/**
 * @file        ratingRoutes.js
 * @description Routes for rating API endpoints
 * 
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-12-30
 */

import express from "express";
import ratingController from "../controllers/ratingController.js";

const router = express.Router();

router.get("/approved", ratingController.getAllApprovedRatings);

router.post("/", ratingController.createRating);

export default router;