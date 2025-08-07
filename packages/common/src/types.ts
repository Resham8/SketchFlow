import { email, string, z } from "zod";

export const CreateUserSchema = z.object({
  email: string().min(3).max(20),
  password: string().min(8),
  name: z.string(),
});

export const SigninSchema = z.object({
  email: string().min(3).max(20),
  password: string().min(8),
});

export const CreateRoomSchema = z.object({
  name: string().min(3).max(20),
});
