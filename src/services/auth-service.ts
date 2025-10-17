import {
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../domains/auth-domain";
import { HTTPResponse } from "../libs/http";
import {
  createUserFromRegister,
  getUserByEmail,
  getUserById,
  userExistsByEmailOrUsername,
} from "../repositories/user-repository";
import bcrypt from "bcrypt";
import { generateToken } from "../libs/jwt";

export const register = async (
  body: RegisterRequest,
): Promise<HTTPResponse<RegisterResponse>> => {
  const res = new HTTPResponse<RegisterResponse>();
  try {
    const exists = await userExistsByEmailOrUsername(body.email, body.username);
    if (exists) {
      res.withCode(409).withMessage("Username or email already exists");
      return res;
    }

    const { id, email, createdAt } = await createUserFromRegister({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });

    return res
      .withCode(201)
      .withMessage("User registered successfully")
      .withData({ id, email, created_at: createdAt });
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};
export const login = async (
  body: LoginRequest,
): Promise<HTTPResponse<LoginResponse>> => {
  const res = new HTTPResponse<LoginResponse>();
  try {
    const user = await getUserByEmail(body.email);
    if (!user) return res.withCode(401).withMessage("Invalid credentials");

    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) return res.withCode(401).withMessage("Invalid credentials");

    const access_token = generateToken({
      email: user.email,
      sub: user.id,
    });

    return res
      .withCode(200)
      .withMessage("Login successfully")
      .withData({ access_token });
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};
export const getMe = async (
  userId: string,
): Promise<HTTPResponse<GetMeResponse>> => {
  const res = new HTTPResponse<GetMeResponse>();
  try {
    const user = await getUserById(userId);
    if (!user) return res.withCode(404).withMessage("User not found");

    return res
      .withCode(200)
      .withMessage("User retrieved successfully")
      .withData({ id: user.id, email: user.email, username: user.username });
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};
