import {
  loginValidator,
  registerValidator,
} from "../validators/auth-validator";
import z from "zod";

export type RegisterRequest = z.infer<typeof registerValidator>;
export type LoginRequest = z.infer<typeof loginValidator>;

export type RegisterResponse = {
  id: string;
  email: string;
  created_at: Date;
};

export type LoginResponse = {
  access_token: string;
};

export type GetMeResponse = {
  id: string;
  username: string;
  email: string;
};
