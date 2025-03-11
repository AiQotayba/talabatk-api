import type { Request, Response, NextFunction } from "express"
import * as userService from "../services/userService"
import { BadRequestError } from "../utils/errors"
import { UserRole } from "../models/types"

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers()

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findUserById(req.params.id)

    // Return user without password
    const { password: _, ...userResponse } = user

    res.status(200).json({
      success: true,
      data: userResponse,
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, role } = req.body

    if (!email || !password) {
      throw new BadRequestError("Email and password are required")
    }

    if (role && !Object.values(UserRole).includes(role)) {
      throw new BadRequestError("Invalid role")
    }

    // Create user
    const user = await userService.createUser(email, password, name, phone, role || UserRole.USER)

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body

    if (!role || !Object.values(UserRole).includes(role)) {
      throw new BadRequestError("Valid role is required")
    }

    const updatedUser = await userService.updateUserRole(req.params.id, role)

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

