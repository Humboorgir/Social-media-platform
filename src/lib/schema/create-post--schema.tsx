import z from "zod";

export const createCommentSchema = z.object({
  // content
  content: z
    .string()
    .min(1, {
      message: "Comment content must be at least 1 character long.",
    })
    .max(300, {
      message: "Comment content cannot be more than 300 characters long.",
    }),
  postId: z.union([z.string(), z.number()]),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
