import type { Request, Response, NextFunction } from "express"
import { validationResult, type ValidationChain } from "express-validator"
import { BadRequestError } from "../utils/errors"

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)))

    // Check for validation errors
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return next(new BadRequestError("Validation error", errors.array()))
    }

    next()
  }
}

