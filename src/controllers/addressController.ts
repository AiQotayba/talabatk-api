import type { Request, Response, NextFunction } from "express"
import * as addressService from "../services/addressService"

export const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getAddressesByUser(req.user.id)
    res.status(200).json({ success: true, data: addresses })
  } catch (error) {
    next(error)
  }
}

export const getAddressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.getAddressById(req.params.id, req.user.id)
    res.status(200).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
}

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, phone, is_default } = req.body

    const newAddress = await addressService.createAddress(req.user.id, address, phone, is_default)

    res.status(201).json({ success: true, data: newAddress })
  } catch (error) {
    next(error)
  }
}

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.updateAddress(req.params.id, req.user.id, req.body)

    res.status(200).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id)
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

