/**
 * type för express regler
 *
 */

import { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
