import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((e) => ({ field: 'path' in e ? e.path : 'unknown', message: e.msg as string }));
      res.status(422).json({
        success: false,
        message: errors[0].message,
        errors,
      });
      return;
    }
    next();
  };
};
