export class CustomError extends Error {
  statusCode: number
  errors: any[]

  constructor(message: string, statusCode = 500, errors: any[] = []) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad request", errors: any[] = []) {
    super(message, 400, errors)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Resource not found", errors: any[] = []) {
    super(message, 404, errors)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized", errors: any[] = []) {
    super(message, 401, errors)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden", errors: any[] = []) {
    super(message, 403, errors)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

