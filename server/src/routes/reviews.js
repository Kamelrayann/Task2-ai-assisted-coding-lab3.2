import { Router } from 'express';

import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = Router();

router.post('/', createReview);
router.get('/', getAllReviews);

router.get('/summary', getReviewSummary);

router.get('/:id', getReview);

export default router;
