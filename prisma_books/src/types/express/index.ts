/**
 * type för express regler
 *
 */

import { User } from "@prisma/client";
import { JwtPayload } from "../Token_types";

declare global {
  namespace Express {
    export interface Request {
      token?: JwtPayload;
      user?: User;
    }
  }
}
