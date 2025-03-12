import { IUser } from "./User"
import { ICategory } from "./Category"
import { IProduct } from "./Product"
import { IAddress } from "./Address"
import { IOrder, IOrderItem, OrderStatus } from "./Order"
import { ICartItem } from "./Cart"

export { OrderStatus, IUser, ICategory, IProduct, IAddress, IOrder, IOrderItem, ICartItem }

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  DELIVERY = "delivery",
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  password: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface UserResponse {
  id?: any
  email: string
  name?: string
  phone?: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  image?: string
  options_count: number
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category_id: string
  created_at: Date
  updated_at: Date
}

export interface Address {
  id: string
  user_id: string
  address: string
  phone: string
  is_default: boolean
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  user_id: string
  address_id: string
  total_amount: number
  status: OrderStatus
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  extras?: any
  created_at: Date
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  notes?: string
  created_at: Date
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  name: string
  price: number
  image?: string
  quantity: number
  extras?: any
  size?: any
  created_at: Date
  updated_at: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  phone?: string
}

export interface AuthResponse {
  user: UserResponse
  token: string
}

