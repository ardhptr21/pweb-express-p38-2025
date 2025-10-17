import { User } from "@prisma/client";
import { RegisterRequest } from "../domains/auth-domain";
import prisma from "../libs/prisma";

export const userExistsByEmailOrUsername = async (
  email: string,
  username: string,
): Promise<boolean> => {
  const count = await prisma.user.count({
    where: {
      OR: [{ email }, { username }],
    },
  });
  return count > 0;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { email } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { id } });
};

export const createUserFromRegister = async (
  payload: RegisterRequest,
): Promise<User> => {
  return await prisma.user.create({ data: payload });
};
