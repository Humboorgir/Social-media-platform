import z from "zod";
import { userSchema } from "./user-schema";

export const signInSchema = userSchema.pick({ email: true, password: true });

export type SignInSchema = z.infer<typeof signInSchema>;
