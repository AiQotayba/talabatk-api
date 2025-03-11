import type { Request, Response, NextFunction } from "express"
import * as cartService from "../services/cartService"
import * as productService from "../services/productService"
import { BadRequestError } from "../utils/errors"

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItems = await cartService.getCartItems(req.user.id)

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        total,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity, extras, size } = req.body

    if (!productId || !quantity || quantity <= 0) {
      throw new BadRequestError("Product ID and quantity are required")
    }

    // Get product details
    const product = await productService.getProductById(productId)

    const cartItem = await cartService.addToCart(
      req.user.id,
      productId,
      product.name,
      product.price,
      quantity,
      product.image,
      extras,
      size,
    )

    res.status(201).json({ success: true, data: cartItem })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body

    if (quantity === undefined) {
      throw new BadRequestError("Quantity is required")
    }

    const cartItem = await cartService.updateCartItem(req.params.id, req.user.id, quantity)

    res.status(200).json({ success: true, data: cartItem })
  } catch (error) {
    next(error)
  }
}

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.removeFromCart(req.params.id, req.user.id)
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.clearCart(req.user.id)
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

