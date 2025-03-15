import Order, { type IOrder, OrderStatus } from "../models/Order"
import { NotFoundError } from "../utils/errors"
import * as cartService from "./cartService"

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "-password")
    .populate("address")
    .populate({
      path: "items.product",
      model: "Product",
    })
}

export const getOrderById = async (id: string): Promise<IOrder> => {
  const order = await Order.findById(id).populate("user", "-password").populate("address").populate({
    path: "items.product",
    model: "Product",
  })

  if (!order) {
    throw new NotFoundError(`Order with ID ${id} not found`)
  }

  return order
}

export const createOrder = async (
  userId: string,
  addressId: string,
  items: Array<{ productId: string; quantity: number; price: number; extras?: any }>,
): Promise<IOrder> => {
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Create order
  const orderNew: any = Order.create({
    user: userId,
    address: addressId,
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      extras: item.extras,
    })),
    totalAmount,
    status: OrderStatus.PENDING,
    statusHistory: [
      {
        status: OrderStatus.PENDING,
        timestamp: new Date(),
      },
    ],
  })

  // Clear cart items
  await cartService.clearCart(userId)

  const order: any = await Order.findOne(
    { _id: orderNew._id },
    { new: true, runValidators: true })
    .populate([{ path: "user", select: "-password" }, { path: "address" }, { path: "items.product", model: "Product" }])

  return order
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<IOrder> => {
  // Check if order exists
  const order = await getOrderById(orderId)

  // Update order status
  order.status = status

  // Add to status history
  order.statusHistory.push({
    status,
    notes,
    timestamp: new Date(),
  })

  await order.save()

  return order
}

export const getAllOrders = async (): Promise<IOrder[]> => {
  return Order.find().sort({ createdAt: -1 }).populate("user", "-password").populate("address").populate({
    path: "items.product",
    model: "Product",
  })
}

