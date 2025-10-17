import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HTTPResponse } from "../libs/http";
import { JwtPayload, verifyToken } from "../libs/jwt";
import { getUserById } from "../repositories/user-repository";

export const mustAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const response = new HTTPResponse<never>();
  const token = parseBearerToken(req.headers.authorization);
  if (!token)
    return response.withCode(401).withMessage("Unauthorized").finalize(res);

  try {
    const payload: JwtPayload = verifyToken(token);
    const user = await getUserById(payload.sub);
    if (!user)
      return response
        .withCode(401)
        .withMessage("Unauthorized: user not found")
        .finalize(res);

    req.user = user;

    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return response.withCode(401).withMessage("Token expired").finalize(res);
    }
    if (err instanceof JsonWebTokenError)
      return response.withCode(401).withMessage("Invalid token").finalize(res);
    return next(err);
  }
};

const parseBearerToken = (authorization: string): string => {
  if (!authorization) return null;

  const candidate = authorization.split(" ");
  if (candidate.length !== 2) return null;

  const [bearer, token] = candidate;
  if (bearer !== "Bearer") return null;

  return token;
};
