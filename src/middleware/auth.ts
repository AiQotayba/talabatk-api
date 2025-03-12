import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../utils/errors"
import User from "../models/User"

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided")
    }

    const token = authHeader.split(" ")[1]

    if (!token) throw new UnauthorizedError("No token provided")

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    // Check if user exists
    const user = await User.findOne({ email: decoded.email }).select("-password")

    if (!user) throw new UnauthorizedError("User not found")

    // Add user from payload to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"))
    } else {
      next(error)
    }
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"))
    }

    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError("Not authorized to access this resource"))
    }

    next()
  }
}

