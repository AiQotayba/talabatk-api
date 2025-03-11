import type { Request, Response, NextFunction } from "express"
import * as productService from "../services/productService"

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts()
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
}

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryId)
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id)
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body)
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id)
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

