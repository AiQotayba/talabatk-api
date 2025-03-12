import type { Request, Response, NextFunction } from "express"; 
import { CustomError } from "../utils/errors";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    error: "Server Error",
  });
};

export default errorHandler;