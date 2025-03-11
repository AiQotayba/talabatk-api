import { Router } from "express"
import categoryRoutes from "./categoryRoutes"
import productRoutes from "./productRoutes"
import orderRoutes from "./orderRoutes"
import cartRoutes from "./cartRoutes"
import addressRoutes from "./addressRoutes"
import authRoutes from "./authRoutes"
import userRoutes from "./userRoutes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/categories", categoryRoutes)
router.use("/products", productRoutes)
router.use("/orders", orderRoutes)
router.use("/cart", cartRoutes)
router.use("/addresses", addressRoutes)

export default router

