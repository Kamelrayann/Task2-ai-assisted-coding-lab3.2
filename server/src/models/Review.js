import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    facilityCode: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  { facilityCode: 1, reviewedBy: 1 },
  { unique: true }
);

export const Review = mongoose.model('Review', reviewSchema);