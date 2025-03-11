import jwt from "jsonwebtoken"
import User, { type IUser, UserRole } from "../models/User"
import type { UserResponse } from "../models/types"
import { NotFoundError, BadRequestError, UnauthorizedError } from "../utils/errors"

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email })
}

export const findUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id)

  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`)
  }

  return user
}

export const createUser = async (
  email: string,
  password: string,
  name?: string,
  phone?: string,
  role: UserRole = UserRole.USER,
): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new BadRequestError("Email already in use")
  }

  // Create user
  const user = new User({
    email,
    password, // Will be hashed by the pre-save hook
    name,
    phone,
    role,
  })

  await user.save()

  // Return user without password
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export const validateCredentials = async (email: string, password: string): Promise<IUser> => {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new UnauthorizedError("Invalid credentials")
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials")
  }

  return user
}

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" } as jwt.SignOptions,
  )
}

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; phone?: string },
): Promise<UserResponse> => {
  const user = await findUserById(userId)

  // Update user
  const { name, phone } = updates

  if (name) user.name = name
  if (phone) user.phone = phone

  await user.save()

  // Return user without password
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await findUserById(userId)

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword)

  if (!isPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect")
  }

  // Update password
  user.password = newPassword // Will be hashed by the pre-save hook
  await user.save()
}

export const updateUserRole = async (userId: string, role: UserRole): Promise<UserResponse> => {
  const user = await findUserById(userId)

  // Update role
  user.role = role
  await user.save()

  // Return user without password
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await User.find().sort({ createdAt: -1 })

  // Remove passwords from results
  return users.map((user: any) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }))
}

