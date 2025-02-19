import { prisma } from '../utilities/prisma.utility';
import { Response, Request } from 'express';
import getTokenId from '../utilities/get-token-id.utility.ts';
import { PHOTOS_PRODUCT_FOLDER } from '../utilities/consts.utility.ts';
import { UploadedFile } from 'express-fileupload';
import uploadedPhotos from '../utilities/uploaded-photo.utility.ts';

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, location, state, category, stock } = req.body;
  const id = getTokenId(req);
  const photos = req.files?.photos;
  if (!photos) {
    return res.status(400).json({ message: 'No photo uploaded.' });
  }
  if (Array.isArray(photos) && photos.length > 10) {
    return res.status(400).json(['You can only upload up to 10 photos.']);
  }
  const images: string[] = await uploadedPhotos(photos as UploadedFile, PHOTOS_PRODUCT_FOLDER);
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        location,
        state,
        category,
        stock: parseInt(stock),
        photos: images,
        userId: id,
      },
    });
    return res.status(200).json({
      message: 'Product created successfully.',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        location: product.location,
        state: product.state,
        category: product.category,
        stock: product.stock,
        photo: product.photos,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error to create product.',
      error: error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      message: 'Product deleted successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error to delete product.',
      error,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, location, state, category, stock } = req.body;
  const photos = req.files?.photos;
  if (!photos) {
    return res.status(400).json(['No photo uploaded.']);
  }
  if (Array.isArray(photos) && photos.length > 10) {
    return res.status(400).json(['You can only upload up to 10 photos.']);
  }
  const images: string[] = await uploadedPhotos(photos as UploadedFile, PHOTOS_PRODUCT_FOLDER);
  try {
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        price,
        description,
        location,
        state,
        category,
        stock: parseInt(stock),
        photos: images,
      },
    });
    return res.status(200).json({
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error to update product.',
      error,
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: 'Error to get product.',
      error,
    });
  }
};

export const getAllUserProduct = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: getTokenId(req),
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Error to get products.',
      error,
    });
  }
};
export const getAllProduct = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Error to get products.',
      error,
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.body;
  try {
    const products = await prisma.product.findMany({
      where: {
        category: category,
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    if (products.length === 0) {
      return res.status(404).json(['No products in this category.']);
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            location: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    if (products.length === 0) {
      return res.status(404).json(['No products found.']);
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  const { stock, id } = req.body;
  try {
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        stock: parseInt(stock),
      },
    });
    return res.status(200).json({
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error to update product.',
      error,
    });
  }
};
