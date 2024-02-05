/**
 * HTTP Basic Authentication Middleware
 */
import Debug from "debug";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../../types/Token_types";

// Create a new debug instance
const debug = Debug("prisma-books:jwt");

// const jwt = require("jsonwebtoken");

export const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Hello from auth/jwt! 🙋🏽");

  // 1. Make sure Authorization header exists, otherwise bail 🛑
  if (!req.headers.authorization) {
    debug("Authorization header missing");
    return res
      .status(401)
      .send({ status: "fail", message: "Authorization required" });
  }

  // 2. Split Authorization header on ` `
  // "Bearer <token>"
  debug("Authorization header: %o", req.headers.authorization);
  const [authSchema, token] = req.headers.authorization.split(" ");

  // 3. Check that Authorization scheme is "Basic", otherwise bail 🛑
  if (authSchema.toLowerCase() !== "bearer") {
    debug("Authorization schema isn't bearer");
    return res

      .status(401)
      .send({ status: "fail", message: "Authorization required" });
  }

  /**
   *
   * skapa funktion av steg 1-3
   *
   * const extractAuthHeaderPayload = (req, schema: string) => {
   * }
   * extractAuthHeaderPayload(req, "bearer");
   */

  // 4. Verify token and attach payload to request, otherwise bail

  try {
    // Verify token

    if (!process.env.ACCESS_TOKEN_SECRET) {
      debug("ACCESS_TOKEN_SECRET missing in environment");
      return res
        .status(500)
        .send({ status: "error", message: "No access token secret defined" });
    }

    const verifyToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as unknown as JwtPayload;

    debug("Password for user was correct");

    // Attach token payload to request

    req.token = verifyToken;

    // res.send(verifyToken);
  } catch (error) {
    debug("Jwt verify fail", error);

    return res.status(401).send({ status: "fail", message: "Jwt verify fail" });
  }

  // 5. Profit 💰🤑
  next();
};
