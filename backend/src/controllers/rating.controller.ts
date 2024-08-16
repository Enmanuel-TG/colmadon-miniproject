import { Request, Response } from 'express';
import { prisma } from '../utilities/prisma.utility';
import getTokenId from '../utilities/get-token-id.utility';

export const getRatingAverage = async (req: Request, res: Response) => {
  const { sellerId } = req.body;
  try {
    const rating = await prisma.rating.aggregate({
      where: {
        sellerId,
      },
      _avg: {
        rate: true,
      },
      _count: {
        rate: true,
      },
    });
    return res.status(200).json({
      average: Math.round(rating._avg.rate ?? 0),
      count: rating._count.rate ?? 0,
    });
  } catch (error: any) {
    return res.status(400).json(error.errors.map((error: { message: any }) => error.message));
  }
};

export const createOrUpdateRating = async (req: Request, res: Response) => {
  try {
    const { rate, sellerId } = req.body;
    const reviewerId = getTokenId(req);
    if (reviewerId === sellerId) {
      return res.status(400).json(['You cannot rate yourself.']);
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        sellerId,
        reviewerId,
      },
    });
    if (existingRating) {
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rate,
        },
      });
      return res.status(200).json(updatedRating);
    } else {
      const newRating = await prisma.rating.create({
        data: {
          rate,
          reviewerId,
          sellerId,
        },
      });
      return res.status(201).json(newRating);
    }
  } catch (error: any) {
    return res.status(400).json(error.errors.map((error: { message: any }) => error.message));
  }
};
