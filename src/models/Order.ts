import mongoose, { type Document, Schema } from "mongoose"

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  quantity: number
  price: number
  extras?: any
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  address: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: OrderStatus
  statusHistory: {
    status: OrderStatus
    notes?: string
    timestamp: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  extras: {
    type: Schema.Types.Mixed,
  },
})

const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  notes: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IOrder>("Order", orderSchema)

