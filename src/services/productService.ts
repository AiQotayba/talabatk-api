import Product, { type IProduct } from "../models/Product"
import { NotFoundError } from "../utils/errors"
import * as categoryService from "./categoryService"

export const getAllProducts = async (): Promise<IProduct[]> => {
  return Product.find().sort({ name: 1 }).populate("category")
}

export const getProductsByCategory = async (categoryId: string): Promise<IProduct[]> => {
  return Product.find({ category: categoryId }).sort({ name: 1 }).populate("category")
}

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id).populate("category")

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`)
  }

  return product
}

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const { name, description, price, image, category } = productData

  const product = new Product({
    name,
    description,
    price,
    image,
    category,
  })

  const savedProduct = await product.save()

  // Update category options count
  await categoryService.incrementCategoryOptionsCount(category as unknown as string)

  return savedProduct.populate("category")
}

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
  const { name, description, price, image, category } = productData

  // Check if product exists and get current category
  const currentProduct = await getProductById(id)

  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price, image, category },
    { new: true, runValidators: true },
  ).populate("category")

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`)
  }

  // If category changed, update counts
  if (category && currentProduct.category.toString() !== category.toString()) {
    await categoryService.decrementCategoryOptionsCount(currentProduct.category.toString())
    await categoryService.incrementCategoryOptionsCount(category as unknown as string)
  }

  return product
}

export const deleteProduct = async (id: string): Promise<void> => {
  // Check if product exists and get current category
  const product = await getProductById(id)

  await Product.findByIdAndDelete(id)

  // Update category options count
  await categoryService.decrementCategoryOptionsCount(product.category.toString())
}

