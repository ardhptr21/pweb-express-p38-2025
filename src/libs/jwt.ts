import jwt from "jsonwebtoken";

export interface JwtPayload extends jwt.JwtPayload {
  sub: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "pleasechange";

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "3d",
    issuer: "pemweb-it-p38",
  });
  return token;
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: "pemweb-it-p38",
  }) as JwtPayload;
  return decoded;
};
