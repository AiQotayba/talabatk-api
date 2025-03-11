import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  name: string
  image?: string
  optionsCount: number
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    optionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ICategory>("Category", categorySchema)

