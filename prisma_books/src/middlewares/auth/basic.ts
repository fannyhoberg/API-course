/**
 * HTTP Basic Authentication Middleware
 */

import Debug from "debug";
import { Request, Response, NextFunction } from "express";

const debug = Debug("prisma-books:basic");

export const basic = (req: Request, res: Response, next: NextFunction) => {
  debug("Hello from auth/basic");
  next();
};
