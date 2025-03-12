# Talabatk API: Backend Technical Stack

## Project Overview

Talabatk is a food ordering platform API built with Express.js and MongoDB. The API provides endpoints for managing users, categories, products, orders, cart, and delivery addresses. It implements a comprehensive authentication and authorization system using JWT tokens.

## Technology Stack

### Core Technologies

- **Language**: TypeScript (Node.js runtime)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful

### Dependencies

- **express**: Web server framework
- **mongoose**: MongoDB object modeling tool
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT implementation
- **express-validator**: Request validation
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express-rate-limit**: Rate limiting protection

### Development Dependencies

- **typescript**: TypeScript compiler
- **nodemon**: Development server with hot reload
- **ts-node**: TypeScript execution environment
- **eslint**: Code linting
- **jest**: Testing framework

## Architecture

The application follows a structured, layered architecture:

1. **Routes Layer**: Defines API endpoints and connects them to controllers
2. **Controller Layer**: Handles HTTP requests and responses
3. **Service Layer**: Contains business logic
4. **Data Access Layer**: Interacts with the database using Mongoose models
5. **Middleware Layer**: Cross-cutting concerns like authentication, validation, error handling

###  Database Structure

## MongoDB Database Design

The Talabatk API uses MongoDB as its database, with Mongoose as the ODM (Object Document Mapper). This document details the collections, schemas, relationships, and indexes used in the database.

## Collections Overview

The database consists of the following collections:

1. **users**: User accounts and authentication information
2. **categories**: Food categories
3. **products**: Food items available for ordering
4. **orders**: Customer orders with items and status
5. **addresses**: Delivery addresses for users
6. **cartItems**: Items in users' shopping carts

## Schema Definitions

### Users Collection

Stores user accounts, credentials, and roles.

```typescript 
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
  id: any
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

```

# Talabatk API: Endpoints List

Below is a comprehensive list of all API endpoints in the Talabatk food ordering platform. All endpoints are prefixed with `/api`.

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login with email and password | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| POST | `/auth/change-password` | Change user password | Yes |

## User Management Endpoints (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | Yes (Admin) |
| GET | `/users/:id` | Get user by ID | Yes (Admin) |
| POST | `/users` | Create a new user | Yes (Admin) |
| PATCH | `/users/:id/role` | Update user role | Yes (Admin) |

## Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/categories` | Get all categories | No |
| GET | `/categories/:id` | Get category by ID | No |
| POST | `/categories` | Create a new category | Yes (Admin) |
| PUT | `/categories/:id` | Update a category | Yes (Admin) |
| DELETE | `/categories/:id` | Delete a category | Yes (Admin) |

## Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/products` | Get all products | No |
| GET | `/products/category/:categoryId` | Get products by category | No |
| GET | `/products/:id` | Get product by ID | No |
| POST | `/products` | Create a new product | Yes (Admin) |
| PUT | `/products/:id` | Update a product | Yes (Admin) |
| DELETE | `/products/:id` | Delete a product | Yes (Admin) |

## Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/orders/my-orders` | Get current user's orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |
| POST | `/orders` | Create a new order | Yes |
| PATCH | `/orders/:id/status` | Update order status | Yes (Admin) |

## Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/cart` | Get current user's cart | Yes |
| POST | `/cart` | Add item to cart | Yes |
| PATCH | `/cart/:id` | Update cart item quantity | Yes |
| DELETE | `/cart/:id` | Remove item from cart | Yes |
| DELETE | `/cart` | Clear entire cart | Yes |

## Address Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/addresses` | Get current user's addresses | Yes |
| GET | `/addresses/:id` | Get address by ID | Yes |
| POST | `/addresses` | Create a new address | Yes |
| PUT | `/addresses/:id` | Update an address | Yes |
| DELETE | `/addresses/:id` | Delete an address | Yes |

## Authentication Roles

- **User**: Regular customer who can place orders
- **Admin**: Has full access to all endpoints and can manage users, products, categories, and orders
- **Delivery**: Special role for delivery personnel (limited functionality in current API)

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Error Responses

```json
{
  "success": false,
  "error": "Bad Request",
  "errors": {
    "email": "Email is required"
  }
}
```
