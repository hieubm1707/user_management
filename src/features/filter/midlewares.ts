import { Request, Response, NextFunction } from 'express';

interface JoiError extends Error {
  joi: {
    details: Array<{ message: string }>;
  };
}

export const errorMiddleware = (
  err: JoiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ('joi' in err && err.joi) {
    const errorMessage = err.joi.details.map(d => d.message).join(', ');
    console.error(`Validation error: ${errorMessage}`);
    return res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.error(`Unhandled error: ${errorMessage}`);
  return res.status(500).json({
    success: false,
    error: errorMessage,
  });
};