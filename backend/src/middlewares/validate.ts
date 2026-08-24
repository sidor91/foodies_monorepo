import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
