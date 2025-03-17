import z from "zod";

export const createPostSchema = z.object({
  // content
  content: z
    .string()
    .min(32, { message: "Post content must be at least 32 characters long." })
    .max(1000, {
      message: "Post content cannot be more than 1000 characters long.",
    }),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
