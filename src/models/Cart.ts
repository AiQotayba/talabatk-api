import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  name: string
  price: number
  image?: string
  quantity: number
  extras?: any
  size?: any
  createdAt: Date
  updatedAt: Date
}

const cartItemSchema = new Schema<ICartItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    extras: {
      type: Schema.Types.Mixed,
    },
    size: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ICartItem>("CartItem", cartItemSchema)

