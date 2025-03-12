import type { Request, Response, NextFunction } from "express"
import * as userService from "../services/userService"
import { BadRequestError } from "../utils/errors"

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone } = req.body

    if (!email || !password) {
      throw new BadRequestError("Email and password are required")
    }

    // Create user
    const user = await userService.createUser(email, password, name, phone)

    // Generate token
    const token = userService.generateToken({ ...user, password: "" } as any)

    res.status(201).json({
      success: true,
      data: {
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError("Email and password are required")
    }

    // Validate credentials
    const user: any = await userService.validateCredentials(email, password)
    console.log(user)

    // Generate token
    const token = userService.generateToken(user)

    // Return user without password
    const { password: _, ...userResponse } = user?._doc
    console.log(userResponse?._doc)

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = await userService.findUserById(req.user.id)

    // Return user without password
    const { password: _, ...userResponse } = user

    res.status(200).json({
      success: true,
      data: userResponse?._doc || userResponse,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone } = req.body

    const updatedUser = await userService.updateUserProfile(req.user.id, { name, phone })

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new BadRequestError("Current password and new password are required")
    }

    await userService.changePassword(req.user.id, currentPassword, newPassword)

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    next(error)
  }
}

