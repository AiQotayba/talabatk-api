import Category, { type ICategory } from "../models/Category"
import { NotFoundError } from "../utils/errors"

export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find().sort({ name: 1 })
}

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findById(id)

  if (!category) {
    throw new NotFoundError(`Category with ID ${id} not found`)
  }

  return category
}

export const createCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  const { name, image } = categoryData

  const category = new Category({
    name,
    image,
    optionsCount: 0,
  })

  return category.save()
}

export const updateCategory = async (id: string, categoryData: Partial<ICategory>): Promise<ICategory> => {
  const { name, image } = categoryData

  // Check if category exists
  await getCategoryById(id)

  const category = await Category.findByIdAndUpdate(id, { name, image }, { new: true, runValidators: true })

  if (!category) {
    throw new NotFoundError(`Category with ID ${id} not found`)
  }

  return category
}

export const deleteCategory = async (id: string): Promise<void> => {
  // Check if category exists
  await getCategoryById(id)

  await Category.findByIdAndDelete(id)
}

export const incrementCategoryOptionsCount = async (id: string): Promise<void> => {
  await Category.findByIdAndUpdate(id, { $inc: { optionsCount: 1 } })
}

export const decrementCategoryOptionsCount = async (id: string): Promise<void> => {
  await Category.findByIdAndUpdate(id, { $inc: { optionsCount: -1 } })
}

