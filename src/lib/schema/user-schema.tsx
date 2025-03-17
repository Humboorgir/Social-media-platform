import z from "zod";

export const userSchema = z.object({
  // name
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(16, {
      message: "Name cannot be more than 16 characters long.",
    }),
  // email
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters long." }),
  // password
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(20, {
      message: "Password cannot be more than 20 characters long.",
    }),
});

export type UserSchema = z.infer<typeof userSchema>;
