import Joi from 'joi';
import { Review } from '../models/Review.js';

const reviewSchema = Joi.object({
  facilityCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: Joi.string().allow('', null),
});

export async function createReview(req, res, next) {
  try {
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const review = await Review.create(value);

    return res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();

    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    return res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;

    if (!facilityCode) {
      return res.status(400).json({
        message: 'facilityCode is required',
      });
    }

    const result = await Review.aggregate([
      {
        $match: {
          facilityCode,
        },
      },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: {
            $avg: '$rating',
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    return res.status(200).json({
      facilityCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) {
    next(err);
  }
}