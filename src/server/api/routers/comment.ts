import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCommentSchema } from "~/lib/schema/create-post--schema";
import { createPostSchema } from "~/lib/schema/create-post-schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.comment.create({
          data: {
            content: input.content,
            post: { connect: { id: Number(input.postId) } },
            author: { connect: { id: ctx.session.user.id } },
          },
        });
        return post;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save comment",
        });
      }
    }),
  getLatestComments: publicProcedure
    .input(z.object({ postId: z.union([z.number(), z.string()]) }))
    .query(async ({ input, ctx }) => {
      const comments = await ctx.db.comment.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          postId: Number(input.postId),
        },
        include: { author: true },
      });

      return comments;
    }),
  //   getOwnPosts: protectedProcedure.query(async ({ ctx }) => {
  //     const posts = await ctx.db.post.findMany({
  //       orderBy: { createdAt: "desc" },
  //       where: {
  //         authorId: ctx.session.user.id,
  //       },
  //       include: { author: true },
  //     });

  //     return posts;
  //   }),
});
