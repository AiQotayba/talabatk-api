import { type Request, type Response, NextFunction } from "express"
import * as orderService from "../services/orderService"
import { OrderStatus } from "../models/Order"

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id)
    res.status(200).json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id)

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this order' })
    }

    // Order items and status history are already included in the order object
    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId, items } = req.body

    const order = await orderService.createOrder(req.user.id, addressId, items)
    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body

    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' })
    }

    const order = await orderService.updateOrderStatus(req.params.id, status, notes)
    res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}
