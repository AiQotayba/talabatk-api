import { Router } from "express"
import { body } from "express-validator"
import * as addressController from "../controllers/addressController"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get my addresses
router.get("/", authenticate, addressController.getMyAddresses)

// Get address by ID
router.get("/:id", authenticate, addressController.getAddressById)

// Create address
router.post(
  "/",
  authenticate,
  validate([
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
  ]),
  addressController.createAddress,
)

// Update address
router.put(
  "/:id",
  authenticate,
  validate([
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
  ]),
  addressController.updateAddress,
)

// Delete address
router.delete("/:id", authenticate, addressController.deleteAddress)

export default router

