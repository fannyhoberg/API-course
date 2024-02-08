import Debug from "debug";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/Token_types";
import { extractAndValidateAuthHeader } from "../../helpers/auth_helper";

// Create a new debug instance
const debug = Debug("prisma-books:jwt");

export const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Hello from auth/jwt! 🙋🏽");
  let token: string; // ful-hack med tom sträng men för enkelhetens skull
  try {
    token = extractAndValidateAuthHeader(req, "Bearer");
  } catch (err) {
    if (err instanceof Error) {
      return res.status(401).send({ status: "fail", message: err.message });
    }
    return res
      .status(401)
      .send({ status: "fail", message: "Unknown authorization" });
  }

  // 4. Verify token and attach payload to request, otherwise bail 🛑
  if (!process.env.ACCESS_TOKEN_SECRET) {
    debug("ACCESS_TOKEN_SECRET missing in environment");
    return res
      .status(500)
      .send({ status: "error", message: "No access token secret defined" });
  }
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJTZWFuIEJhbmFuIiwiZW1haWwiOiJzZWFuQGJhbmFuLnNlIiwiaWF0IjoxNzA3MTMwMjQyfQ.0vyrKDgYOtPfqXdfK1FUdbrqzqI2-WzLn_cbHocWWiA"
  try {
    // Verify token
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as unknown as JwtPayload;
    // debug("Payload: %O", payload);

    // Attach token payload to request
    req.token = payload;
  } catch (err) {
    debug("JWT Verify failed: %O", err);
    return res
      .status(401)
      .send({ status: "fail", message: "Authorization required" });
  }

  // 5. Profit 💰🤑
  next();
};
