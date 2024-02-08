/**
 * Autentication helpers
 */
import Debug from "debug";
import { Request } from "express";

const debug = Debug("prisma_books:auth_helper");

// Type definition for the allowed autenthicaton schemas/types
type AuthType = "Basic" | "Bearer"; // detta är en sk Union Type

export const extractAndValidateAuthHeader = (
  req: Request,
  expectedType: AuthType
) => {
  // 1. Make sure Authorization header exists, otherwise bail 🛑
  if (!req.headers.authorization) {
    debug("Authorization header missing");
    throw new Error("Authorization header missing");
  }

  // 2. Split Authorization header on ` `
  // "Bearer <token>" mellanslag mellan Bearer och token
  const [authSchema, payload] = req.headers.authorization.split(" ");

  // 3. Check that Authorization scheme is "bearer", otherwise bail 🛑
  if (authSchema !== expectedType) {
    debug("Authorization schema isn't expected type %s ", expectedType);
    throw new Error(`Exprected ${expectedType} authentication`);
  }
  return payload;
};
