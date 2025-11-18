import express from 'express';
import destinationsController from '../controllers/destinationsController.js';

const router = express.Router();

router.get('/', destinationsController.getAllDestinations);
router.get('/search', destinationsController.searchDestinations);

export default router;