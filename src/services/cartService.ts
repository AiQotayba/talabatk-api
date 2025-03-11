import Cart, { type ICartItem } from "../models/Cart"
import { NotFoundError } from "../utils/errors"

export const getCartItems = async (userId: string): Promise<ICartItem[]> => {
  return Cart.find({ user: userId }).sort({ createdAt: 1 }).populate("product")
}

export const addToCart = async (
  userId: string,
  productId: string,
  name: string,
  price: number,
  quantity: number,
  image?: string,
  extras?: any,
  size?: any,
): Promise<ICartItem> => {
  // Check if item already exists in cart
  const existingItem = await Cart.findOne({
    user: userId,
    product: productId,
    extras: extras || {},
    size: size || {},
  })

  if (existingItem) {
    // Update quantity
    existingItem.quantity += quantity
    return existingItem.save()
  } else {
    // Add new item
    const cartItem = new Cart({
      user: userId,
      product: productId,
      name,
      price,
      image,
      quantity,
      extras: extras || {},
      size: size || {},
    })

    return cartItem.save()
  }
}

export const updateCartItem = async (id: string, userId: string, quantity: number): Promise<any> => {
  // Check if item exists
  const cartItem = await Cart.findOne({ _id: id, user: userId })

  if (!cartItem) {
    throw new NotFoundError(`Cart item with ID ${id} not found`)
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    await Cart.findByIdAndDelete(id)
    return { ...cartItem.toObject(), quantity: 0 }
  } else {
    // Update quantity
    cartItem.quantity = quantity
    return cartItem.save()
  }
}

export const removeFromCart = async (id: string, userId: string): Promise<void> => {
  // Check if item exists
  const cartItem = await Cart.findOne({ _id: id, user: userId })

  if (!cartItem) {
    throw new NotFoundError(`Cart item with ID ${id} not found`)
  }

  await Cart.findByIdAndDelete(id)
}

export const clearCart = async (userId: string): Promise<void> => {
  await Cart.deleteMany({ user: userId })
}

